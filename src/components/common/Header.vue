<template>
  <header class="w-full bg-white dark:bg-gray-800 shadow-md border-b border-gray-300 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-2 py-4 flex items-center">
      <!-- Logo  -->
      <router-link 
        to="/" 
        class="text-xl font-bold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mr-8"
      >
        Jank UI
      </router-link>

      <!-- 左侧导航链接 -->
      <nav class="flex space-x-6 items-center">
        <router-link 
          to="/" 
          class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          首页
        </router-link>
        <router-link 
          to="/about" 
          class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          社区
        </router-link>
        <router-link 
          to="/contact" 
          class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          联系我们
        </router-link>
      </nav>

      <!-- 右侧操作区 -->
      <div class="flex items-center gap-3 ml-auto">
        <!-- 暗黑模式按钮 -->
        <Button 
          variant="ghost" 
          size="icon"
          class="h-10 w-10 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <DarkModeButton class="h-5 w-5" />
        </Button>

        <!-- 未登录状态 -->
        <div v-if="!isLoggedIn">
          <Button 
            variant="ghost"
            size="icon"
            @click="$emit('login')"
            class="h-10 w-10 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <UserIcon class="h-5 w-5" />
          </Button>
        </div>

        <!-- 已登录状态 -->
        <div v-else>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                class="h-9 w-9 rounded-md overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img 
                  :src="userProfileImage" 
                  alt="头像" 
                  class="h-full w-full object-cover"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-40">
              <DropdownMenuItem @click="$emit('logout')">
                <LogOutIcon class="h-4 w-4 mr-2" />
                <span>注销</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import DarkModeButton from '@/components/ui/button/DarkModeButton.vue'
import { UserIcon, LogOutIcon } from 'lucide-vue-next'

interface Props {
  isLoggedIn: boolean
  userProfileImage?: string
}

defineProps<Props>()
</script>
