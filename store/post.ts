// store/post.ts
import { postApi } from '~/api/modules/post';
import type { 
    Post,
    CreatePostRequest, 
    GetPostRequest, 
    DeletePostRequest, 
    UpdatePostRequest,  
} from '~/types/post';
import { STORAGE_KEYS } from '~/types/post';

export const usePostStore = defineStore('post', {
    state: () => ({
        post: null as Post | null,
        posts: [] as Post[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        setError(error: string | null) {
            this.error = error; // 设置错误信息
        },
        clearError() {
            this.error = null; // 清除错误信息
        },

        async createPost(form: CreatePostRequest) {
            this.loading = true; // 开始加载
            try {
                const response = await postApi.createPost(form);
                if (response.data) {
                    const post = response.data as Post; // 将响应数据转换为Post类型
                    this.post = post; // 设置当前文章
                }
            } finally {
                this.loading = false; // 结束加载
            }
        },

        async getPost(form: GetPostRequest) {
            this.loading = true; // 开始加载
            try {
                const response = await postApi.getPost(form);
                if (response.data) {
                    const post = response.data as Post; // 将响应数据转换为Post类型
                    this.post = post; // 设置当前文章
                }
            } finally {
                this.loading = false; // 结束加载
            }
        },

        async getAllPosts() {
            this.loading = true; // 开始加载
            try {
                const response = await postApi.getAllPosts();
                if (response.data) {
                    this.posts = response.data as Post[]; // 将响应数据转换为Post数组
                    localStorage.setItem(STORAGE_KEYS.POST, JSON.stringify(this.posts)); // 存储文章信息
                }
            } finally {
                this.loading = false; // 结束加载
            }
        },

        async deletePost(form: DeletePostRequest) {
            this.loading = true; // 开始加载
            try {
                const response = await postApi.deletePost(form);
                if (response.data) {
                    const post = response.data as Post; // 将响应数据转换为Post类型
                    this.post = post; // 设置当前文章
                }
            } finally {
                this.loading = false; // 结束加载
            }
        },

        async updatePost(form: UpdatePostRequest) {
            this.loading = true; // 开始加载
            try {
                const response = await postApi.updatePost(form);
                if (response.data) {
                    const post = response.data as Post; // 将响应数据转换为Post类型
                    this.post = post; // 设置当前文章
                }
            } finally {
                this.loading = false; // 结束加载
            }
        },
    },
});