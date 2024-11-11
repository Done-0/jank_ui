<template>
  <section class="space-y-8">
    <CardInk
      :avatar-url="'https://haowallpaper.com/link/common/file/previewFileImg/15430254183092544'"
      :name="'John Doe'" :title="'Frontend Developer'" :back-details="[
        '🎓 Frontend Developer',
        '💼 5 Years Experience',
        '🌟 Vue.js Expert'
      ]" :socials="[
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
      ]" />
    <Calendar v-model="value" :weekday-format="'short'" class="rounded-md border" />
  </section>
</template>

<script setup lang="ts">
import { CardInk } from '~/components/ui/card'
import { Calendar } from '~/components/ui/calendar'
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { type Ref, ref } from 'vue'

const value = ref(today(getLocalTimeZone())) as Ref<DateValue>
</script>
