<template>
    <div class="min-h-screen flex flex-col relative">
      <!-- 顶部导航栏 -->
      <NavBar
        :is-logged-in="isLoggedIn"
        :user-profile-image="userProfileImage"
        class="w-full border-b"
        @login="login"
        @logout="logout"
      />
  
      <!-- 页面主体内容 -->
      <slot />
  
      <!-- 页脚 -->
      <Footer
        class="fixed bottom-0 left-0 w-full shadow-lg transform transition-transform duration-300 ease-in-out border-t"
        :class="{ 'translate-y-full': !showFooter }"
      />
    </div>
</template>

<script setup lang="ts">
import UseAuth from '~/composables/UseAuth'
import UseFooterVisibility from '~/composables/UseFooterVisibility'
import NavBar from '~/layouts/components/NavBar.vue'
import Footer from '~/layouts/components/Footer.vue'

const { isLoggedIn, userProfileImage, login, logout } = UseAuth()
const { showFooter } = UseFooterVisibility()
</script>
