<template>
  <div class="flex-1">
    <ClientOnly>
      <div v-if="error" class="w-full max-w-7xl mx-auto mt-4 p-4 bg-red-50 text-red-600 rounded">
        {{ error }}
      </div>
    </ClientOnly>

    <!-- 公告板 -->
    <Announcement 
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

definePageMeta({
  layout: 'default'
})

const { error } = usePost()

onMounted(async () => {
  const store = usePostStore()

  await store.getAllPosts()

  usePost().getAllPosts()
})
</script>