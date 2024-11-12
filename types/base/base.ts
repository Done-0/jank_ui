export enum ApiStatusCode {
    SUCCESS = 200,           // 成功
    BAD_REQUEST = 400,       // 错误的请求
    UNAUTHORIZED = 401,      // 未授权
    FORBIDDEN = 403,         // 禁止访问
    NOT_FOUND = 404,         // 资源未找到
    INTERNAL_ERROR = 20001,  // 内部错误
}

export interface BaseResponse<T> {
code: ApiStatusCode | number
msg: string
data: T
}

export interface PageResponse<T> {
list: T[]
total: number
page: number
pageSize: number
}
