import { defineStore } from 'pinia';
import { usePostApi } from '~/api/modules/post';
import type { Post, CreatePostRequest, GetPostRequest, DeletePostRequest, UpdatePostRequest } from '~/types/post';
import { STORAGE_KEYS } from '~/types/post';

export const usePostStore = defineStore('post', {
  state: () => ({
    post: null as Post | null,
    posts: [] as Post[],
    loading: true as boolean,
    error: null as string | null,
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setError(error: string | null) {
      this.error = error;
    },
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
          this.post = data;
        }
      } catch (e) {
        this.setError('Failed to create post:' + e);
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
          this.post = data;
        }
      } catch (e) {
        this.setError('Failed to fetch the post:' + e);
      } finally {
        this.setLoading(false);
      }
    },
    // 获取所有文章
    async getAllPosts() {
      this.setLoading(true);
      this.clearError();
      try {
        const response = await usePostApi().getAllPosts();
        const data = response?.data?.data;
        if (Array.isArray(data)) {
          this.posts = data;
          console.log(data)
          localStorage.setItem(STORAGE_KEYS.POST, JSON.stringify(data));
        } else {
          this.setError('Invalid data format');
        }
      } catch (e) {
        this.setError('Failed to fetch all posts:' + e);
      } finally {
        this.setLoading(false);
      }
    },
    // 删除文章
    async deletePost(form: DeletePostRequest) {
      this.setLoading(true);
      this.clearError();

      const previousPosts = [...this.posts];
      this.posts = this.posts.filter(post => post.id !== form.id);

      try {
        await usePostApi().deletePost(form);
      } catch (e) {
        this.posts = previousPosts;
        this.setError('Failed to delete the post:' + e);
      } finally {
        this.setLoading(false);
      }
    },
    // 更新文章
    async updatePost(form: UpdatePostRequest) {
      this.setLoading(true);
      this.clearError();
      
      const previousPosts = [...this.posts];
      
      this.posts = this.posts.map(post => 
          post.id === form.id ? { ...post, ...form } : post
      );

      try {
        const { data } = await usePostApi().updatePost(form);
        if (data) {
          this.posts = this.posts.map(post => 
              post.id === data.id ? data : post
          );
        }
      } catch (e) {
        this.posts = previousPosts;
        this.setError('Failed to update the post:' + e);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
