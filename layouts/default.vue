<template>
    <div class="min-h-screen flex flex-col relative">
      <!-- 顶部导航栏 -->
      <NavBar
        :is-logged-in="isLoggedIn"
        class="w-full border-b"
        @login="login"
        @logout="logout"
      />
  
      <!-- 页面主体内容 -->
      <slot />
  
      <!-- 页脚 -->
      <!-- <Footer
        class="fixed bottom-0 left-0 w-full shadow-lg transform transition-transform duration-300 ease-in-out border-t"
      /> -->
    </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/common/NavBar.vue'
// import Footer from '~/components/common/Footer.vue'
import { useAuth } from '~/composables/useAuth'

const { isLoggedIn, login, logout } = useAuth()
</script>
