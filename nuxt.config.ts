// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';
   
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
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
    '~': resolve(__dirname,'.')
  },
})