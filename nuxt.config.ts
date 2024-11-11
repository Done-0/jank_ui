import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // 引入自动导入配置
  imports: {
    autoImport: true
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:9010'
    }
  },

  // 应用程序相关配置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // TypeScript 配置
  typescript: {
    typeCheck: true
  },

  // 模块配置
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt'
  ],

  // Shadcn 模块配置
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  // 别名配置
  alias: {
    '~': fileURLToPath(new URL('.', import.meta.url))
  },
});
