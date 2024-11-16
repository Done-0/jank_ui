<template>
  <div class="space-y-6">
    <DialogHeader>
      <DialogTitle>注册账号</DialogTitle>
      <DialogDescription>
        输入您的信息以创建新账号
      </DialogDescription>
    </DialogHeader>

    <Form :form="form">
      <form class="space-y-4" @submit="onSubmit">
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
                autocomplete="new-password"
                :disabled="authStore.loading"
                @blur="field.onBlur" 
              />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, errors }" name="confirmPassword">
          <FormItem>
            <FormLabel>确认密码</FormLabel>
            <FormControl>
              <Input 
                v-model="field.value" 
                type="password" 
                placeholder="请再次输入密码" 
                autocomplete="new-password"
                :disabled="authStore.loading"
                @blur="field.onBlur" 
              />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, errors }" name="email_verification_code">
          <FormItem>
            <FormLabel>邮箱验证码</FormLabel>
            <div class="flex space-x-2">
              <FormControl>
                <Input 
                  v-model="field.value" 
                  placeholder="请输入邮箱验证码" 
                  :disabled="authStore.loading"
                  @blur="field.onBlur"
                />
              </FormControl>
              <Button 
                type="button" 
                variant="outline"
                :disabled="!canSendCode || authStore.loading"
                @click="sendVerificationCode"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
              </Button>
            </div>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, errors }" name="img_verification_code">
          <FormItem>
            <FormLabel>图形验证码</FormLabel>
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

        <FormField v-slot="{ field }" name="agreeToTerms">
          <FormItem class="flex items-center space-x-2">
            <FormControl>
              <Checkbox 
                v-model="field.value"
                :disabled="authStore.loading" 
              />
            </FormControl>
            <div class="leading-none">
              <FormLabel class="text-sm font-normal">我同意条款和条件</FormLabel>
            </div>
          </FormItem>
        </FormField>

        <Button 
          type="submit" 
          class="w-full"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? '注册中...' : '注册' }}
        </Button>
      </form>
    </Form>

    <div class="text-center text-sm">
      <a href="#" class="text-primary hover:underline" @click.prevent="switchToLogin">
        已有账号？立即登录
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
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
import type { RegisterRequest, EmailVerificationRequest } from '~/types/auth'

// 发射事件类型定义
const emit = defineEmits<{
  (e: 'success' | 'switch-to-login'): void
}>()

// 表单值类型定义
interface RegisterFormValues {
  email: string
  password: string
  confirmPassword: string
  img_verification_code: string
  email_verification_code: string
  agreeToTerms: boolean
  nickname: string
}

const captchaImage = ref<string>('')
const currentEmail = ref('')
const countdown = ref(0)
const countdownTimer = ref<NodeJS.Timeout>()

const canSendCode = computed(() => {
  return form.values.email && 
         form.values.img_verification_code && 
         countdown.value === 0 &&
         !authStore.loading
})

const formSchema = toTypedSchema(
  z.object({
    email: z.string()
      .min(1, '邮箱是必填项')
      .email('请输入有效的邮箱地址'),
    nickname: z.string()
      .min(1, '昵称是必填项'),
    password: z.string()
      .min(6, '密码至少6个字符')
      .max(20, '密码最多20个字符'),
    confirmPassword: z.string()
      .min(6, '密码至少6个字符')
      .max(20, '密码最多20个字符'),
    img_verification_code: z.string()
      .length(4, '验证码必须是4位'),
    email_verification_code: z.string()
      .length(6, '邮箱验证码必须是6位'),
    agreeToTerms: z.boolean()
      .refine(val => val === true, '必须同意条款'),
  }).superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: '密码不匹配',
      })
    }
  })
)

const initialValues: RegisterFormValues = {
  email: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  img_verification_code: '',
  email_verification_code: '',
  agreeToTerms: false,
}

const form = useForm<RegisterFormValues>({
  validationSchema: formSchema,
  initialValues,
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

const startCountdown = () => {
  countdown.value = 60
  countdownTimer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer.value)
    }
  }, 1000)
}

const sendVerificationCode = async () => {
  if (!canSendCode.value || !form.values.email) return
  
  try {
    const emailRequest: EmailVerificationRequest = {
      email: form.values.email
    }
    await authStore.sendEmailVerificationCode(emailRequest.email)
    startCountdown()
    toast({
      title: '验证码已发送',
      description: '请查看您的邮箱',
    })
  } catch (error) {
    toast({
      title: '发送失败',
      description: error instanceof Error ? error.message : '未知错误',
      variant: 'destructive',
    })
  }
}

const onSubmit = form.handleSubmit(async (values) => {
  if (authStore.loading) return

  try {
    const registerData: RegisterRequest = {
      email: values.email,
      nickname: values.email, // 使用邮箱作为默认昵称
      password: values.password,
      img_verification_code: values.img_verification_code,
      email_verification_code: values.email_verification_code
    }
    
    await authStore.register(registerData)
    toast({
      title: '注册成功',
      description: '账号创建成功！',
    })
    emit('success')
  } catch (error) {
    toast({
      title: '注册失败',
      description: error instanceof Error ? error.message : '未知错误',
      variant: 'destructive',
    })
  }
})

const switchToLogin = () => {
  emit('switch-to-login')
}

onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
})
</script>
