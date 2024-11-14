import type { UseFetchOptions } from '#app';
import type { ApiResponse, ApiConfig } from '~/api/types';
import { ApiError, NetworkError } from '~/api/errors';
import { ApiStatusCode, API_ERROR_MESSAGES } from '~/api/types';

/**
 * HTTP 请求方法
 * @enum {string}
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
 * @interface HttpClientConfig
 * @extends {ApiConfig}
 */
export interface HttpClientConfig extends ApiConfig {
  /** 重试次数 */
  readonly retryTimes?: number;
  /** 重试延迟时间(ms) */
  readonly retryDelay?: number;
  /** 超时时间(ms) */
  readonly timeout?: number;
}

/**
 * HTTP 客户端类
 * @class HttpClient
 */
export class HttpClient {
  private readonly defaultOptions: Partial<UseFetchOptions<unknown>>;
  private readonly runtimeConfig: ReturnType<typeof useRuntimeConfig>;

  /**
   * 创建 HTTP 客户端实例
   * @param {HttpClientConfig} config - 客户端配置
   */
  constructor(private readonly config: HttpClientConfig) {
    this.runtimeConfig = useRuntimeConfig();
    this.defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
      timeout: this.config.timeout || 10000,
      retry: this.config.retryTimes || 0,
    };
  }

  /**
   * 发送 HTTP 请求
   * @template T - 响应数据类型
   * @param {string} url - 请求地址
   * @param {UseFetchOptions<ApiResponse<T>>} [options] - 请求配置
   * @returns {Promise<ApiResponse<T>>} 请求响应
   * @throws {ApiError} API 错误
   * @throws {NetworkError} 网络错误
   * @private
   */
  private async request<T>(
    url: string,
    options?: UseFetchOptions<ApiResponse<T>>
  ): Promise<ApiResponse<T>> {
    const finalOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options?.headers,
      },
    } as UseFetchOptions<ApiResponse<T>>;

    try {
      const baseURL = this.runtimeConfig.public.apiBase;
      const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
      
      console.log('Request URL:', fullUrl); // 调试日志

      const response = await useFetch<ApiResponse<T>>(fullUrl, finalOptions);

      if (!response.data.value) {
        throw new ApiError(
          ApiStatusCode.ERROR, 
          'No response data received'
        );
      }

      return response.data.value;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout');
        }
        throw new NetworkError(error.message);
      }

      throw new ApiError(
        ApiStatusCode.ERROR, 
        API_ERROR_MESSAGES[ApiStatusCode.ERROR]
      );
    }
  }

  /**
   * 发送 GET 请求
   * @template T - 响应数据类型
   * @param {string} url - 请求地址
   * @param {Omit<UseFetchOptions<ApiResponse<T>>, 'method'>} [options] - 请求配置
   * @returns {Promise<ApiResponse<T>>} 请求响应
   */
  public get<T>(
    url: string, 
    options?: Omit<UseFetchOptions<ApiResponse<T>>, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { 
      ...options, 
      method: HttpMethod.GET 
    });
  }

  /**
   * 发送 POST 请求
   * @template T - 响应数据类型
   * @param {string} url - 请求地址
   * @param {Record<string, unknown>} [data] - 请求数据
   * @param {Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'>} [options] - 请求配置
   * @returns {Promise<ApiResponse<T>>} 请求响应
   */
  public post<T>(
    url: string, 
    data?: Record<string, unknown>, 
    options?: Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { 
      ...options, 
      method: HttpMethod.POST, 
      body: data 
    });
  }

  /**
   * 发送 PUT 请求
   * @template T - 响应数据类型
   * @param {string} url - 请求地址
   * @param {Record<string, unknown>} [data] - 请求数据
   * @param {Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'>} [options] - 请求配置
   * @returns {Promise<ApiResponse<T>>} 请求响应
   */
  public put<T>(
    url: string, 
    data?: Record<string, unknown>, 
    options?: Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { 
      ...options, 
      method: HttpMethod.PUT, 
      body: data 
    });
  }

  /**
   * 发送 DELETE 请求
   * @template T - 响应数据类型
   * @param {string} url - 请求地址
   * @param {Omit<UseFetchOptions<ApiResponse<T>>, 'method'>} [options] - 请求配置
   * @returns {Promise<ApiResponse<T>>} 请求响应
   */
  public delete<T>(
    url: string, 
    options?: Omit<UseFetchOptions<ApiResponse<T>>, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { 
      ...options, 
      method: HttpMethod.DELETE 
    });
  }

  /**
   * 发送 PATCH 请求
   * @template T - 响应数据类型
   * @param {string} url - 请求地址
   * @param {Record<string, unknown>} [data] - 请求数据
   * @param {Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'>} [options] - 请求配置
   * @returns {Promise<ApiResponse<T>>} 请求响应
   */
  public patch<T>(
    url: string, 
    data?: Record<string, unknown>, 
    options?: Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { 
      ...options, 
      method: HttpMethod.PATCH, 
      body: data 
    });
  }
}

/**
 * 创建 HTTP 客户端实例
 */
export const createHttpClient = () => {
  const config = useRuntimeConfig();
  return new HttpClient({
    baseURL: config.public.apiBase,
    timeout: 10000,
    retryTimes: 1,
    retryDelay: 1000,
  });
};

/**
 * 获取 HTTP 客户端实例的 composable
 */
export const useHttp = () => {
  return createHttpClient();
};
