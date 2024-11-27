<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <LoginForm 
        v-if="currentForm === 'login'" 
        @success="handleSuccess" 
        @switch-to-register="switchForm('register')" 
      />
      <RegisterForm 
        v-else 
        @success="handleSuccess" 
        @switch-to-login="switchForm('login')" 
      />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '~/components/ui/dialog'
import LoginForm from '~/components/business/auth/LoginForm.vue'
import RegisterForm from '~/components/business/auth/RegisterForm.vue'

const props = defineProps<{
  defaultForm?: 'login' | 'register'
}>()

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'update:open', value: boolean): void
}>()

const isOpen = ref(false)
const currentForm = ref<'login' | 'register'>(props.defaultForm || 'login')

// 监听对话框关闭，重置表单状态
watch(isOpen, (newValue) => {
  if (!newValue) {
    setTimeout(() => {
      currentForm.value = props.defaultForm || 'login'
    }, 300)
  }
  emit('update:open', newValue)
})

const switchForm = (form: 'login' | 'register') => {
  currentForm.value = form
}

const handleSuccess = () => {
  isOpen.value = false
  emit('success')
}
</script>
