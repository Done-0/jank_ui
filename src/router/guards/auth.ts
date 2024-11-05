import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

export const authGuard = async (to: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  
  // 需要登录但未登录
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  
  // 已登录但访问游客页面
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { name: 'Dashboard' }
  }
  
  // 检查角色权限
  if (to.meta.role) {
    const requiredRole = to.meta.role as string
    if (!authStore.hasRole(requiredRole)) {
      return { name: '403' }
    }
  }
}
