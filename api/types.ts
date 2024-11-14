/**
 * API 状态码
 */
export enum ApiStatusCode {
    SUCCESS       = 200,
    BAD_REQUEST   = 400,
    UNAUTHORIZED  = 401,
    FORBIDDEN     = 403,
    NOT_FOUND     = 404,
    VALIDATION    = 422,
    ERROR         = 500,
    NETWORK_ERROR = -1,
    REQUEST_ERROR = -2,
    UNKNOWN_ERROR = -3,
}

/**
 * API 错误消息
 */
export const API_ERROR_MESSAGES: Readonly<Record<ApiStatusCode, string>> = {
    [ApiStatusCode.SUCCESS]:       '请求成功',
    [ApiStatusCode.BAD_REQUEST]:   '请求参数错误',
    [ApiStatusCode.UNAUTHORIZED]:  '未授权，请重新登录',
    [ApiStatusCode.FORBIDDEN]:     '无权访问',
    [ApiStatusCode.NOT_FOUND]:     '资源不存在',
    [ApiStatusCode.VALIDATION]:    '参数校验失败',
    [ApiStatusCode.ERROR]:         '服务器内部错误',
    [ApiStatusCode.NETWORK_ERROR]: '网络连接失败，请检查网络设置',
    [ApiStatusCode.REQUEST_ERROR]: '请求失败',
    [ApiStatusCode.UNKNOWN_ERROR]: '未知错误，请稍后再试',
} as const;

/**
 * API 错误类型
 */
export enum ApiErrorType {
    BUSINESS   = 'BUSINESS',
    NETWORK    = 'NETWORK',
    AUTH       = 'AUTH',
    VALIDATION = 'VALIDATION',
    UNKNOWN    = 'UNKNOWN',
}

/**
 * API 响应接口
 */
export interface ApiResponse<T = unknown> {
    readonly code: ApiStatusCode;
    readonly msg: string;
    readonly data: T | null;
    readonly requestId: string;
    readonly timeStamp: number;
}

/**
 * API 配置接口
 */
export interface ApiConfig {
    readonly baseURL: string;
    readonly timeout?: number;
    readonly headers?: Readonly<Record<string, string>>;
    readonly retryTimes?: number;
    readonly retryDelay?: number;
}

/**
 * 重试配置接口
 */
export interface RetryConfig {
    readonly times: number;
    readonly delay: number;
    readonly shouldRetry?: (error: unknown) => boolean;
}

/**
 * 响应拦截器接口
 */
export interface ResponseInterceptor {
    onSuccess?: <T>(response: ApiResponse<T>) => Promise<ApiResponse<T>> | ApiResponse<T>;
    onError?: (error: unknown) => Promise<never>;
}
