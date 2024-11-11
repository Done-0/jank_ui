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
              <Input v-model="field.value" type="email" placeholder="请输入邮箱" autocomplete="email" @blur="field.onBlur" />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, errors }" name="password">
          <FormItem>
            <FormLabel>密码</FormLabel>
            <FormControl>
              <Input
                v-model="field.value" type="password" placeholder="请输入密码" autocomplete="new-password"
                @blur="field.onBlur" />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, errors }" name="confirmPassword">
          <FormItem>
            <FormLabel>确认密码</FormLabel>
            <FormControl>
              <Input
                v-model="field.value" type="password" placeholder="请再次输入密码" autocomplete="new-password"
                @blur="field.onBlur" />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="agreeToTerms">
          <FormItem class="flex items-center space-x-2">
            <FormControl>
              <Checkbox v-model="field.value" />
            </FormControl>
            <div class="leading-none">
              <FormLabel class="text-sm font-normal">我同意条款和条件</FormLabel>
            </div>
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full">注册</Button>
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

const emit = defineEmits<{
  (e: 'success' | 'switch-to-login'): void
}>()

const formSchema = toTypedSchema(
  z
    .object({
      email: z
        .string()
        .min(1, '邮箱是必填项')
        .email('请输入有效的邮箱地址'),
      password: z
        .string()
        .min(6, '密码至少6个字符')
        .max(20, '密码最多20个字符'),
      confirmPassword: z
        .string()
        .min(6, '密码至少6个字符')
        .max(20, '密码最多20个字符'),
      agreeToTerms: z.boolean().refine(val => val === true, '必须同意条款'),
    })
    .superRefine((data, ctx) => {
      if (data.confirmPassword !== data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: '密码不匹配',
        })
      }
    })
)

const initialValues = {
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
}

const form = useForm({
  validationSchema: formSchema,
  initialValues,
})

const authStore = useAuthStore()

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await authStore.register(values)
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
</script>

