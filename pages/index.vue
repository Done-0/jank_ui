<template>
  <div class="flex-1">
    <!-- 公告板 -->
    <Announcement
      :left-content="recommendedContent"
      :right-content="hotContent"
      :left-bg-image="'https://haowallpaper.com/link/common/file/previewFileImg/15737859935015232'"
      :right-bg-image="'https://haowallpaper.com/link/common/file/previewFileImg/15737861172728128'"
      class="w-full"
    />

    <!-- 文章部分 -->
    <main class="w-full max-w-7xl mx-auto flex gap-6 py-6">
      <Aside class="w-64 hidden lg:block" />
      <ArticleSection :articles="articles" class="flex-1 min-w-0" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import UseContent from '~/composables/UseContent'
import Announcement from '~/layouts/components/Announcement.vue'
import Aside from '~/layouts/components/Aside.vue'
import ArticleSection from '~/layouts/components/ArticleSection.vue'

definePageMeta({
  layout: 'default'
})

const {
  recommendedContent,
  hotContent,
  articles,
  fetchRecommendedContent,
  fetchHotContent,
  fetchArticles
} = UseContent()

onMounted(() => {
  fetchRecommendedContent()
  fetchHotContent()
  fetchArticles()
})
</script>
