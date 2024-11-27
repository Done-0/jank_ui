// store/auth.ts
import { defineStore } from 'pinia';
import { useAuthApi } from '~/api/modules/auth';
import type { 
  LoginRequest, 
  RegisterRequest, 
  User, 
  LoginResponse,
  RegisterResponse,
  ProfileResponse,
} from '~/types/auth';
import { STORAGE_KEYS } from '~/types/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: '',
    refreshToken: '',
    loading: null as boolean | null,
    error: null as string | null,
  }),

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setError(error: string | null) {
      this.error = error;
    },
    clearError() {
      this.error = null;
    },
    // 初始化存储
    initializeFromStorage() {
      if (typeof window === 'undefined') return;
      
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userJson = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (accessToken) {
          this.accessToken = accessToken;
          this.refreshToken = refreshToken || '';
        }
        
        if (userJson) {
          const userData = JSON.parse(userJson);
          this.user = userData as User;
        }
      } catch (e) {
        this.setError('Failed to initialize from storage:' + e);
        this.user = null;
        this.accessToken = '';
        this.refreshToken = '';
      }
    },

    // 登录
    async login(form: LoginRequest) {
      this.setLoading(true);
      try {
        const response = await useAuthApi().login(form);
        if (response.data) {
          const token = response.data as LoginResponse;
          if (token) {
            this.accessToken = token.accessToken;
            this.refreshToken = token.refreshToken;
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token.refreshToken);
          }          
          await this.fetchProfile();
        }
      } catch (e) {
        this.setError('Failed to login in:' + e);
      } finally {
        this.setLoading(false);
      }
    },

    // 注册
    async register(form: RegisterRequest): Promise<void> {
      this.setLoading(true);
      try {
        const response = await useAuthApi().register(form);
        if (response.data) {
          const token = response.data as RegisterResponse;
          if (token) {
            this.accessToken = token.accessToken;
            this.refreshToken = token.refreshToken;
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token.refreshToken);
          }
          await this.fetchProfile();
        }
      } catch (e) {
        this.setError('Failed to register:' + e);
      } finally {
        this.setLoading(false);
      }
    },

    // 登出
    async logout() {
      try {
        await useAuthApi().logout();
      } catch (e) {
        this.setError('Failed to register:' + e);
      } finally {
        this.accessToken = '';
        this.refreshToken = '';
        this.user = null;
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }
    },

    // 获取用户资料
    async fetchProfile() {
      this.setLoading(true);
      try {
        const response = await useAuthApi().getProfile();
        if (response.data) {
          this.user = response.data as ProfileResponse;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
          }
        }
      } catch (e) {
        this.setError('Failed to get profile:' + e);
      } finally {
        this.setLoading(false);
      }
    },

    // 发送邮箱验证码
    async sendEmailVerificationCode(email: string) {
      this.setLoading(true);
      try {
        await useAuthApi().sendEmailVerificationCode({ email });
      } catch (e) {
        this.setError('Failed to send email verification code:' + e);
      } finally {
        this.setLoading(false);
      }
    },

    // 生成图片验证码
    async genImgVerification(email: string) {
      this.setLoading(true);
      try {
        const response = await useAuthApi().genImgVerification({ email });
        if (response.data?.imgBase64) {
          // 直接返回 base64 字符串
          return response.data?.imgBase64;
        }
        return null;
      } catch (e) {
        this.setError('Failed to generate image verification code:' + e);
        return null;
      } finally {
        this.setLoading(false);
      }
    }
  }
});