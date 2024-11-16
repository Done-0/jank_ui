// types/auth.ts

/**
 * 用户状态
 */
export enum UserStatus {
    ACTIVE = 'active',       // 活动状态
    INACTIVE = 'inactive',   // 非活动状态
    SUSPENDED = 'suspended'  // 暂停状态
}

/**
 * 用户接口
 */
export interface User {
    id: string;              // 用户唯一标识
    nickname: string;        // 用户昵称
    email: string;           // 用户邮箱
    status: UserStatus;      // 用户状态
    roleCode: string;        // 用户角色代码
    phone?: string;          // 用户电话（可选）
    avatar: string;          // 用户头像
}

/**
 * 用户令牌信息
 */
export interface JWTToken {
    userId: string;          // 用户ID
    accessToken: string;     // 访问令牌
    refreshToken: string;    // 刷新令牌
}

// 登录响应类型
export type LoginResponse = JWTToken;

// 注册响应类型
export type RegisterResponse = JWTToken;

// 用户资料响应类型
export type ProfileResponse = User;

/**
 * 注册请求参数
 */
export interface RegisterRequest extends Record<string, unknown> {
    email: string;                       // 用户邮箱
    phone?: string;                      // 用户电话（可选）
    nickname: string;                    // 用户昵称
    password: string;                    // 用户密码
    emailVerificationCode: string;       // 邮箱验证码
    imgVerificationCode: string;         // 图片验证码
}

/**
 * 登录请求参数
 */
export interface LoginRequest extends Record<string, unknown> {
    email: string;                       // 用户邮箱
    password: string;                    // 用户密码
    imgVerificationCode: string;         // 图片验证码
    remember?: boolean;                  // 是否记住登录状态（可选）
}

/**
 * 重置密码请求参数
 */
export interface ResetPasswordRequest extends Record<string, unknown> {
    email: string;                       // 用户邮箱
    newPassword: string;                 // 新密码
    confirmNewPassword: string;          // 再次输入的新密码
    emailVerificationCode: string;       // 邮箱验证码
}

/**
 * 邮箱验证码请求参数
 */
export interface EmailVerificationRequest extends Record<string, unknown> {
    email: string;                       // 用户邮箱
}

/**
 * 图形验证码请求参数
 */
export interface ImgVerificationRequest extends Record<string, unknown> {
    email: string;                       // 用户邮箱
}

/**
 * 图片验证码响应
 */
export interface ImgVerificationResponse extends Record<string, unknown> {
    imgBase64: string;                   // 图片验证码的Base64编码
}

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
    USER: 'user',                        // 用户信息
    ACCESS_TOKEN: 'access_token',        // 访问令牌
    REFRESH_TOKEN: 'refresh_token',      // 刷新令牌
} as const;