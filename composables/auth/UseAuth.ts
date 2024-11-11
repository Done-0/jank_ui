import type { LoginRequest, LoginResponse, UserInfo, ApiResponse } from '~/types/auth/auth'

export default function useLogin() {
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiBase}/account/loginAccount`
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const user = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!user.value)

  const login = async (request: LoginRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error('登录失败，请检查邮箱和密码！')
      }

      const data: ApiResponse<LoginResponse> = await response.json()

      if (data.code !== 0) {
        throw new Error(data.msg);
      }

      user.value = data.data.refresh_token;

      // 存储 token 或其他认证信息
      localStorage.setItem('access_token', data.data.access_token);
      localStorage.setItem('refresh_token', JSON.stringify(data.data.refresh_token));

    } catch (err) {
      error.value = err instanceof Error ? err.message : '发生错误，请稍后再试'
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    loading,
    error,
    user,
    isLoggedIn,
    login,
    logout,
  }
}
