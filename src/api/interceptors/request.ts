import axios, { AxiosResponse } from 'axios'
import { useAuthStore } from '@/store/modules/auth'
import router from '@/router'
import { useToast } from '@/components/ui/toast'
import type { ApiResponse } from '@/types/auth'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000
})

request.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    if (authStore.access_token) {
      config.headers.Authorization = `Bearer ${authStore.access_token}`
    }
    return config
  },
  error => Promise.reject(error)
)

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const apiResponse = response.data as ApiResponse<any>
    const { code, message } = apiResponse
    
    if (code && code !== 0) {
      const { toast } = useToast()
      toast({
        title: '错误',
        description: message || '请求失败',
        variant: 'destructive'
      })
      return Promise.reject(new Error(message || '请求失败'))
    }
    
    // 返回一个新的 AxiosResponse 对象
    return {
      ...response,
      data: apiResponse
    }
  },
  error => {
    const { toast } = useToast()
    
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push({
        name: 'Login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
      
      toast({
        title: '登录已过期',
        description: '请重新登录',
        variant: 'destructive'
      })
    } else {
      toast({
        title: '错误',
        description: error.message || '请求失败',
        variant: 'destructive'
      })
    }
    
    return Promise.reject(error)
  }
)

export default request
