import type { 
  LoginRequest, 
  RegisterRequest,
  UserInfo,
  UserProfile,
  AuthResponse,
  CaptchaResponse
} from '~/types/auth/auth'
import { useLocalStorage } from '~/composables/auth/useLocalStorage'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBase
  const state = useState('auth', () => ({
    userProfile: null as UserProfile | null,
    userInfo: null as UserInfo | null,
    accessToken: null as string | null,
  }))
  const captchaUrl = ref('')
  const captchaLoading = ref(false)

  const getCaptcha = async () => {
    captchaLoading.value = true
    try {
      const { data } = await useFetch<CaptchaResponse>(`${apiUrl}/account/genImgVerificationCode`, {
        method: 'GET',
        query: {
          email: '927171598@qq.com'
        }
      })

      if (!data.value) {
        throw new Error('获取验证码失败')
      }

      captchaUrl.value = data.value.data.imgBase64
    } catch (error) {
      console.error('获取验证码失败:', error)
      throw error
    } finally {
      captchaLoading.value = false
    }
  }

  const isAuthenticated = computed(() => !!state.value.accessToken)

  const updateState = (token: string | null, info: UserInfo | null, profile: UserProfile | null) => {
    state.value = {
      accessToken: token,
      userInfo: info,
      userProfile: profile
    }
  }

  const login = async (payload: LoginRequest) => {
    try {
      const { data, error } = await useFetch<AuthResponse>(`${apiUrl}/account/loginAccount`, {
        method: 'POST',
        body: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      if (error.value) {
        throw new Error(error.value.message)
      }
  
      if (!data.value) {
        throw new Error('登录失败')
      }
  
      const response = data.value
      const { userInfo, accessToken, userId } = response.data
  
      const profile: UserProfile = {
        id: userId,
        email: userInfo.email,
        name: userInfo.nickname,
      }
  
      updateState(accessToken, userInfo, profile)
  
      if (payload.remember && import.meta.client) {
        const storage = useLocalStorage()
        storage.setAuth(accessToken, userInfo, profile)
      }
  
      return response.data
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  const register = async (payload: RegisterRequest) => {
    try {
      const { data } = await useFetch<AuthResponse>(`${apiUrl}/account/registerAccount`, {
        method: 'POST',
        body: payload,
      })

      if (!data.value) {
        throw new Error('注册失败')
      }

      const response = data.value
      const { userInfo, accessToken, userId } = response.data

      const profile: UserProfile = {
        id: userId,
        email: userInfo.email,
        name: userInfo.nickname,
      }

      updateState(accessToken, userInfo, profile)

      if (import.meta.client) {
        const storage = useLocalStorage()
        storage.setAuth(accessToken, userInfo, profile)
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
    captchaUrl: readonly(captchaUrl),
    captchaLoading: readonly(captchaLoading),
    getCaptcha,
  }
})
