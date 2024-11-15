// types/post.ts

/**
 * 用户状态
 */
export enum UserStatus {
    AUTHORIZED = 'authorized',       // 登录状态
    UNAUTHORIZED = 'unauthorized',   // 非登录状态
}

/**
 * 文章接口
 */
export interface Post {
    id: string;              // 文章唯一标识
    title: string;           // 文章标题
    image: string;           // 文章图片
    visibility: string;      // 文章可见性
    contentHTML: string;     // 文章内容HTML
    summary?: string | null; // 文章摘要
}

/**
 * 创建文章请求参数
 */
export interface CreatePostRequest extends Record<string, unknown> {
    title: string;           // 文章标题
    img: string;             // 文章图片
    visibility: string;      // 文章可见性
    contentMarkdown: string; // 文章内容
}

/**
 * 获取文章请求参数
 */
export interface GetPostRequest extends Record<string, unknown> {
    id: string;              // 文章ID
    title: string;           // 文章标题
}

/**
 * 删除文章请求参数
 */
export interface DeletePostRequest extends Record<string, unknown> {
    id: string;              // 文章ID
}

/**
 * 更新文章请求参数
 */
export interface UpdatePostRequest extends Record<string, unknown> {
    id: string;              // 文章ID
    title: string;           // 文章标题
    img: string;             // 文章图片
    visibility: string;      // 文章可见性
    contentMarkdown: string; // 文章内容
}

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
    POST: 'post'             // 文章信息
} as const;