<template>
  <footer 
    v-if="state.isVisible"
    class="fixed bottom-0 left-0 right-0 w-full backdrop-blur-sm border-t transition-all duration-300"
    :class="{ 'translate-y-full opacity-0': state.isHidden }"
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
          <span class="text-lg font-semibold">
            博客社区
          </span>
        </div>

        <!-- 导航链接 -->
        <nav class="mb-4">
          <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <li v-for="(link, index) in navLinks" :key="index">
              <router-link 
                :to="link.url"
                class="text-sm hover:text-muted-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- 分隔线 -->
        <div class="w-24 border-t my-3"/>

        <!-- 社交链接 -->
        <div class="flex justify-center gap-4 mb-4">
          <a 
            v-for="(social, index) in socialLinks" 
            :key="index"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.name"
            class="p-2 rounded-md hover:bg-muted transition-colors group"
          >
            <component 
              :is="social.icon" 
              class="h-5 w-5"
            />
          </a>
        </div>

        <!-- 版权信息 -->
        <p class="text-sm">
          &copy; {{ new Date().getFullYear() }} 博客社区. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { 
  GithubIcon, 
  MessageCircleIcon,
  ShareIcon,
  RssIcon
} from 'lucide-vue-next'

interface FooterState {
  isVisible: boolean
  isHidden: boolean
}

const state = ref<FooterState>({
  isVisible: false,
  isHidden: true
})

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

let hideTimeout: number | null = null

const throttle = <T extends unknown[]>(fn: (...args: T) => void, delay: number) => {
  let lastTime = 0;
  return (...args: T) => {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  }
}

const showFooter = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
  state.value.isHidden = false
}

const hideFooter = () => {
  hideTimeout = setTimeout(() => {
    state.value.isHidden = true
  }, 300) as unknown as number
}

const handleScroll = throttle(() => {
  const scrollPosition = window.scrollY + window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const threshold = 100

  if (documentHeight - scrollPosition <= threshold) {
    state.value.isVisible = true
    showFooter()
  } else {
    hideFooter()
    if (documentHeight - scrollPosition > window.innerHeight) {
      state.value.isVisible = false
    }
  }
}, 100)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>
