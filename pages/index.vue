<template>
  <div class="flex-1">
    <ClientOnly>
      <!-- 错误提示部分 -->
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
        :articles="articles"
        :loading="loading"
        class="flex-1 min-w-0" 
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Announcement from '~/layouts/components/Announcement.vue'
import Aside from '~/layouts/components/Aside.vue'
import ArticleSection from '~/layouts/components/ArticleSection.vue'
import useContent from '~/composables/UseContent'
import type { ApiResponse, Article } from '~/types/article'

definePageMeta({
  layout: 'default'
})

const {
  recommendedContent,
  hotContent,
  articles,
  loading,
  error,
  processArticles,
  apiUrl
} = useContent()

// 获取文章数据
const fetchArticles = async () => {
  loading.value = true
  try {
    const response = await $fetch<ApiResponse<Article[]>>(apiUrl)
    if (response?.data) {
      processArticles(response.data)
    } else {
      error.value = 'No articles found'
    }
  } catch (err) {
    console.error('Error fetching articles:', err)
    error.value = 'Error fetching data from server'
  } finally {
    loading.value = false
  }
}

// 页面挂载时获取文章数据
onMounted(() => {
  // 如果没有文章数据，就加载数据
  if (articles.value.length === 0) {
    fetchArticles()
  }
})

// 监听 articles 变化并处理
watch(articles, (newArticles) => {
  if (newArticles.length > 0) {
    loading.value = false
  }
})
</script>
