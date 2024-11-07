<template>
    <Card class="w-[255px] h-[300px] relative p-4">
      <!-- 背景 -->
      <div class="cloud-background absolute inset-0 overflow-hidden rounded-xl" ref="cloudContainer" />
      
      <CardContent class="relative flex flex-col items-center p-0 h-[220px]">
        <!-- 头像容器 -->
        <div class="relative w-40 aspect-square cursor-pointer mt-4" 
             @mouseenter="isHovered = true" 
             @mouseleave="isHovered = false">
          <!-- 头像 -->
          <img
            :src="props.avatarUrl"
            :alt="props.name"
            class="rounded-full w-full h-full object-cover shadow-lg transition-transform duration-700 ease-out"
            :class="isHovered ? 'scale-75 opacity-0' : 'scale-100 opacity-100'"
          />
          
          <!-- 详细信息 -->
          <div class="absolute inset-0 flex items-center justify-center"
               :class="isHovered ? 'animate-fadeIn' : 'animate-fadeOut'">
            <div class="space-y-3">
              <p v-for="(detail, index) in props.backDetails" 
                 :key="index"
                 class="text-sm text-primary/90 text-center transition-all duration-500"
                 :style="{
                   transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                   opacity: isHovered ? 1 : 0,
                   transitionDelay: `${index * 100}ms`
                 }">
                {{ detail }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
  
      <CardFooter class="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between">
        <!-- 简介 -->
        <div class="flex-1 min-w-0 mr-4">
          <h3 class="text-sm font-medium truncate mb-1">{{ props.name }}</h3>
          <p class="text-xs text-muted-foreground truncate">{{ props.title }}</p>
        </div>
        <!-- 社交图标 -->
        <div class="flex items-center gap-3">
          <a v-for="(social, index) in props.socials" 
             :key="index"
             :href="social.url" 
             target="_blank"
             class="w-9 h-9 rounded-full overflow-hidden transform hover:scale-100 
                   transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1">
            <img :src="social.icon" :alt="social.name" class="w-full h-full object-cover" />
          </a>
        </div>
      </CardFooter>
    </Card> 
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Card, CardContent, CardFooter } from '@/components/ui/card'
  import { useCloudAnimation } from '@/assets/styles/CloudAnimation.ts'
  
  interface SocialLink {
    name: string
    icon: string
    url: string
  }
  
  interface Props {
    avatarUrl: string
    name: string
    title: string
    backDetails: string[]
    socials: SocialLink[]
  }
  
  const props = withDefaults(defineProps<Props>(), {
    avatarUrl: '/default-avatar.jpg',
    name: 'Your Name',
    title: 'Your Title',
    backDetails: () => ['🎓 Detail 1', '💼 Detail 2', '🌟 Detail 3'],
    socials: () => []
  })
  
  const isHovered = ref(false)
  const cloudContainer = ref<HTMLDivElement | null>(null)
  
  useCloudAnimation(cloudContainer)
  </script>
  
  <style scoped>
  .cloud-background {
    filter: blur(2px);
    opacity: 0.8;
  }
  
  @property --rotate {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.7s ease-out forwards;
  }
  
  .animate-fadeOut {
    animation: fadeOut 0.7s ease-out forwards;
  }
  </style>
  