<template>
  <div class="min-h-screen flex flex-col relative bg-white dark:bg-gray-900">
    <!-- 背景画布 -->
    <canvas 
      ref="canvasRef" 
      class="fixed inset-0 w-full h-full pointer-events-none -z-10"
    />
    
    <!-- 顶部导航栏 -->
    <Header 
      :is-logged-in="isLoggedIn" 
      :user-profile-image="userProfileImage"
      class="w-full border-b border-gray-200 dark:border-gray-700"
      @login="login" 
      @logout="logout" 
    />
    
    <!-- 公告板 -->
    <Banner 
      :content="recommendedContent"
      class="w-full bg-gradient-to-r text-white py-4" 
    />
    
    <!-- 页面主体内容 -->
    <main class="flex-1 w-full max-w-7xl mx-auto flex gap-6 py-6">
      <Aside class="w-64 hidden lg:block" />
      <ArticleSection 
        :articles="articles"
        class="flex-1 min-w-0" 
      />
    </main>
    
    <!-- 固定定位的页脚 -->
    <Footer 
      class="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out border-t border-gray-200 dark:border-gray-700"
      :class="{ 'translate-y-full': !showFooter }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useAuth from '@/composables/useAuth'
import useContent from '@/composables/useContent'
import useBackgroundAnimation from '@/composables/useBackgroundAnimation'
import useFooterVisibility from '@/composables/useFooterVisibility'
import Header from '@/components/common/Header.vue'
import Banner from '@/components/common/Banner.vue'
import Aside from '@/components/common/Aside.vue'
import ArticleSection from '@/components/common/ArticleSection.vue'
import Footer from '@/components/common/Footer.vue'

const { isLoggedIn, userProfileImage, login, logout } = useAuth()
const { recommendedContent, articles, fetchRecommendedContent, fetchArticles } = useContent()
const { canvasRef } = useBackgroundAnimation()
const { showFooter } = useFooterVisibility()

onMounted(() => {
  fetchRecommendedContent()
  fetchArticles()
})
</script>