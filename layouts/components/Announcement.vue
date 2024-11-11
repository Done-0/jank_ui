<template>
  <section class="w-full flex justify-center pt-6 pb-0">
    <div class="w-full max-w-7xl flex gap-4">
      <!-- 左侧公告板：展示热门内容 -->
      <Card class="w-1/2 min-h-[250px] rounded-lg border" :style="props.leftBgImage ? { backgroundImage: `url(${props.leftBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
        <CardHeader class="py-4">
          <CardTitle class="text-2xl font-semibold">热门内容</CardTitle>
        </CardHeader>
        <CardContent class="p-6">
          <!-- 只显示 leftContent 数组中的第一个内容 -->
          <ul class="space-y-2">
            <li v-if="props.leftContent.length > 0" :key="props.leftContent[0].id">
              <NuxtLink :to="props.leftContent[0].link" class="text-sm hover:text-primary transition-colors">
                {{ props.leftContent[0].title }}
              </NuxtLink>
            </li>
          </ul>
        </CardContent>
      </Card>

      <!-- 右侧公告板：展示推荐内容 -->
      <Card class="w-1/2 min-h-[250px] rounded-lg border" :style="props.rightBgImage ? { backgroundImage: `url(${props.rightBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
        <CardHeader class="py-4">
          <CardTitle class="text-2xl font-semibold">推荐内容</CardTitle>
        </CardHeader>
        <CardContent class="p-6">
          <!-- 只显示 rightContent 数组中的第一个内容 -->
          <ul class="space-y-2">
            <li v-if="props.rightContent.length > 0" :key="props.rightContent[0].id">
              <NuxtLink :to="props.rightContent[0].link" class="text-sm hover:text-primary transition-colors">
                {{ props.rightContent[0].title }}
              </NuxtLink>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ContentItem } from '~/types/article'

// 定义传递的 props
const props = defineProps<{
  leftContent: ContentItem[]  // leftContent 类型是 ContentItem[] 数组
  rightContent: ContentItem[] // rightContent 类型是 ContentItem[] 数组
  leftBgImage?: string        // 可选的左侧背景图
  rightBgImage?: string       // 可选的右侧背景图
}>()
</script>
