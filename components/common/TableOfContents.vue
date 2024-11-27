<template>
  <Card class="w-full">
    <CardContent class="pt-4">
      <h3 class="text-lg font-medium mb-2">文章目录</h3>
      <ul class="space-y-1.5">
        <li 
          v-for="item in tocItems" 
          :key="item.id"
          class="relative"
          :style="{ marginLeft: `${item.level * 16}px` }"
        >
          <a 
            :href="`#${item.id}`"
            class="text-muted-foreground hover:text-foreground transition-colors block"
            :class="{ 'text-foreground font-medium': item.isActive }"
            @click.prevent="scrollToHeading(item.id)"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'

interface TocItem {
  id: string
  text: string
  level: number
  isActive?: boolean
}

// 防抖函数类型定义
type DebouncedFunction<T extends (...args: unknown[]) => unknown> = (
  ...args: Parameters<T>
) => void

const tocList = ref<TocItem[]>([])
const activeHeadingId = ref<string>('')

// 计算属性：获取所有一级目录
const firstLevelItems = computed(() => {
  return tocList.value.filter(item => item.level === 0)
})

// 计算属性：根据层级关系处理显示逻辑
const tocItems = computed(() => {
  return tocList.value.filter(item => {
    // 一级目录始终显示
    if (item.level === 0) return true
    
    // 找到当前项的父级目录
    const parentItem = firstLevelItems.value.find(h => 
      tocList.value.indexOf(h) < tocList.value.indexOf(item) && 
      tocList.value.indexOf(h) === Math.max(...firstLevelItems.value
        .filter(h2 => tocList.value.indexOf(h2) < tocList.value.indexOf(item))
        .map(h2 => tocList.value.indexOf(h2))
      )
    )
    
    // 只显示激活的父级目录下的子目录
    return parentItem?.isActive
  })
})

// 检查当前滚动位置并更新激活状态
const updateActiveHeading = (): void => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  let activeFound = false
  
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i]
    const rect = heading.getBoundingClientRect()
    
    if (rect.top <= 100 && !activeFound) {
      activeFound = true
      const currentId = heading.id
      activeHeadingId.value = currentId
      
      tocList.value = tocList.value.map(item => {
        const parentHeading = item.level === 0 ? item : 
          firstLevelItems.value.find(h => 
            tocList.value.indexOf(h) < tocList.value.indexOf(item) && 
            tocList.value.indexOf(h) === Math.max(...firstLevelItems.value
              .filter(h2 => tocList.value.indexOf(h2) < tocList.value.indexOf(item))
              .map(h2 => tocList.value.indexOf(h2))
            )
          )
        
        return {
          ...item,
          isActive: item.id === currentId || (parentHeading?.id === item.id)
        }
      })
      
      break
    }
  }
  
  if (!activeFound) {
    activeHeadingId.value = ''
    tocList.value = tocList.value.map(item => ({
      ...item,
      isActive: false
    }))
  }
}

// 防抖函数
const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): DebouncedFunction<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

// 生成唯一ID
const generateUniqueId = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 平滑滚动到目标位置
const scrollToHeading = (id: string): void => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80 // 可调整偏移量
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// 初始化目录
onMounted(() => {
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  
  tocList.value = Array.from(headers).map(header => {
    const text = header.textContent?.trim() || ''
    const id = header.id || generateUniqueId(text)
    
    if (!header.id) {
      header.id = id
    }
    
    return {
      id,
      text,
      level: parseInt(header.tagName.replace('H', '')) - 1,
      isActive: false
    }
  })
  
  const debouncedUpdateActiveHeading = debounce(updateActiveHeading, 100)
  window.addEventListener('scroll', debouncedUpdateActiveHeading)
  updateActiveHeading()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>

<style scoped>
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

a {
  position: relative;
  padding: 4px 8px;
  border-radius: 4px;
}

a:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

a.text-foreground {
  border-left: 2px solid currentColor;
  margin-left: -8px;
  padding-left: 6px;
}
</style>
