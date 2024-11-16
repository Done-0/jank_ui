<script setup lang="ts">
interface ErrorProps {
  url: string;
  statusCode: number;
  statusMessage: string;
  message: string;
  description: string;
  data: object;
}

const props = defineProps<{ error: ErrorProps }>()

const handleError = () => {
  clearError({ redirect: '/' });
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <h1>{{ props.error.statusCode }} - {{ props.error.statusMessage }}</h1>
      <p class="error-message">{{ props.error.message }}</p>
      <p class="error-description">{{ props.error.description }}</p>
      <button class="btn-retry" @click="handleError">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
/* Center content both vertically and horizontally */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
  font-family: 'Arial', sans-serif;
}

.error-content {
  text-align: center;
  background-color: #fff;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

h1 {
  font-size: 3rem;
  font-weight: 600;
  color: #ff6347; /* Tomato color for the error message */
  margin-bottom: 20px;
}

.error-message {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 15px;
}

.error-description {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 30px;
}

.btn-retry {
  padding: 12px 30px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-retry:hover {
  background-color: #0056b3;
}
</style>
