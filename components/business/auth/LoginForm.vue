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
                v-bind="field"
                type="email"
                placeholder="请输入邮箱" 
                autocomplete="email" 
                :disabled="!!loading" 
                @input="handleEmailInput"
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
                v-bind="field"
                type="password"
                placeholder="请输入密码"
                autocomplete="current-password"
                :disabled="!!loading"
              />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, errors }" name="img_verification_code">
          <FormItem>
            <FormLabel>图形验证码</FormLabel>
            <div class="flex space-x-2">
              <FormControl>
                <Input 
                  v-bind="field"
                  placeholder="请输入验证码"
                  class="flex-1" 
                  maxlength="4"
                  :disabled="!!loading"
                />
              </FormControl>
              <div 
                class="h-10 w-32 cursor-pointer overflow-hidden rounded-md border flex items-center justify-center bg-white"
                :class="{ 'opacity-50 cursor-not-allowed': !isEmailValid || loading }"
                @click="handleGetCaptcha"
              >
                <template v-if="loading">
                  <span class="text-sm text-gray-500">加载中...</span>
                </template>
                <template v-else-if="imgVerificationCode">
                  <img 
                    :src="processedImgSrc"
                    alt="验证码" 
                    class="h-full w-full object-cover"
                    @error="handleImageError"
                  >
                </template>
                <template v-else>
                  <span class="text-sm text-gray-500">获取验证码</span>
                </template>
              </div>
            </div>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="remember">
          <FormItem class="flex items-center space-x-2">
            <FormControl>
              <Checkbox 
                v-bind="field"
                :disabled="!!loading"
                class="mt-2"
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
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </Button>
      </form>
    </Form>

    <div class="text-center text-sm">
      <a 
        href="#" 
        class="text-primary hover:underline" 
        :class="{ 'pointer-events-none opacity-50': loading }"
        @click.prevent="emit('switch-to-register')"
      >
        还没有账号？立即注册
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
import type { LoginRequest } from '~/types/auth'

const auth = useAuth()
const { loading, login, fetchProfile, genImgVerification } = auth

const formSchema = toTypedSchema(z.object({
  email: z.string().min(1, '邮箱是必填项').email('请输入有效的邮箱'),
  password: z.string().min(6, '密码至少6个字符').max(20, '密码最多20个字符'),
  img_verification_code: z.string().length(4, '验证码必须是4位'),
  remember: z.boolean().optional().default(false),
}))

const emit = defineEmits<{
  (e: 'success' | 'switch-to-register'): void
}>()

const imgVerificationCode = ref<string>('')
const COOLDOWN_TIME = 1000
const lastRefreshTime = ref(0)

const form = useForm<LoginRequest>({
  validationSchema: formSchema,
  initialValues: {
    email: '',
    password: '',
    img_verification_code: '',
    remember: false,
  },
})

const isFormValid = computed(() => {
  const { email, password, img_verification_code } = form.values
  const isValid = email && password && img_verification_code && 
         img_verification_code === 4 &&
         isEmailValid.value &&
         password.length >= 6 &&
         Object.keys(form.errors).length === 0
  console.log('Form validity:', isValid)
  return isValid
})

const isEmailValid = computed(() => {
  const email = form.values.email
  return Boolean(email && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email))
})

const processedImgSrc = computed(() => {
  if (!imgVerificationCode.value) return ''
  return imgVerificationCode.value.startsWith('data:image') 
    ? imgVerificationCode.value 
    : `data:image/png;base64,${imgVerificationCode.value}`
})

const handleImageError = () => {
  console.error('验证码图片加载失败')
  imgVerificationCode.value = ''
  showToast('验证码加载失败', '请点击重新获取', 'destructive')
}

const handleGetCaptcha = async () => {
  const now = Date.now()
  if (now - lastRefreshTime.value < COOLDOWN_TIME) {
    showToast('操作过于频繁', '请稍后再试', 'destructive')
    return
  }

  if (!isEmailValid.value || loading.value) {
    showToast('无法获取验证码', '请确保邮箱格式正确', 'destructive')
    return
  }

  lastRefreshTime.value = now
  
  try {
    const base64Image = await genImgVerification(form.values.email)
    if (base64Image) {
      imgVerificationCode.value = base64Image
      form.setFieldValue('img_verification_code', '')
    } else {
      throw new Error('获取验证码失败')
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
    imgVerificationCode.value = ''
    showToast(
      '获取验证码失败',
      error instanceof Error ? error.message : '请稍后重试',
      'destructive'
    )
  }
}

const showToast = (
  title: string, 
  description: string, 
  variant: 'default' | 'destructive' = 'default'
) => {
  toast({ title, description, variant })
}

const resetForm = () => {
  form.resetForm()
  imgVerificationCode.value = ''
}

const handleEmailInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  form.setFieldValue('email', value)
  if (!isEmailValid.value) {
    imgVerificationCode.value = ''
  }
}

const onSubmit = async (values: LoginRequest) => {
  console.log('Form submitted:', values)
  if (loading.value || !isFormValid.value) {
    console.log('Form submission prevented:', { loading: loading.value, isFormValid: isFormValid.value })
    return
  }

  try {
    loading.value = true
    const loginData: LoginRequest = {
      email: values.email,
      password: values.password,
      imgVerificationCode: values.img_verification_code as string,
      remember: values.remember ?? false,
    }

    await login(loginData)
    await fetchProfile()
    showToast('登录成功', '欢迎回来！')
    emit('success')
  } catch (error) {
    console.error('登录失败:', error)
    await handleGetCaptcha()
    showToast(
      '登录失败', 
      error instanceof Error ? error.message : '未知错误',
      'destructive'
    )
  } finally {
    loading.value = false
  }
}

// Add a watcher to log form values and validity
watch(() => form.values, (newValues) => {
  console.log('Form values changed:', newValues)
  console.log('Form errors:', form.errors)
  console.log('Is form valid?', isFormValid.value)
}, { deep: true })

defineExpose({ resetForm })
</script>