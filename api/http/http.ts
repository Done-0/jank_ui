/**
 * HTTP 客户端实现
 * @file http-client.ts
 */

import { $fetch } from 'ofetch';
import type { UseFetchOptions } from '#app';
import { ApiError, NetworkError, AuthError, ValidationError, UnknownError } from '../errors';
import type { ApiResponse, ApiConfig, ResponseInterceptor, RetryConfig } from '../types';
import { ApiStatusCode, ApiErrorType, API_ERROR_MESSAGES } from '../types';
import {
    isApiResponse,
    getErrorType,
    formatError,
    retry,
    isSuccessStatus,
    generateRequestId,
    formatTimestamp
} from '../helper';

/**
 * HTTP 请求方法
 */
export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

/**
 * HTTP 客户端配置接口
 */
export interface HttpClientConfig extends ApiConfig {
    readonly retryTimes?: number;
    readonly retryDelay?: number;
    readonly timeout?: number;
    readonly headers?: Record<string, string>;
}

/**
 * 自定义请求配置类型
 */
type CustomFetchOptions<T = unknown> = Partial<UseFetchOptions<ApiResponse<T>>>;

/**
 * HTTP 客户端类
 */
export class HttpClient {
    private readonly runtimeConfig;
    private readonly defaultOptions: CustomFetchOptions;
    private readonly responseInterceptor?: ResponseInterceptor;

    constructor(
        private readonly config: HttpClientConfig,
        responseInterceptor?: ResponseInterceptor
    ) {
        this.runtimeConfig = useRuntimeConfig();
        this.responseInterceptor = responseInterceptor;
        this.defaultOptions = this.initializeDefaultOptions();
    }

    private initializeDefaultOptions(): CustomFetchOptions {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(this.config.headers || {})
        };

        return {
            headers,
            timeout: this.config.timeout || 10000,
            retry: this.config.retryTimes || 0,
        };
    }

    private async request<TResponse>(
        url: string,
        options?: CustomFetchOptions<TResponse>
    ): Promise<ApiResponse<TResponse>> {
        const mergedHeaders = this.buildHeaders(options?.headers as Record<string, string>);
        const finalOptions = this.buildRequestOptions<TResponse>(options, mergedHeaders);

        try {
            return await this.executeRequest<TResponse>(url, finalOptions);
        } catch (error: unknown) {
            return await this.handleRequestError(error);
        }
    }

    private buildHeaders(optionsHeaders?: Record<string, string>): Record<string, string> {
        const defaultHeaders = this.defaultOptions.headers as Record<string, string> || {};
        return {
            ...defaultHeaders,
            ...(optionsHeaders || {}),
        };
    }

    private buildRequestOptions<TResponse>(
        options?: CustomFetchOptions<TResponse>,
        headers?: Record<string, string>
    ): UseFetchOptions<ApiResponse<TResponse>> {
        const finalOptions: UseFetchOptions<ApiResponse<TResponse>> = {
            ...this.defaultOptions,
            ...options,
            headers: {
                ...headers,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            } as HeadersInit,
        } as UseFetchOptions<ApiResponse<TResponse>>;

        if (finalOptions.body && typeof finalOptions.body === 'object') {
            finalOptions.body = JSON.stringify(finalOptions.body);
        }

        delete finalOptions.getCachedData;
        delete finalOptions.transform;

        return finalOptions;
    }

    private async executeRequest<TResponse>(
        url: string,
        options: UseFetchOptions<ApiResponse<TResponse>>,
    ): Promise<ApiResponse<TResponse>> {
        const makeRequest = async (): Promise<ApiResponse<TResponse>> => {
            const baseURL = this.runtimeConfig.public.apiBase;
            const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

            try {
                const fetchOptions = {
                    method: String(options.method),
                    headers: options.headers as HeadersInit,
                    body: options.body,
                    query: options.query,
                    timeout: options.timeout as number,
                };

                const response = await $fetch<ApiResponse<TResponse>>(fullUrl, fetchOptions);

                if (!response) {
                    return {
                        code: ApiStatusCode.ERROR,
                        msg: API_ERROR_MESSAGES[ApiStatusCode.ERROR],
                        data: null,
                        requestId: generateRequestId(),
                        timestamp: formatTimestamp(Date.now())
                    } as ApiResponse<TResponse>;
                }

                if (typeof response === 'string') {
                    try {
                        return JSON.parse(response);
                    } catch {
                        return {
                            code: ApiStatusCode.ERROR,
                            msg: response,
                            data: null,
                            requestId: generateRequestId(),
                            timestamp: formatTimestamp(Date.now())
                        } as ApiResponse<TResponse>;
                    }
                }

                if (isApiResponse(response)) {
                    return response as ApiResponse<TResponse>;
                }

                return {
                    code: ApiStatusCode.SUCCESS,
                    msg: 'OK',
                    data: response as TResponse,
                    requestId: generateRequestId(),
                    timestamp: formatTimestamp(Date.now())
                };

            } catch (error) {
                console.error('Response error:', error);
                throw error;
            }
        };

        const retryConfig = this.getRetryConfig();
        return await retry<ApiResponse<TResponse>>(
            makeRequest,
            retryConfig.times,
            retryConfig.delay,
            retryConfig.shouldRetry
        );
    }

    private async processDirectResponse<TResponse>(
        response: ApiResponse<TResponse>
    ): Promise<ApiResponse<TResponse>> {
        if (!response) {
            return {
                code: ApiStatusCode.ERROR,
                msg: API_ERROR_MESSAGES[ApiStatusCode.ERROR],
                data: null
            } as ApiResponse<TResponse>;
        }

        let result = response;

        try {
            if (this.responseInterceptor?.onSuccess) {
                result = await this.responseInterceptor.onSuccess(result);
            }

            if (!('code' in result) && !('msg' in result)) {
                return {
                    code: ApiStatusCode.SUCCESS,
                    msg: 'OK',
                    data: result as unknown as TResponse,
                    requestId: generateRequestId(),
                    timestamp: formatTimestamp(Date.now())
                };
            }

            if (!isSuccessStatus(result.code)) {
                throw new ApiError(result.code, result.msg || 'Request failed', result.data);
            }

            return result;
        } catch (err) {
            console.error('Process response error:', err);
            if (err instanceof ApiError) {
                throw err;
            }
            throw new ApiError(
                ApiStatusCode.ERROR,
                err instanceof Error ? err.message : 'Unknown error'
            );
        }
    }

    private getRetryConfig(): RetryConfig {
        return {
            times: this.config.retryTimes || 0,
            delay: this.config.retryDelay || 1000,
            shouldRetry: (error: unknown) => {
                const errorType = getErrorType(error);
                return errorType === ApiErrorType.NETWORK;
            }
        };
    }

    private async handleRequestError(error: unknown): Promise<never> {
        console.error('Handle request error:', error);

        if (this.responseInterceptor?.onError) {
            try {
                return await this.responseInterceptor.onError(error);
            } catch (interceptorError) {
                console.error('Error interceptor failed:', interceptorError);
            }
        }

        const errorType = getErrorType(error);
        const errorMessage = formatError(error);

        const errorResponse = error instanceof ApiError ? error : null;
        const statusCode = errorResponse?.code || ApiStatusCode.ERROR;
        const message = errorResponse?.message || errorMessage;

        switch (errorType) {
            case ApiErrorType.NETWORK:
                throw new NetworkError(message);
            case ApiErrorType.AUTH:
                throw new AuthError(message);
            case ApiErrorType.VALIDATION:
                throw new ValidationError(message);
            case ApiErrorType.BUSINESS:
                throw new ApiError(statusCode, message);
            default:
                throw new UnknownError(message);
        }
    }

    public get<T>(
        url: string,
        options?: Omit<CustomFetchOptions<T>, 'method'>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            ...options,
            method: HttpMethod.GET,
        });
    }

    public post<T>(
        url: string,
        data?: Record<string, unknown>,
        options?: Omit<CustomFetchOptions<T>, 'method' | 'body'>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            ...options,
            method: HttpMethod.POST,
            body: data,
        });
    }

    public put<T>(
        url: string,
        data?: Record<string, unknown>,
        options?: Omit<CustomFetchOptions<T>, 'method' | 'body'>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            ...options,
            method: HttpMethod.PUT,
            body: data,
        });
    }

    public delete<T>(
        url: string,
        options?: Omit<CustomFetchOptions<T>, 'method'>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            ...options,
            method: HttpMethod.DELETE,
        });
    }

    public patch<T>(
        url: string,
        data?: Record<string, unknown>,
        options?: Omit<CustomFetchOptions<T>, 'method' | 'body'>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            ...options,
            method: HttpMethod.PATCH,
            body: data,
        });
    }
}

/**
 * 创建 HTTP 客户端实例
 */
export const createHttpClient = (
    responseInterceptor?: ResponseInterceptor
): HttpClient => {
    const config = useRuntimeConfig();
    const version = typeof config.public.version === 'string'
        ? config.public.version
        : '1.0.0';

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Client-Version': version
    };

    return new HttpClient({
        baseURL: config.public.apiBase,
        timeout: 10000,
        retryTimes: 1,
        retryDelay: 1000,
        headers
    }, responseInterceptor);
};

/**
 * HTTP 客户端 Hook
 */
export const useHttp = (
    responseInterceptor?: ResponseInterceptor
): HttpClient => {
    return createHttpClient(responseInterceptor);
};
