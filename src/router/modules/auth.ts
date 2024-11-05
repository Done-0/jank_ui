export default [
  {
    path: '/', 
    name: 'Home',
    component: () => import('@/layouts/DefaultLayout.vue'), 
    meta: {
      title: '首页',
      requiresAuth: true
    }
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/login.vue'),
        meta: {
          title: '登录',
          requiresGuest: true
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/register.vue'),
        meta: {
          title: '注册',
          requiresGuest: true
        }
      }
    ]
  }
  
]
