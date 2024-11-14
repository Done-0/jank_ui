<script setup lang="ts">
interface ErrorProps {
  url: string;
  statusCode: number;
  statusMessage: string;
  message: string;
  description: string;
  data: object;
}

const props = defineProps<{
  error: ErrorProps
}>()

const handleError = () => {
  clearError({ redirect: '/' });
}
</script>

<template>
  <div>
    <h1>{{ props.error.statusMessage }}</h1>
    <p>{{ props.error.message }}</p>
    <p>{{ props.error.description }}</p>
    <button class="text-line-hover" @click="handleError">返回首页</button>
  </div>
</template>
