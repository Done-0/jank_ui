import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:9010'
    }
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  
  typescript: {
    typeCheck: true
  },
  
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt'
  ],

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  alias: {
    '~': resolve(__dirname, '.')
  },
})
