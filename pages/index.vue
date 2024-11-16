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
import { onMounted, ref, watch } from 'vue'
import { usePost } from '~/composables/usePost'
import { usePostStore } from '~/store/post'

definePageMeta({
  layout: 'default'
})

const { error, refreshPosts } = usePost()

const leftBgImage = ref('')
const rightBgImage = ref('')

// 页面挂载时初始化数据
onMounted(async () => {
  const store = usePostStore()

  // 每次刷新页面时，重新获取所有文章数据
  await store.getAllPosts()

  // 监听 store 中的 posts 数据变化，更新公告板图片
  watch(
    () => store.posts,
    (posts) => {
      if (posts.length >= 2) {
        leftBgImage.value = posts[0]?.image;
        rightBgImage.value = posts[1]?.image;
      }
    },
    { immediate: true } // 组件加载时立即执行一次 watch
  )

  // 也可以在这里调用 refreshPosts 方法以确保更新
  refreshPosts()
})
</script>