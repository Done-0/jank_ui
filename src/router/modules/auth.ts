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
]
