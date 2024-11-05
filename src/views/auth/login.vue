<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
import * as z from 'zod'

import type { LoginRequest } from '@/types/auth'

// 定义表单验证schema
const formSchema = toTypedSchema(z.object({
  email: z.string().min(1, '邮箱是必填项').email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符').max(20, '密码最多20个字符'),
  remember: z.boolean().default(false),
}))

const initialValues: LoginRequest = {
  email: '',
  password: '',
  remember: false,
}

// 使用 useForm hook
const form = useForm<LoginRequest>({
  validationSchema: formSchema,
  initialValues,
})

// 提交处理
const onSubmit = form.handleSubmit(async (values: LoginRequest) => {
  try {
    // 登录API调用逻辑
    toast({
      title: '提交的表单数据:',
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
        h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
    })
  } catch (error) {
    toast({
      title: '登录失败',
      description: error instanceof Error ? error.message : '未知错误',
      variant: 'destructive',
    })
  }
})
</script>

<template>
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
    <div class="space-y-2 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">登录账号</h1>
      <p class="text-sm text-muted-foreground">输入您的邮箱和密码登录</p>
    </div>

    <Form :form="form">
      <form class="space-y-4" @submit="onSubmit">
        <FormField v-slot="{ field, errors }" name="email">
          <FormItem>
            <FormLabel>邮箱</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="请输入邮箱" 
                v-model="field.value"
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
                type="password" 
                placeholder="请输入密码" 
                v-model="field.value"
                @blur="field.onBlur"
              />
            </FormControl>
            <FormMessage>{{ errors[0] }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="remember">
          <FormItem class="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                v-model="field.value"
              />
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
      <router-link :to="{ name: 'Register' }" class="text-primary hover:underline">还没有账号？立即注册</router-link>
    </div>
  </div>
</template>
