import type { BaseResponse } from "~/types/base/base"

// 请求接口
export interface LoginRequest {
  email: string
  password: string
  verificationCode: string
  remember: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

// 响应接口
export interface LoginResponse {
  userId: string          
  accessToken: string     
  userInfo: UserInfo      
}

export interface UserInfo {
  email: string
  nickname: string
  phone: string
  roleCode: string       
}

export interface UserProfile {
  id: string
  email: string
  avatar?: string
  name: string
}

export interface CaptchaResponse {
  code: number
  data: {
    imgBase64: string
  }
  msg: string
}

export type AuthResponse = BaseResponse<LoginResponse>
