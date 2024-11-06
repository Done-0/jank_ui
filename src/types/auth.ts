export interface LoginRequest {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginResponse {
  user_id: string;
  access_token: string;
  refresh_token: UserInfo;
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}
export interface UserInfo {
  email: string;
  nickname: string;
  phone: string;
  role_code: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface UserProfile {
  id: string
  email: string
  avatar?: string
  name: string
}
