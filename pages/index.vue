<template>
  <div class="flex-1">
    <ClientOnly>
      <div v-if="error" class="w-full max-w-7xl mx-auto mt-4 p-4 bg-red-50 text-red-600 rounded">
        {{ error }}
      </div>
    </ClientOnly>

    <!-- 公告板 -->
    <Announcement 
      :left-bg-image="leftBgImage"
      :right-bg-image="rightBgImage" 
      class="w-full" 
    />

    <!-- 文章区域 -->
    <main class="w-full max-w-7xl mx-auto flex gap-6 py-6">
      <Aside class="w-64 hidden lg:block" />
      <ArticleSection class="flex-1 min-w-0" />
    </main>
  </div>
</template>

<script setup lang="ts">
import Announcement from '~/components/common/Announcement.vue'
import Aside from '~/components/common/Aside.vue'
import ArticleSection from '~/components/common/ArticleSection.vue'
import { onMounted } from 'vue'
import { usePost } from '~/composables/usePost'
import { usePostStore } from '~/store/post'
import { STORAGE_KEYS } from '~/types/post';

definePageMeta({
  layout: 'default'
})

// 使用 Post 组合式函数
const { error } = usePost()

// 背景图片配置
const leftBgImage = 'assets/img/test1.png' // 替换为实际的图片路径
const rightBgImage = 'assets/img/test2.png' // 替换为实际的图片路径

// 页面挂载时初始化数据
onMounted(async () => {
  const store = usePostStore()
  
  // 检查是否有缓存数据
  const savedPosts = localStorage.getItem(STORAGE_KEYS.POST)
  if (savedPosts) {
    // 直接调用 getAllPosts 来更新 store 中的数据
    await store.getAllPosts()
  } else {
    await store.getAllPosts()
  }
})
</script>
