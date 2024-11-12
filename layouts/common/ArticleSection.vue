<template>
  <section>
    <Card class="overflow-hidden">
      <!-- Loading State -->
      <CardContent 
        v-if="loading" 
        class="flex min-h-[200px] items-center justify-center"
      >
        <span class="text-muted-foreground">玩命加载中...</span>
      </CardContent>

      <!-- Articles List -->
      <CardContent v-else class="space-y-6 p-6">
        <article 
          v-for="article in paginatedArticles" 
          :key="article.id" 
          class="card-hover group flex h-48 overflow-hidden rounded-lg border bg-card hover:bg-accent/50 hover:shadow-xl"
          style="--card-hover-translate-x: 0; --card-hover-translate-y: 0; --card-hover-scale: 1; --card-hover-duration: 500ms"
        >
          <!-- Article Image -->
          <div class="relative w-1/3 overflow-hidden">
            <img 
              :src="article.image || '/default-article-image.jpg'" 
              :alt="article.title" 
              class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            >
            <div 
              class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-80" 
            />
          </div>

          <!-- Divider -->
          <div class="h-full border-r border-card-border" />

          <!-- Article Content -->
          <div 
            class="flex w-2/3 flex-col justify-center space-y-3 p-4 transition-transform duration-500 ease-out group-hover:translate-x-2 md:p-6"
          >
            <h3 
              class="text-lg font-semibold transition-colors duration-500 ease-out group-hover:text-primary md:text-xl"
            >
              {{ article.title }}
            </h3>
            <p 
              class="line-clamp-2 text-sm text-muted-foreground transition-colors duration-500 ease-out group-hover:text-current"
            >
              {{ article.summary }}
            </p>
          </div>
        </article>
      </CardContent>

      <!-- Pagination -->
      <CardFooter class="flex justify-center px-6">
        <Pagination 
          v-slot="{ page }" 
          v-model:page="currentPage" 
          :total="totalPages" 
          :sibling-count="1" 
          show-edges
        >
          <PaginationList v-slot="{ items }" class="flex items-center gap-2">
            <PaginationFirst />
            <PaginationPrev />

            <template v-for="(item, index) in items" :key="index">
              <PaginationListItem 
                v-if="item.type === 'page'" 
                :value="item.value" 
                as-child
              >
                <Button 
                  :variant="item.value === page ? 'default' : 'outline'" 
                  class="h-9 w-9 p-0"
                >
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else />
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
  CardContent,
  CardFooter,
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

import useContent from '~/composables/article/useContent'

const { 
  paginatedArticles, 
  currentPage, 
  totalPages, 
  loading 
} = useContent()
</script>

<style scoped>
.group {
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .group,
  .group * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
