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

      <!-- Articles List -->
      <CardContent v-else class="space-y-6 p-6">
        <article 
          v-for="post in paginatedPosts" 
          :key="post.id" 
          class="card-hover group flex h-48 overflow-hidden rounded-lg border bg-card hover:bg-accent/50 hover:shadow-xl"
        >
          <!-- Article Image -->
          <div class="relative w-1/3 overflow-hidden">
            <img 
              :src="post.image" 
              :alt="post.title" 
              class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-80" />
          </div>

          <div class="h-full border-r border-card-border" />

          <!-- Article Content -->
          <div class="flex w-2/3 flex-col justify-center space-y-3 p-4 transition-transform duration-500 ease-out group-hover:translate-x-2 md:p-6">
            <h3 class="text-lg font-semibold transition-colors duration-500 ease-out group-hover:text-primary md:text-xl">
              {{ post.title }}
            </h3>
            <p class="line-clamp-2 text-sm text-muted-foreground transition-colors duration-500 ease-out group-hover:text-current">
              {{ getPostSummary(post.contentHTML) }}
            </p>
          </div>
        </article>
      </CardContent>

      <!-- Pagination -->
      <CardFooter v-if="totalPages > 1" class="flex justify-center px-6">
        <Pagination 
          v-model:page="currentPage" 
          :total="totalPages" 
          :sibling-count="1" 
          show-edges
          @update:page="handlePageChange"
        >
          <PaginationList v-slot="{ items }" class="flex items-center gap-2">
            <PaginationFirst />
            <PaginationPrev />

            <template v-for="(item, index) in items" :key="index">
              <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                <Button 
                  :variant="item.value === currentPage ? 'default' : 'outline'" 
                  class="h-9 w-9 p-0"
                  @click="handlePageChange(item.value)"
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
import { ref, computed, onMounted } from 'vue'
import { usePost } from '~/composables/usePost'
import { usePostStore } from '~/store/post'

const ITEMS_PER_PAGE = 5 // 每页显示5个文章
const currentPage = ref(1)
const { posts, loading, error } = usePost()

// 计算分页后的文章列表
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return posts.value?.slice(start, end) || []
})

// 获取文章摘要
const getPostSummary = (html: string) => {
  const tmp = document.createElement('body')
  tmp.innerHTML = html
  const text = tmp.textContent || tmp.innerText || ''
  return text.slice(0, 100) + (text.length > 100 ? '...' : '')
}

// 计算总页数
const totalPages = computed(() => 
  Math.ceil((posts.value?.length || 0) / ITEMS_PER_PAGE)
)

// 页码改变处理
const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 组件挂载时获取文章列表
onMounted(async () => {
  const store = usePostStore()
  await store.getAllPosts()
})
</script>

<style scoped>
.card-hover {
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .card-hover,
  .card-hover * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
