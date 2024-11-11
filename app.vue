<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Jank UI',
  ogTitle: 'Jank',
  description: 'Jank 一个致力于博客开发的社区',
  ogDescription: 'Jank 一个致力于博客开发的社区',
  ogImage: 'https://example.com/image.png',
})
</script>

<style lang="css" scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>