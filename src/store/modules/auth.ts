import { defineStore } from 'pinia'
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  UserInfo,
  UserProfile,
  ApiResponse 
} from '@/types/auth'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userProfile = ref<UserProfile | null>(null)
  const userInfo = ref<UserInfo | null>(null)
  const accessToken = ref<string | null>(null)
  
  const isAuthenticated = computed(() => !!accessToken.value)

  // 从 localStorage 恢复状态
  const initializeFromStorage = () => {
    const storedToken = localStorage.getItem('access_token')
    const storedUserInfo = localStorage.getItem('user_info')
    const storedProfile = localStorage.getItem('user_profile')
    
    if (storedToken) {
      accessToken.value = storedToken
    }
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo)
      } catch (e) {
        console.error('Failed to parse stored user info')
      }
    }
    if (storedProfile) {
      try {
        userProfile.value = JSON.parse(storedProfile)
      } catch (e) {
        console.error('Failed to parse stored user profile')
      }
    }
  }

  // 保存状态到 localStorage
  const saveToStorage = (token: string, info: UserInfo, profile: UserProfile) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('user_info', JSON.stringify(info))
    localStorage.setItem('user_profile', JSON.stringify(profile))
  }

  // 清除存储的状态
  const clearStorage = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
    localStorage.removeItem('user_profile')
  }

  const login = async (payload: LoginRequest) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('登录失败')
      }

      const { data }: ApiResponse<LoginResponse> = await response.json()
      
      // 设置状态
      accessToken.value = data.access_token
      userInfo.value = data.refresh_token // refresh_token 包含 UserInfo
      userProfile.value = {
        id: data.user_id,
        email: data.refresh_token.email,
        name: data.refresh_token.nickname,
        // avatar 可能需要从其他 API 获取
      }
      
      // 如果选择了"记住我"，则保存到 localStorage
      if (payload.remember) {
        saveToStorage(data.access_token, data.refresh_token, userProfile.value)
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (payload: RegisterRequest) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('注册失败')
      }

      const { data }: ApiResponse<LoginResponse> = await response.json()
      
      // 设置状态
      accessToken.value = data.access_token
      userInfo.value = data.refresh_token
      userProfile.value = {
        id: data.user_id,
        email: data.refresh_token.email,
        name: data.refresh_token.nickname,
      }
      
      // 保存到 localStorage
      saveToStorage(data.access_token, data.refresh_token, userProfile.value)

      return data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = () => {
    // 清除状态
    accessToken.value = null
    userInfo.value = null
    userProfile.value = null
    
    // 清除存储
    clearStorage()
  }

  // 初始化时从 localStorage 恢复状态
  initializeFromStorage()

  return {
    userProfile,
    userInfo,
    accessToken,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
