<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <LoginForm v-if="currentForm === 'login'" @success="handleSuccess" @switch-to-register="switchForm('register')" />
      <RegisterForm v-else @success="handleSuccess" @switch-to-login="switchForm('login')" />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '~/components/ui/dialog'
import LoginForm from '~/components/business/auth/LoginForm.vue'
import RegisterForm from '~/components/business/auth/RegisterForm.vue'

const isOpen = ref(false)
const currentForm = ref<'login' | 'register'>('login')

const switchForm = (form: 'login' | 'register') => {
  currentForm.value = form
}

const handleSuccess = () => {
  isOpen.value = false
}
</script>


