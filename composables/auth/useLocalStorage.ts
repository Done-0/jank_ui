import type { UserInfo, UserProfile } from '~/types/auth/auth'

export const useLocalStorage = () => {
  const setAuth = (token: string, info: UserInfo, profile: UserProfile) => {
    if (!import.meta.client) return
    
    localStorage.setItem('accessToken', token)
    localStorage.setItem('userInfo', JSON.stringify(info))
    localStorage.setItem('userProfile', JSON.stringify(profile))
  }

  const getAuth = () => {
    if (!import.meta.client) return null
    
    const token = localStorage.getItem('accessToken')
    const info = localStorage.getItem('userInfo')
    const profile = localStorage.getItem('userProfile')

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
    if (!import.meta.client) return
    
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userProfile')
  }

  return {
    setAuth,
    getAuth,
    clearAuth
  }
}
