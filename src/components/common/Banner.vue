<template>
  <section class="w-full flex justify-center py-6">
    <Card class="w-full max-w-7xl h-48">
      <CardHeader>
        <CardTitle class="text-2xl">
          热门与推荐内容
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          {{ content }}
        </p>
      </CardContent>
    </Card>
  </section>
</template>

<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

defineProps<{
  content: string
}>()
</script>
