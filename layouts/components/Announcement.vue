<template>
  <section class="w-full flex justify-center pt-6 pb-0">
    <div class="w-full max-w-7xl flex gap-4">
      <!-- 左侧公告板 -->
      <Card class="w-1/2 min-h-[250px] rounded-lg border" :style="leftBgStyle">
        <CardHeader class="py-4">
          <CardTitle class="text-2xl font-semibold">
            热门内容
          </CardTitle>
        </CardHeader>
        <CardContent class="p-6">
          <p class="text-sm">
            {{ leftContent }}
          </p>
        </CardContent>
      </Card>

      <!-- 右侧公告板 -->
      <Card class="w-1/2 min-h-[250px] rounded-lg border" :style="rightBgStyle">
        <CardHeader class="py-4">
          <CardTitle class="text-2xl font-semibold">
            推荐内容
          </CardTitle>
        </CardHeader>
        <CardContent class="p-6">
          <p class="text-sm">
            {{ rightContent }}
          </p>
        </CardContent>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '~/components/ui/card'
import { computed } from 'vue'

const props = defineProps<{
  leftContent: string
  rightContent: string
  leftBgImage?: string
  rightBgImage?: string
}>()

const leftBgStyle = computed(() => ({
  backgroundImage: props.leftBgImage ? `url(${props.leftBgImage})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))

const rightBgStyle = computed(() => ({
  backgroundImage: props.rightBgImage ? `url(${props.rightBgImage})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))
</script>
