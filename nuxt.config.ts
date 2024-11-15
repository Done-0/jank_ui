import { resolve } from 'pathe'
import { loadEnv } from 'vite'

const env = loadEnv(process.env.NODE_ENV as string, 'env/.env.dev');

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  runtimeConfig: {
    public: {
      apiBase: env.VITE_API_URL || 'http://127.0.0.1:9010',
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
	alias: {
		'@': resolve(__dirname, './'),
    '~': resolve(__dirname, './'),
	},
});
