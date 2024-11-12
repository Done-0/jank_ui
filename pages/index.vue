<template>
  <div class="flex-1">
    <ClientOnly>
      <div v-if="error" class="w-full max-w-7xl mx-auto mt-4 p-4 bg-red-50 text-red-600 rounded">
        {{ error }}
      </div>
    </ClientOnly>

    <!-- 公告板 -->
    <Announcement 
      :left-content="hotContent" 
      :right-content="recommendedContent"
      :left-bg-image="'https://haowallpaper.com/link/common/file/previewFileImg/15737859935015232'"
      :right-bg-image="'https://haowallpaper.com/link/common/file/previewFileImg/15737861172728128'" 
      class="w-full" 
    />

    <!-- 文章区域 -->
    <main class="w-full max-w-7xl mx-auto flex gap-6 py-6">
      <Aside class="w-64 hidden lg:block" />
      <ArticleSection 
        :articles="paginatedArticles" 
        :loading="loading" 
        class="flex-1 min-w-0" 
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Announcement from '~/layouts/common/Announcement.vue'
import Aside from '~/layouts/common/Aside.vue'
import ArticleSection from '~/layouts/common/ArticleSection.vue'
import useContent from '~/composables/article/useContent'

definePageMeta({
  layout: 'default'
})

const {
  recommendedContent,
  hotContent,
  paginatedArticles,
  loading,
  error,
  fetchArticles,
  articles,
  currentPage
} = useContent()

// 页面挂载时获取文章数据
onMounted(() => {
  // 检查是否已有缓存数据
  const savedArticles = localStorage.getItem('articles')
  if (savedArticles) {
    // 如果有缓存数据，直接加载
    const cachedArticles = JSON.parse(savedArticles)
    // 更新文章数据
    articles.value = cachedArticles
    // 强制更新当前页数，保证第一页的数据展示
    currentPage.value = 1
  } else {
    // 如果没有缓存，加载数据
    fetchArticles()
  }
})
</script>
