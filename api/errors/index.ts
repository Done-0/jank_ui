import { API_ERROR_MESSAGES, ApiStatusCode } from '../types';

/**
 * API 基础错误类
 */
export class ApiError extends Error {
    public readonly timestamp: number;

    constructor(
        public readonly code: ApiStatusCode,
        message?: string,
        public readonly data?: unknown
    ) {
        super(message || API_ERROR_MESSAGES[code] || API_ERROR_MESSAGES[ApiStatusCode.REQUEST_ERROR]);
        this.name = 'ApiError';
        this.timestamp = Date.now();
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    public toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            data: this.data,
            timestamp: this.timestamp,
        };
    }
}

/**
 * 网络错误类
 */
export class NetworkError extends Error {
    public readonly timestamp: number;

    constructor(message = API_ERROR_MESSAGES[ApiStatusCode.NETWORK_ERROR]) {
        super(message);
        this.name = 'NetworkError';
        this.timestamp = Date.now();
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}

/**
 * 认证错误类
 */
export class AuthError extends ApiError {
    constructor(message = API_ERROR_MESSAGES[ApiStatusCode.UNAUTHORIZED]) {
        super(ApiStatusCode.UNAUTHORIZED, message);
        this.name = 'AuthError';
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}

/**
 * 参数验证错误类
 */
export class ValidationError extends ApiError {
    constructor(message = API_ERROR_MESSAGES[ApiStatusCode.VALIDATION]) {
        super(ApiStatusCode.VALIDATION, message);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * 未知错误类
 */
export class UnknownError extends ApiError {
    constructor(message = API_ERROR_MESSAGES[ApiStatusCode.UNKNOWN_ERROR]) {
        super(ApiStatusCode.UNKNOWN_ERROR, message);
        this.name = 'UnknownError';
        Object.setPrototypeOf(this, UnknownError.prototype);
    }
}
