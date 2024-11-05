<template>
  <section class="flex-1 px-6 py-8">
    <Card class="shadow-md rounded-lg p-6 border border-gray">
      <CardContent v-if="articles.length === 0" class="rounded-lg border border-gray p-6">
        加载中...
      </CardContent>
      <CardContent v-else>
        <div
          v-for="article in articles"
          :key="article.id"
          class="flex h-48 mb-4 rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray"
        >
          <!-- 左侧的文章图片 -->
          <div class="w-1/3 h-full">
            <img
              :src="article.image"
              alt="文章图片"
              class="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <!-- 中间的竖直分割线 -->
          <div class="border-r border-white"></div>
          <!-- 右侧的文章信息 -->
          <div class="w-2/3 p-4 flex flex-col justify-center">
            <h3 class="text-xl font-semibold">
              {{ article.title }}
            </h3>
            <p class="mt-2">
              {{ article.summary }}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter class="rounded-lg border-t border-gray">
        <Pagination v-slot="{ page }" :total="100" :sibling-count="1" show-edges :default-page="2">
          <PaginationList v-slot="{ items }" class="flex items-center justify-center gap-2">
            <PaginationFirst />
            <PaginationPrev />

            <template v-for="(item, index) in items">
              <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <PaginationNext />
            <PaginationLast />
          </PaginationList>
        </Pagination>
      </CardFooter>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { 
  Card, 
  CardContent 
} from '@/components/ui/card'

import {
  Button,
} from '@/components/ui/button'

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'

defineProps<{
  articles: { id: number, image: string, title: string, summary: string }[]
}>()
</script>

<style scoped>
</style>
