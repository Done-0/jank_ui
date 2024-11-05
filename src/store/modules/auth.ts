import { defineStore } from 'pinia'
import { authApi } from '@/api/modules/auth'
import type { LoginRequest, UserInfo, LoginResponse, ApiResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    access_token: localStorage.getItem('access_token') || '',
    refresh_token: null as UserInfo | null,
    userInfo: null as UserInfo | null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.access_token,
    
    // role_code
    hasRole: (state) => (roleCode: string) => 
      state.userInfo?.role_code === roleCode,
  },
  
  actions: {
    async login(params: LoginRequest) {
      const { data } = await authApi.login(params) as ApiResponse<LoginResponse>
      
      this.access_token = data.access_token
      this.refresh_token = data.refresh_token
      this.userInfo = data.refresh_token
      
      if (params.remember) {
        localStorage.setItem('access_token', data.access_token)
      }
    },
    
    async getUserInfo() {
      const { data } = await authApi.getUserInfo() as ApiResponse<UserInfo>
      this.userInfo = data
    },
    
    async logout() {
      try {
        await authApi.logout()
      } finally {
        this.access_token = ''
        this.refresh_token = null
        this.userInfo = null
        localStorage.removeItem('access_token')
      }
    }
  }
})
