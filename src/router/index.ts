import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from '@/router/modules/auth'

const routes = [
  ...authRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router