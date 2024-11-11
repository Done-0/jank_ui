<template>
  <section>
    <Card class="overflow-hidden">
      <CardContent v-if="articles.length === 0" class="flex items-center justify-center min-h-[200px]">
        <span class="text-muted-foreground">加载中...</span>
      </CardContent>

      <CardContent v-else class="p-6 space-y-6">
        <article
          v-for="article in articles" 
          :key="article.id" 
          class="card-hover group flex h-48 rounded-lg border bg-card overflow-hidden
          hover:bg-accent/50 hover:shadow-xl" 
          style="
            --hover-direction: 0deg; 
            --hover-distance: 8px;
            --card-hover-scale: 1; 
            --card-hover-duration: 500ms"
        >
          <div class="relative w-1/3 overflow-hidden">
            <img
              :src="article.image" :alt="article.title" class="h-full w-full object-cover 
              transition-transform duration-500 ease-out
              group-hover:scale-105">
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent 
                opacity-0 group-hover:opacity-80 
                transition-opacity duration-500" />
          </div>

          <div class="border-r h-full" />

          <div
            class="w-2/3 p-4 md:p-6 flex flex-col justify-center space-y-3
            transform group-hover:translate-x-2 
            transition-transform duration-500 ease-out">
            <h3
              class="text-lg md:text-xl font-semibold 
              transition-colors duration-500 ease-out
              group-hover:text-primary">
              {{ article.title }}
            </h3>
            <p
              class="text-sm text-muted-foreground line-clamp-2 
              transition-colors duration-500 ease-out
              group-hover:text-current">
              {{ article.summary }}
            </p>
          </div>
        </article>
      </CardContent>

      <CardFooter class="flex justify-center px-6">
        <Pagination v-slot="{ page }" :total="100" :sibling-count="1" show-edges :default-page="2">
          <PaginationList v-slot="{ items }" class="flex items-center gap-2">
            <PaginationFirst />
            <PaginationPrev />

            <template v-for="(item, index) in items" :key="index">
              <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                <Button :variant="item.value === page ? 'default' : 'outline'" class="h-9 w-9 p-0">
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
} from '~/components/ui/card'

import {
  Button,
} from '~/components/ui/button'

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '~/components/ui/pagination'

import type {
  Article
} from '~/types/article';

defineProps<{
  articles: Article[]
}>()
</script>

<style scoped>
.group {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {

  .group,
  .group *,
  .group::before,
  .group::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
