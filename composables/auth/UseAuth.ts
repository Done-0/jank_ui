import { ApiStatusCode } from '~/types/base/base'
import type { 
  LoginRequest, 
  LoginResponse, 
  UserInfo, 
  AuthResponse 
} from '~/types/auth/auth'

export default function useAuth() {
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiBase}/account/loginAccount`
  
  const loading = useState('auth-loading', () => false)
  const error = useState<string | null>('auth-error', () => null)
  const user = useState<UserInfo | null>('auth-user', () => null)
  
  const isLoggedIn = computed(() => !!user.value)

  const initializeAuth = () => {
    if (!import.meta.client) return
    
    try {
      const storedUser = localStorage.getItem('userInfo')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
    } catch (err) {
      console.error('Failed to restore auth state:', err)
    }
  }

  const saveAuthData = (authData: LoginResponse) => {
    if (!import.meta.client) return
    
    localStorage.setItem('accessToken', authData.accessToken)
    localStorage.setItem('userInfo', JSON.stringify(authData.userInfo))
    user.value = authData.userInfo
  }

  const clearAuthData = () => {
    if (!import.meta.client) return
    
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
    user.value = null
  }

  const login = async (request: LoginRequest) => {
    loading.value = true
    error.value = null
  
    try {
      const response = await $fetch<AuthResponse>(apiUrl, {
        method: 'POST',
        body: request
      })
  
      if (response.code === ApiStatusCode.SUCCESS) {
        saveAuthData(response.data)
      } else {
        throw new Error(response.msg || '登录失败')
      }
    } catch (err) {
      error.value = err instanceof Error 
        ? err.message 
        : '登录失败，请稍后重试'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    clearAuthData()
  }

  onMounted(() => {
    initializeAuth()
  })

  return {
    loading,
    error,
    user,
    isLoggedIn,
    login,
    logout,
  }
}
