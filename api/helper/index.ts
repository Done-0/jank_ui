import { ApiError } from '../errors/index';
import type { ApiResponse } from '../types';
import { ApiStatusCode, ApiErrorType } from '../types';

const DEFAULT_ERROR_MESSAGE = '未知错误';

/**
 * 类型守卫：检查响应是否为 API 响应格式
 */
export const isApiResponse = <T>(data: unknown): data is ApiResponse<T> => {
    if (!data || typeof data !== 'object') return false;

    const response = data as Partial<ApiResponse<T>>;
    return (
        typeof response.code === 'number' &&
        typeof response.msg === 'string' &&
        'data' in response &&
        typeof response.requestId === 'string' &&
        typeof response.timeStamp === 'number'
    );
};

/**
 * 获取错误类型
 */
export const getErrorType = (error: unknown): ApiErrorType => {
    if (error instanceof Error) {
        switch (error.name) {
            case 'NetworkError':
                return ApiErrorType.NETWORK;
            case 'AuthError':
                return ApiErrorType.AUTH;
            case 'ValidationError':
                return ApiErrorType.VALIDATION;
            default:
                return error instanceof ApiError ? ApiErrorType.BUSINESS : ApiErrorType.UNKNOWN;
        }
    }
    return ApiErrorType.UNKNOWN;
};

/**
 * 格式化错误信息
 */
export const formatError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (isApiResponse(error)) {
        return error.msg;
    }
    return DEFAULT_ERROR_MESSAGE;
};

/**
 * 延迟执行
 */
export const sleep = (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));

/**
 * 重试函数
 */
export async function retry<T>(
    fn: () => Promise<T>,
    times: number,
    delay: number,
    shouldRetry?: (error: unknown) => boolean
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (times === 0 || (shouldRetry && !shouldRetry(error))) {
            throw error;
        }
        await sleep(delay);
        return retry(fn, times - 1, delay, shouldRetry);
    }
}

/**
 * 检查是否为成功状态码
 */
export const isSuccessStatus = (code: ApiStatusCode): boolean => 
    code === ApiStatusCode.SUCCESS;

/**
 * 生成请求ID
 */
export const generateRequestId = (): string => 
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * 格式化时间戳
 */
export const formatTimestamp = (timestamp: number): string => 
    new Date(timestamp).toISOString();
