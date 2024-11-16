<template>
  <section class="w-full flex justify-center pt-6 pb-0">
    <div class="w-full max-w-7xl flex gap-4">
      <!-- 左侧热门内容 -->
      <Card 
        class="w-1/2 min-h-[250px] rounded-lg border"
        :style="leftBgStyle"
      >
        <CardHeader class="py-4">
          <CardTitle class="text-2xl font-semibold">热门内容</CardTitle>
        </CardHeader>
        <CardContent class="p-6">
          <ul class="space-y-2">
            <li v-if="hotPost" :key="hotPost.id">
              <NuxtLink 
                :to="`/posts/${hotPost.id}`" 
                class="text-sm hover:text-primary transition-colors"
              >
                {{ hotPost.title }}
              </NuxtLink>
            </li>
          </ul>
        </CardContent>
      </Card>

      <!-- 右侧推荐内容 -->
      <Card 
        class="w-1/2 min-h-[250px] rounded-lg border"
        :style="rightBgStyle"
      >
        <CardHeader class="py-4">
          <CardTitle class="text-2xl font-semibold">推荐内容</CardTitle>
        </CardHeader>
        <CardContent class="p-6">
          <ul class="space-y-2">
            <li v-if="recommendedPost" :key="recommendedPost.id">
              <NuxtLink 
                :to="`/posts/${recommendedPost.id}`" 
                class="text-sm hover:text-primary transition-colors"
              >
                {{ recommendedPost.title }}
              </NuxtLink>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePost } from '~/composables/usePost'

const { posts } = usePost()

// 计算属性：获取热门文章（这里假设取第一篇）
const hotPost = computed(() => posts.value?.[0] || null)

// 计算属性：获取推荐文章（这里假设取第二篇）
const recommendedPost = computed(() => posts.value?.[1] || null)

// 背景样式计算属性
const leftBgStyle = computed(() => hotPost.value ? {
  backgroundImage: `url(${hotPost.value.image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
} : {})

const rightBgStyle = computed(() => hotPost.value ? {
  backgroundImage: `url(${recommendedPost.value.image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
} : {})
</script>
