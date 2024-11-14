import { useHttp } from '~/api/http';
import { API_ROUTES } from '~/api/route';
import type { 
    LoginRequest, 
    RegisterRequest, 
    LoginResponse,
    RegisterResponse,
    ProfileResponse,
    ResetPasswordRequest,
    EmailVerificationRequest,
    ImgVerificationRequest,
    ImgVerificationResponse
} from '~/types/auth';
import type { ApiResponse } from '../types';

/**
 * 认证相关 API 模块
 */
export const useAuthApi = () => {
    const http = useHttp();
    
    return {
        /**
         * 用户登录
         */
        login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
            return http.post(API_ROUTES.ACCOUNT.LOGIN, data);
        },

        /**
         * 用户注册
         */
        register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
            return http.post(API_ROUTES.ACCOUNT.REGISTER, data);
        },

        /**
         * 用户登出
         */
        logout(): Promise<ApiResponse<void>> {
            return http.post(API_ROUTES.ACCOUNT.LOGOUT);
        },

        /**
         * 获取用户资料
         */
        getProfile(): Promise<ApiResponse<ProfileResponse>> {
            return http.get(API_ROUTES.ACCOUNT.PROFILE);
        },

        /**
         * 更新用户资料
         */
        updateProfile(data: Partial<ProfileResponse>): Promise<ApiResponse<ProfileResponse>> {
            return http.post(API_ROUTES.ACCOUNT.PROFILE, data);
        },

        /**
         * 重置密码
         */
        resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
            return http.post(API_ROUTES.ACCOUNT.RESET_PASSWORD, data);
        },

        /**
         * 发送邮箱验证码
         */
        sendEmailVerificationCode(data: EmailVerificationRequest): Promise<ApiResponse<void>> {
            return http.get(
                `${API_ROUTES.ACCOUNT.GEN_IMG_VERIFICATION}?email=${encodeURIComponent(data.email)}`
            );
        },

        /**
         * 生成图片验证码
         */
        genImgVerification(
            data: ImgVerificationRequest
        ): Promise<ApiResponse<ImgVerificationResponse>> {
            return http.get(
                `${API_ROUTES.ACCOUNT.GEN_IMG_VERIFICATION}?email=${encodeURIComponent(data.email)}`
            );
        }
    };
};
