<template>
  <section>
    <Card>
      <CardHeader>
        <CardTitle>侧栏</CardTitle>
        <CardDescription class="pt-4">导航与分类列表</CardDescription>
      </CardHeader>

      <Separator />
      
      <CardContent>
        <p class="text-sm text-muted-foreground pt-4">
          此处显示侧栏内容，如导航、分类等。
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
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
</script>
