<template>
  <div class="space-y-6">
    <DialogHeader>
      <DialogTitle>登录账号</DialogTitle>
      <DialogDescription>
        输入您的邮箱和密码登录
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
              <Input v-model="field.value" type="password" placeholder="请输入密码" autocomplete="current-password"
                @blur="field.onBlur" />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="remember">
          <FormItem class="flex items-center space-x-2">
            <FormControl>
              <Checkbox v-model="field.value" />
            </FormControl>
            <div class="leading-none">
              <FormLabel class="text-sm font-normal">记住我</FormLabel>
            </div>
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full">登录</Button>
      </form>
    </Form>

    <div class="text-center text-sm">
      <a href="#" class="text-primary hover:underline" @click.prevent="switchToRegister">
        还没有账号？立即注册
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
import { useAuthStore } from '~/store/auth/auth'

const emit = defineEmits<{
  (e: 'success' | 'switch-to-register'): void
}>()

const formSchema = toTypedSchema(z.object({
  email: z.string().min(1, '邮箱是必填项').email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符').max(20, '密码最多20个字符'),
  remember: z.boolean().default(false),
}))

const initialValues = {
  email: '',
  password: '',
  remember: false,
}

const form = useForm({
  validationSchema: formSchema,
  initialValues,
})

const authStore = useAuthStore()

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await authStore.login(values)
    toast({
      title: '登录成功',
      description: '欢迎回来！',
    })
    emit('success')
  } catch (error) {
    toast({
      title: '登录失败',
      description: error instanceof Error ? error.message : '未知错误',
      variant: 'destructive',
    })
  }
})

const switchToRegister = () => {
  emit('switch-to-register')
}
</script>
