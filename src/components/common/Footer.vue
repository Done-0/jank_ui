<template>
  <footer 
    class="fixed bottom-0 left-0 right-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 transition-transform duration-300"
    :class="{ 'translate-y-full': isHidden }"
    @mouseenter="showFooter"
    @mouseleave="hideFooter"
  >
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex flex-col items-center">
        <!-- Logo -->
        <div class="flex items-center space-x-2 mb-4">
          <img 
            src="" 
            alt="Logo" 
            class="h-6 w-auto"
          >
          <span class="text-lg font-semibold text-gray-700 dark:text-gray-200">
            博客社区
          </span>
        </div>

        <!-- 导航链接 -->
        <nav class="mb-4">
          <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <li v-for="(link, index) in navLinks" :key="index">
              <router-link 
                :to="link.url"
                class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- 分隔线 -->
        <div class="w-24 border-t border-gray-200 dark:border-gray-700 my-3"></div>

        <!-- 社交链接 -->
        <div class="flex justify-center gap-4 mb-4">
          <a 
            v-for="(social, index) in socialLinks" 
            :key="index"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.name"
            class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <component 
              :is="social.icon" 
              class="h-5 w-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
            />
          </a>
        </div>

        <!-- 版权信息 -->
        <p class="text-sm text-gray-500 dark:text-gray-400">
          &copy; {{ new Date().getFullYear() }} 博客社区. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  GithubIcon, 
  MessageCircleIcon, // 替代微信
  ShareIcon,  // 替代微博
  RssIcon  // 添加 RSS 订阅图标
} from 'lucide-vue-next'

const navLinks = [
  { name: '首页', url: '/' },
  { name: '文章', url: '/articles' },
  { name: '标签', url: '/tags' },
  { name: '关于', url: '/about' },
  { name: '隐私政策', url: '/privacy' }
]

const socialLinks = [
  {
    name: '讨论',
    url: '#',
    icon: MessageCircleIcon
  },
  {
    name: '分享',
    url: '#',
    icon: ShareIcon
  },
  {
    name: 'GitHub',
    url: '#',
    icon: GithubIcon
  },
  {
    name: 'RSS',
    url: '#',
    icon: RssIcon
  }
]

// 页脚显示隐藏逻辑
const isHidden = ref(true)
let hideTimeout: number | null = null

const showFooter = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
  isHidden.value = false
}

const hideFooter = () => {
  hideTimeout = setTimeout(() => {
    isHidden.value = true
  }, 300) as unknown as number
}

// 监听滚动事件，在滚动到底部时显示页脚
const handleScroll = () => {
  const scrolledToBottom = 
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
  if (scrolledToBottom) {
    showFooter()
  } else {
    hideFooter()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
