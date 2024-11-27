<template>
  <div class="space-y-6">
    <DialogHeader>
      <DialogTitle>注册账号</DialogTitle>
      <DialogDescription>
        输入您的信息以创建新账号
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
                autocomplete="new-password"
                :disabled="!!loading"
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
                v-bind="field"
                type="password"
                placeholder="请再次输入密码"
                autocomplete="new-password"
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

        <FormField v-slot="{ field, errors }" name="email_verification_code">
          <FormItem>
            <FormLabel>邮箱验证码</FormLabel>
            <div class="flex space-x-2">
              <FormControl>
                <Input 
                  v-bind="field"
                  placeholder="请输入邮箱验证码"
                  class="flex-1" 
                  maxlength="6"
                  :disabled="!!loading"
                />
              </FormControl>
              <Button 
                type="button" 
                class="h-10 w-32"
                variant="outline"
                :disabled="!isEmailValid || loading || countdown > 0"
                @click="handleSendEmailCode"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
              </Button>
            </div>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="agreeToTerms">
          <FormItem class="flex items-center space-x-2">
            <FormControl>
              <Checkbox 
                v-bind="field"
                :disabled="!!loading"
                class="mt-2"
              />
            </FormControl>
            <div class="leading-none">
              <FormLabel class="text-sm font-normal">
                我同意
                <a href="#" class="text-primary hover:underline">条款和条件</a>
              </FormLabel>
            </div>
          </FormItem>
        </FormField>

        <Button 
          type="submit" 
          class="w-full"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? '注册中...' : '注册' }}
        </Button>
      </form>
    </Form>

    <div class="text-center text-sm">
      <a 
        href="#" 
        class="text-primary hover:underline" 
        :class="{ 'pointer-events-none opacity-50': loading }"
        @click.prevent="emit('switch-to-login')"
      >
        已有账号？立即登录
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
import type { RegisterRequest } from '~/types/auth'

const auth = useAuth()
const { loading, register, fetchProfile, genImgVerification, sendEmailVerificationCode } = auth

const zodSchema = z.object({
  email: z.string().min(1, '邮箱是必填项').email('请输入有效的邮箱'),
  password: z.string().min(6, '密码至少6个字符').max(20, '密码最多20个字符'),
  confirmPassword: z.string().min(6, '密码至少6个字符').max(20, '密码最多20个字符'),
  img_verification_code: z.string().length(4, '验证码必须是4位'),
  email_verification_code: z.string().length(6, '邮箱验证码必须是6位'),
  agreeToTerms: z.boolean().refine(val => val, '请同意条款和条件'),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: '两次输入的密码不一致',
    })
  }
})

const formSchema = toTypedSchema(zodSchema)

const emit = defineEmits<{
  (e: 'success' | 'switch-to-login'): void
}>()

const imgVerificationCode = ref<string>('')
const countdown = ref(0)
const COOLDOWN_TIME = 1000
const lastRefreshTime = ref(0)

const form = useForm<RegisterRequest>({
  validationSchema: formSchema,
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
    img_verification_code: '',
    email_verification_code: '',
    agreeToTerms: false,
  },
})

const isFormValid = computed(() => {
  const { email, password, confirmPassword, img_verification_code, email_verification_code, agreeToTerms } = form.values
  const isValid = email && password && confirmPassword && 
         img_verification_code && email_verification_code && agreeToTerms &&
         isEmailValid.value &&
         password.length >= 6 &&
         password === confirmPassword &&
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

const handleSendEmailCode = async () => {
  if (!isEmailValid.value || loading.value || countdown.value > 0) return

  try {
    await sendEmailVerificationCode(form.values.email)
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    showToast('验证码已发送', '请查看您的邮箱')
  } catch (error) {
    showToast('发送失败', error instanceof Error ? error.message : '请稍后再试', 'destructive')
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

const onSubmit = async (values: RegisterRequest) => {
  console.log('Form submitted:', values)
  if (loading.value || !isFormValid.value) {
    console.log('Form submission prevented:', { loading: loading.value, isFormValid: isFormValid.value })
    return
  }

  try {
    loading.value = true
    const registerData: RegisterRequest = {
      nickname: values.nickname || '',
      email: values.email,
      password: values.password,
      imgVerificationCode: values.img_verification_code as string,
      emailVerificationCode: values.email_verification_code as string,
      agreeToTerms: values.agreeToTerms,
    }

    await register(registerData)
    await fetchProfile()
    showToast('注册成功', '欢迎加入！')
    emit('success')
  } catch (error) {
    console.error('注册失败:', error)
    await handleGetCaptcha()
    showToast(
      '注册失败', 
      error instanceof Error ? error.message : '未知错误',
      'destructive'
    )
  } finally {
    loading.value = false
  }
}

watch(() => form.values, (newValues) => {
  console.log('Form values changed:', newValues)
  console.log('Form errors:', form.errors)
  console.log('Is form valid?', isFormValid.value)
}, { deep: true })

defineExpose({ resetForm })
</script>
