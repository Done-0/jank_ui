// store/post.ts
import { defineStore } from 'pinia';
import { usePostApi } from '~/api/modules/post';
import type { Post, CreatePostRequest, GetPostRequest, DeletePostRequest, UpdatePostRequest } from '~/types/post';
import { STORAGE_KEYS } from '~/types/post';

/**
 * Pinia Store 用于管理文章状态
 */
export const usePostStore = defineStore('post', {
  state: () => ({
    post: null as Post | null,
    posts: [] as Post[],
    loading: true,
    error: null as string | null,
  }),
  actions: {
    // 设置加载状态
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    // 设置错误信息
    setError(error: string | null) {
      this.error = error;
    },
    // 清除错误信息
    clearError() {
      this.error = null;
    },
    // 创建文章
    async createPost(form: CreatePostRequest) {
      this.setLoading(true);
      this.clearError();
      try {
        const { data } = await usePostApi().createPost(form);
        if (data) {
          this.post = data; // 存储新创建的文章
        }
      } catch (e) {
        this.setError('Failed to create post.');
        console.error(e);
      } finally {
        this.setLoading(false);
      }
    },
    // 获取单篇文章
    async getPost(form: GetPostRequest) {
      this.setLoading(true);
      this.clearError();
      try {
        const { data } = await usePostApi().getPost(form);
        if (data) {
          this.post = data; // 存储获取到的单篇文章
        }
      } catch (e) {
        this.setError('Failed to fetch the post.');
        console.error(e);
      } finally {
        this.setLoading(false);
      }
    },
    // 获取所有文章
    async getAllPosts() {
      this.setLoading(true);
      this.clearError();
      try {
        const { data } = await usePostApi().getAllPosts();
        if (data) {
          this.posts = data; // 存储所有文章
          localStorage.setItem(STORAGE_KEYS.POST, JSON.stringify(data)); // 缓存到 localStorage
        }
      } catch (e) {
        this.setError('Failed to fetch all posts.');
        console.error(e);
      } finally {
        this.setLoading(false);
      }
    },
    // 删除文章
    async deletePost(form: DeletePostRequest) {
      this.setLoading(true);
      this.clearError();
      try {
        const { data } = await usePostApi().deletePost(form);
        if (data) {
          // 从列表中删除已删除的文章
          this.posts = this.posts.filter(post => post.id);
        }
      } catch (e) {
        this.setError('Failed to delete the post.');
        console.error(e);
      } finally {
        this.setLoading(false);
      }
    },
    // 更新文章
    async updatePost(form: UpdatePostRequest) {
      this.setLoading(true);
      this.clearError();
      try {
        const { data } = await usePostApi().updatePost(form);
        if (data) {
          // 更新文章列表中的对应文章
          this.posts = this.posts.map(post => 
            post.id === data.id ? data : post
          );
        }
      } catch (e) {
        this.setError('Failed to update the post.');
        console.error(e);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
