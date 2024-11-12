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
                :disabled="isSubmitting"
                @blur="field.onBlur" 
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
                :disabled="isSubmitting"
                @blur="field.onBlur" 
              />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, errors }" name="verificationCode">
          <FormItem>
            <FormLabel>验证码</FormLabel>
            <div class="flex space-x-2">
              <FormControl>
                <Input 
                  v-model="field.value" 
                  placeholder="请输入验证码" 
                  class="flex-1"
                  maxlength="4"
                  :disabled="isSubmitting"
                  @blur="field.onBlur" 
                />
              </FormControl>
              <div 
                class="h-10 w-32 cursor-pointer overflow-hidden rounded-md border"
                @click="authStore.getCaptcha()"
              >
                <img 
                  :src="authStore.captchaUrl" 
                  alt="验证码" 
                  class="h-full w-full object-cover"
                  :class="{ 'opacity-50': authStore.captchaLoading }"
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
                :disabled="isSubmitting" 
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
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '登录中...' : '登录' }}
        </Button>
      </form>
    </Form>

    <div class="text-center text-sm">
      <a 
        href="#" 
        class="text-primary hover:underline" 
        :class="{ 'pointer-events-none opacity-50': isSubmitting }"
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
import { useAuthStore } from '~/store/auth/auth'

const emit = defineEmits<{
  (e: 'success' | 'switch-to-register'): void
}>()

interface LoginFormValues {
  email: string
  password: string
  verificationCode: string
  remember: boolean
}

const isSubmitting = ref(false)

const formSchema = toTypedSchema(z.object({
  email: z.string()
    .min(1, '邮箱是必填项')
    .email('请输入有效的邮箱地址'),
  password: z.string()
    .min(6, '密码至少6个字符')
    .max(20, '密码最多20个字符'),
  verificationCode: z.string()
    .length(4, '验证码必须是4位'), 
  remember: z.boolean()
    .default(false),
}))

const form = useForm<LoginFormValues>({
  validationSchema: formSchema,
  initialValues: {
    email: '',
    password: '',
    verificationCode: '',
    remember: false,
  },
})

const authStore = useAuthStore()

onMounted(() => {
  authStore.getCaptcha()
})

const handleSubmit = async (values: LoginFormValues) => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    await authStore.login(values)
    
    toast({
      title: '登录成功',
      description: '欢迎回来！',
    })
    emit('success')
  } catch (error) {
    console.error('Login error:', error)
    authStore.getCaptcha()
    toast({
      title: '登录失败',
      description: error instanceof Error ? error.message : '未知错误',
      variant: 'destructive',
    })
  } finally {
    isSubmitting.value = false
  }
}

const onSubmit = form.handleSubmit(handleSubmit)

const switchToRegister = () => {
  if (!isSubmitting.value) {
    emit('switch-to-register')
  }
}
</script>
