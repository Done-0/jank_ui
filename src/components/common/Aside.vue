<template>
  <section>
    <CardInk
      :avatar-url="'https://haowallpaper.com/link/common/file/previewFileImg/15430254183092544'"
      :name="'John Doe'"
      :title="'Frontend Developer'"
      :back-details="[
        '🎓 Frontend Developer',
        '💼 5 Years Experience',
        '🌟 Vue.js Expert'
      ]"
      :socials="[
        {
          name: 'WeChat',
          icon: 'https://haowallpaper.com/link/common/file/previewFileImg/15430254183092544',
          url: '#'
        },
        {
          name: 'GitHub',
          icon: 'https://haowallpaper.com/link/common/file/previewFileImg/15430254183092544',
          url: 'https://haowallpaper.com/link/common/file/previewFileImg/15430254183092544'
        }
      ]"
    />
  </section>
</template>

<script setup lang="ts">
import CardInk from '@/components/ui/card/CardInk.vue'
</script>
