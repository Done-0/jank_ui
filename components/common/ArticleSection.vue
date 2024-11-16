<template>
  <section>
    <Card class="overflow-hidden">
      <!-- Loading State -->
      <CardContent v-if="loading" class="flex min-h-[200px] items-center justify-center">
        <span class="text-muted-foreground">玩命加载中...</span>
      </CardContent>

      <!-- Error State -->
      <CardContent v-else-if="error" class="flex min-h-[200px] items-center justify-center text-destructive">
        {{ error }}
      </CardContent>

      <!-- Articles Section -->
      <CardContent v-else class="space-y-6 p-6">
        <article
v-for="post in paginatedPosts" :key="post.id"
          class=".card-hover group flex h-48 overflow-hidden rounded-lg border bg-card hover:bg-accent/50 hover:shadow-xl">
          <!-- Article Image -->
          <div class="relative w-1/3 overflow-hidden">
            <img
:src="post.image" :alt="post.title"
              class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105">
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-80" />
          </div>

          <div class="h-full border-r border-card-border" />

          <!-- Article Content -->
          <div
            class="flex w-2/3 flex-col justify-center space-y-3 p-4 transition-transform duration-500 ease-out group-hover:translate-x-2 md:p-6">
            <h3
              class="text-lg font-semibold transition-colors duration-500 ease-out group-hover:text-primary md:text-xl">
              {{ post.title }}
            </h3>
            <p
              class="line-clamp-2 text-sm text-muted-foreground transition-colors duration-500 ease-out group-hover:text-current">
              {{ getPostSummary(post.contentHtml) }}
            </p>
          </div>
        </article>
      </CardContent>

      <!-- Pagination -->
      <CardFooter class="flex justify-center mt-6">
        <Pagination :total="totalPages" :sibling-count="1" show-edges>
          <PaginationList class="flex items-center gap-2">
            <PaginationFirst :disabled="currentPage === 1" @click="handlePageChange(1)" />

            <PaginationPrev :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)" />

            <template v-for="item in visiblePages" :key="item">
              <PaginationListItem :value="item" as-child>
                <Button
                  class="w-10 h-10 p-0" :variant="item === currentPage ? 'default' : 'outline'"
                  :disabled="item === currentPage" @click="handlePageChange(item)">
                  {{ item }}
                </Button>
              </PaginationListItem>
            </template>

            <PaginationNext :disabled="currentPage === totalPages" @click="handlePageChange(currentPage + 1)" />

            <PaginationLast :disabled="currentPage === totalPages" @click="handlePageChange(totalPages)" />
          </PaginationList>
        </Pagination>
      </CardFooter>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePost } from '~/composables/usePost'

// 分页相关数据
const ITEMS_PER_PAGE = 5 // 每页显示的文章数
const MAX_VISIBLE_PAGES = 5 // 最大显示页码数
const currentPage = ref(1) // 当前页码
const { posts, loading, error } = usePost()

// 获取文章摘要
const getPostSummary = (html: string) => {
  const tmp = document.createElement('body')
  tmp.innerHTML = html
  const text = tmp.textContent || tmp.innerText || ''
  return text.slice(0, 100) + (text.length > 100 ? '...' : '')
}

// 计算分页后的文章列表
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return posts.value?.slice(start, end) || []
})

// 计算总页数
const totalPages = computed(() => Math.ceil((posts.value?.length || 0) / ITEMS_PER_PAGE))

// 计算可见页码
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const half = Math.floor(MAX_VISIBLE_PAGES / 2)

  let start = Math.max(1, current - half)
  let end = Math.min(total, current + half)

  // 调整页码范围以确保页码数不超过设定的最大数量
  if (end - start < MAX_VISIBLE_PAGES - 1) {
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1)
    end = Math.min(total, start + MAX_VISIBLE_PAGES - 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 页码切换逻辑
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<style scoped>
.pagination-button {
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>