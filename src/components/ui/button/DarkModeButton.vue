<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()

const toggleTheme = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <Button 
    variant="ghost" 
    @click="toggleTheme"
    class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
  >
    <Icon 
      icon="radix-icons:moon" 
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
    />
    <Icon 
      icon="radix-icons:sun" 
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
    />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>
