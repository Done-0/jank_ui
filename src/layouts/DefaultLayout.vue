<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- 顶部导航栏 -->
    <Navbar 
      :is-logged-in="isLoggedIn" 
      :user-profile-image="userProfileImage"
      class="w-full border-b"
      @login="login" 
      @logout="logout" 
    />
    
    <!-- 公告板 -->
    <Announcement 
      :left-content="recommendedContent"
      :right-content="hotContent"
      :left-bg-image="'https://haowallpaper.com/link/common/file/previewFileImg/15737859935015232'"
      :right-bg-image="'https://haowallpaper.com/link/common/file/previewFileImg/15737861172728128'"
      class="w-full"
    />
    
    <!-- 文章部分 -->
    <main class="flex-1 w-full max-w-7xl mx-auto flex gap-6 py-6">
      <Aside class="w-64 hidden lg:block" />
      <ArticleSection 
        :articles="articles"
        class="flex-1 min-w-0" 
      />
    </main>
    
    <!-- 页脚 -->
    <Footer 
      class="fixed bottom-0 left-0 w-full shadow-lg transform transition-transform duration-300 ease-in-out border-t"
      :class="{ 'translate-y-full': !showFooter }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useAuth from '@/composables/useAuth'
import useContent from '@/composables/useContent'
import useFooterVisibility from '@/composables/useFooterVisibility'
import Navbar from '@/components/common/NavBar.vue'
import Announcement from '@/components/common/Announcement.vue'
import Aside from '@/components/common/Aside.vue'
import ArticleSection from '@/components/common/ArticleSection.vue'
import Footer from '@/components/common/Footer.vue'

const { isLoggedIn, userProfileImage, login, logout } = useAuth()
const { 
  recommendedContent, 
  hotContent, 
  articles, 
  fetchRecommendedContent, 
  fetchHotContent,
  fetchArticles 
} = useContent()
const { showFooter } = useFooterVisibility()

onMounted(() => {
  fetchRecommendedContent()
  fetchHotContent()
  fetchArticles()
})
</script>