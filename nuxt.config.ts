import { resolve } from 'pathe'
import { loadEnv } from 'vite'

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
      apiBase: loadEnv(process.argv[process.argv.length - 1], 'env/.env.dev').VITE_API_URL,
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
