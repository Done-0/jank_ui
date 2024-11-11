import { defineStore } from 'pinia'
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  UserInfo,
  UserProfile,
  ApiResponse 
} from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态定义
  const state = useState('auth', () => ({
    userProfile: null as UserProfile | null,
    userInfo: null as UserInfo | null,
    accessToken: null as string | null,
  }))

  // 计算属性
  const isAuthenticated = computed(() => !!state.value.accessToken)

  // 状态更新函数
  const updateState = (token: string | null, info: UserInfo | null, profile: UserProfile | null) => {
    state.value = {
      accessToken: token,
      userInfo: info,
      userProfile: profile
    }
  }

  // API 调用和状态管理
  const login = async (payload: LoginRequest) => {
    try {
      const { data } = await useFetch<ApiResponse<LoginResponse>>('/account/loginAccount', {
        method: 'POST',
        body: payload,
      })

      if (!data.value) {
        throw new Error('登录失败')
      }

      const response = data.value
      const profile: UserProfile = {
        id: response.data.user_id,
        email: response.data.refresh_token.email,
        name: response.data.refresh_token.nickname,
      }

      // 更新状态
      updateState(
        response.data.access_token,
        response.data.refresh_token,
        profile
      )

      // 如果选择了"记住我"，则保存到 localStorage
      if (payload.remember && import.meta.client) {
        const storage = useLocalStorage()
        storage.setAuth(
          response.data.access_token,
          response.data.refresh_token,
          profile
        )
      }

      return response.data
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  const register = async (payload: RegisterRequest) => {
    try {
      const { data } = await useFetch<ApiResponse<LoginResponse>>('/account/registerAccount', {
        method: 'POST',
        body: payload,
      })

      if (!data.value) {
        throw new Error('注册失败')
      }

      const response = data.value
      const profile: UserProfile = {
        id: response.data.user_id,
        email: response.data.refresh_token.email,
        name: response.data.refresh_token.nickname,
      }

      // 更新状态
      updateState(
        response.data.access_token,
        response.data.refresh_token,
        profile
      )

      if (import.meta.client) {
        const storage = useLocalStorage()
        storage.setAuth(
          response.data.access_token,
          response.data.refresh_token,
          profile
        )
      }

      return response.data
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    }
  }

  const logout = () => {
    updateState(null, null, null)
    if (import.meta.client) {
      const storage = useLocalStorage()
      storage.clearAuth()
    }
  }

  // 初始化
  if (import.meta.client) {
    const storage = useLocalStorage()
    const stored = storage.getAuth()
    if (stored) {
      updateState(stored.token, stored.info, stored.profile)
    }
  }

  return {
    ...toRefs(state.value),
    isAuthenticated,
    login,
    register,
    logout,
  }
})

// composables/useLocalStorage.ts
export const useLocalStorage = () => {
  const setAuth = (token: string, info: UserInfo, profile: UserProfile) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('user_info', JSON.stringify(info))
    localStorage.setItem('user_profile', JSON.stringify(profile))
  }

  const getAuth = () => {
    const token = localStorage.getItem('access_token')
    const info = localStorage.getItem('user_info')
    const profile = localStorage.getItem('user_profile')

    if (!token || !info || !profile) return null

    try {
      return {
        token,
        info: JSON.parse(info),
        profile: JSON.parse(profile)
      }
    } catch (e) {
      console.error('解析本地存储数据失败:', e)
      return null
    }
  }

  const clearAuth = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
    localStorage.removeItem('user_profile')
  }

  return {
    setAuth,
    getAuth,
    clearAuth
  }
}
