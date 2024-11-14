<template>
  <div class="space-y-6">
    <DialogHeader>
      <DialogTitle>登录账号</DialogTitle>
      <DialogDescription>
        输入您的邮箱和密码登录
      </DialogDescription>
    </DialogHeader>

    <Form :form="form" :submit="onSubmit">
      <form class="space-y-4">
        <FormField v-slot="{ field, errors }" name="email">
          <FormItem>
            <FormLabel>邮箱</FormLabel>
            <FormControl>
              <Input 
                v-model="field.value" 
                type="email" 
                placeholder="请输入邮箱" 
                autocomplete="email" 
                :disabled="authStore.loading"
                @blur="field.onBlur"
                @input="handleEmailChange" 
              />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, errors }" name="password">
          <FormItem>
            <FormLabel>密码</FormLabel>
            <FormControl>
              <Input 
                v-model="field.value" 
                type="password" 
                placeholder="请输入密码" 
                autocomplete="current-password"
                :disabled="authStore.loading"
                @blur="field.onBlur" 
              />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, errors }" name="img_verification_code">
          <FormItem>
            <FormLabel>验证码</FormLabel>
            <div class="flex space-x-2">
              <FormControl>
                <Input 
                  v-model="field.value" 
                  placeholder="请输入验证码" 
                  class="flex-1"
                  maxlength="4"
                  :disabled="authStore.loading"
                  @blur="field.onBlur" 
                />
              </FormControl>
              <div 
                class="h-10 w-32 cursor-pointer overflow-hidden rounded-md border"
                @click="refreshCaptcha"
              >
                <img 
                  v-if="captchaImage"
                  :src="captchaImage" 
                  alt="验证码" 
                  class="h-full w-full object-cover"
                  :class="{ 'opacity-50': authStore.loading }"
                >
              </div>
            </div>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="remember">
          <FormItem class="flex items-center space-x-2">
            <FormControl>
              <Checkbox 
                v-model="field.value"
                :disabled="authStore.loading" 
              />
            </FormControl>
            <div class="leading-none">
              <FormLabel class="text-sm font-normal">记住我</FormLabel>
            </div>
          </FormItem>
        </FormField>

        <Button 
          type="submit" 
          class="w-full"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? '登录中...' : '登录' }}
        </Button>
      </form>
    </Form>

    <div class="text-center text-sm">
      <a 
        href="#" 
        class="text-primary hover:underline" 
        :class="{ 'pointer-events-none opacity-50': authStore.loading }"
        @click.prevent="switchToRegister"
      >
        还没有账号？立即注册
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { toast } from '~/components/ui/toast'
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { useAuthStore } from '~/store/auth'
import type { LoginRequest } from '~/types/auth'

const emit = defineEmits<{
  (e: 'success' | 'switch-to-register'): void
}>()

const captchaImage = ref<string>('')
const currentEmail = ref('')

const formSchema = toTypedSchema(z.object({
  email: z.string()
    .min(1, '邮箱是必填项')
    .email('请输入有效的邮箱地址'),
  password: z.string()
    .min(6, '密码至少6个字符')
    .max(20, '密码最多20个字符'),
  img_verification_code: z.string()
    .length(4, '验证码必须是4位'), 
  remember: z.boolean()
    .default(false),
}))

const form = useForm<LoginRequest>({
  validationSchema: formSchema,
  initialValues: {
    email: '',
    password: '',
    img_verification_code: '',
    remember: false,
  },
})

const authStore = useAuthStore()

const handleEmailChange = async (event: Event) => {
  const email = (event.target as HTMLInputElement).value
  if (email !== currentEmail.value) {
    currentEmail.value = email
    await refreshCaptcha()
  }
}

const refreshCaptcha = async () => {
  if (!currentEmail.value) return
  
  try {
    const base64Image = await authStore.genImgVerification(currentEmail.value)
    if (base64Image) {
      captchaImage.value = `data:image/png;base64,${base64Image}`
    }
  } catch (error) {
    console.error('Failed to fetch captcha:', error)
    toast({
      title: '获取验证码失败',
      description: '请稍后重试',
      variant: 'destructive',
    })
  }
}

const handleSubmit = async (values: LoginRequest) => {
  if (authStore.loading) return
  
  try {
    await authStore.login(values)
    await authStore.fetchProfile()
    
    toast({
      title: '登录成功',
      description: '欢迎回来！',
    })
    emit('success')
  } catch (error) {
    console.error('Login error:', error)
    refreshCaptcha()
    toast({
      title: '登录失败',
      description: error instanceof Error ? error.message : '未知错误',
      variant: 'destructive',
    })
  }
}

const onSubmit = form.handleSubmit(handleSubmit)

const switchToRegister = () => {
  if (!authStore.loading) {
    emit('switch-to-register')
  }
}
</script>
