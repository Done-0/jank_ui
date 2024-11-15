<template>
  <header class="w-full border-b">
    <div class="container flex h-16 items-center">
      <router-link 
        to="/" 
        class="text-xl font-semibold mr-8 text-foreground/90 hover:text-foreground transition-colors"
      >
        Jank UI
      </router-link>

      <nav class="flex items-center space-x-8">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path" 
          class="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          {{ link.name }}
        </router-link>
      </nav>

      <div class="flex items-center space-x-4 ml-auto">
        <Button variant="ghost" size="icon">
          <DarkModeButton class="h-[1.2rem] w-[1.2rem]" />
        </Button>

        <!-- 未登录状态显示登录按钮 -->
        <AuthDialog v-if="!isAuthenticated">
          <Button variant="ghost" size="icon">
            <UserIcon class="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </AuthDialog>

        <!-- 已登录状态显示用户菜单 -->
        <DropdownMenu v-else>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" class="rounded-full">
              <img 
                :src="userAvatar" 
                :alt="userName"
                class="h-8 w-8 rounded-full object-cover"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuItem>
              <span class="w-full text-sm font-medium">{{ userName }}</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleLogout">
              <LogOutIcon class="h-4 w-4 mr-2" />
              <span>注销</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
import { DarkModeButton } from '@/components/ui/button'
import { UserIcon, LogOutIcon } from 'lucide-vue-next'
import { AuthDialog } from '@/components/business/auth'
import { useAuthStore } from '@/store/modules/auth'
import { computed } from 'vue'

const navLinks = [
  { name: '首页', path: '/' },
  { name: '社区', path: '/about' },
  { name: '联系我们', path: '/contact' }
]

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.logout()
}

const userAvatar = computed(() => {
  return authStore.userProfile?.avatar || '/default-avatar.png'
})

const userName = computed(() => {
  return authStore.userProfile?.name || authStore.userInfo?.nickname || '用户'
})
</script>


