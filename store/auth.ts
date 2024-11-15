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
  ImgVerificationResponse
} from '~/types/auth';
import { STORAGE_KEYS } from '~/types/auth';

export interface AuthState {
  user: User | null;                   // 当前用户信息
  accessToken: string;                 // 访问令牌
  refreshToken: string;                // 刷新令牌
  loading: boolean;                    // 加载状态
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: '',
    refreshToken: '',
    loading: false
  }),

  getters: {
    isLoggedIn(state: AuthState): boolean {
      return !!state.accessToken && !!state.user;
    }
  },

  actions: {
    // 登录
    async login(form: LoginRequest): Promise<void> {
      this.loading = true;
      try {
        const response = await useAuthApi().login(form);
        if (response.data) {
          const token = response.data as LoginResponse;
          this.accessToken = token.accessToken;
          this.refreshToken = token.refreshToken;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token.refreshToken);
          }
          
          await this.fetchProfile();
        }
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 注册
    async register(form: RegisterRequest): Promise<void> {
      this.loading = true;
      try {
        const response = await useAuthApi().register(form);
        if (response.data) {
          const token = response.data as RegisterResponse;
          this.accessToken = token.accessToken;
          this.refreshToken = token.refreshToken;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token.refreshToken);
          }
          
          await this.fetchProfile();
        }
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 登出
    async logout(): Promise<void> {
      try {
        await useAuthApi().logout();
      } catch (error) {
        console.error('Logout failed:', error);
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
    async fetchProfile(): Promise<void> {
      this.loading = true;
      try {
        const response = await useAuthApi().getProfile();
        if (response.data) {
          this.user = response.data as ProfileResponse;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 初始化存储
    initializeFromStorage(): void {
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
      } catch (error) {
        console.error('Failed to initialize auth store:', error);
        this.user = null;
        this.accessToken = '';
        this.refreshToken = '';
      }
    },

    // 发送邮箱验证码
    async sendEmailVerificationCode(email: string): Promise<void> {
      this.loading = true;
      try {
        await useAuthApi().sendEmailVerificationCode({ email });
      } catch (error) {
        console.error('Failed to send verification code:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 生成图片验证码
    async genImgVerification(email: string): Promise<string | null> {
      this.loading = true;
      try {
        const response = await useAuthApi().genImgVerification({ email });
        if (response.data) {
          const data = response.data as ImgVerificationResponse;
          return data.imgBase64;
        }
        return null;
      } catch (error) {
        console.error('Failed to generate image verification:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});