// api/modules/post.ts
import { useHttp } from '~/api/http/http'; 
import { API_ROUTES } from '~/api/route';
import type { Post, CreatePostRequest, GetPostRequest, DeletePostRequest, UpdatePostRequest } from '~/types/post';
import type { ApiResponse } from '~/api/types';

/**
 * 文章相关 API 模块
 */
export const usePostApi = () => {
    const http = useHttp(); // 获取 HTTP 请求实例

    // 返回 API 请求方法
    return {
        /**
         * 创建文章
         * @param data 创建文章的请求数据
         * @returns API 响应，包含新创建的文章数据
         */
        createPost(data: CreatePostRequest): Promise<ApiResponse<Post>> {
            return http.post(API_ROUTES.POST.CREATE_ONE_POST, data);
        },

        /**
         * 获取单篇文章
         * @param data 请求参数，通常是文章 ID
         * @returns API 响应，包含文章数据
         */
        getPost(data: GetPostRequest): Promise<ApiResponse<Post>> {
            return http.post(API_ROUTES.POST.GET_ONE_POST, data);
        },

        /**
         * 获取所有文章
         * @returns API 响应，包含所有文章的列表
         */
        getAllPosts(): Promise<ApiResponse<Post[]>> {
            return http.get(API_ROUTES.POST.GET_ALL_POSTS);
        },

        /**
         * 更新文章
         * @param data 更新文章的请求数据
         * @returns API 响应，包含更新后的文章数据
         */
        updatePost(data: UpdatePostRequest): Promise<ApiResponse<Post>> {
            return http.post(API_ROUTES.POST.UPDATE_ONE_POST, data);
        },

        /**
         * 删除文章
         * @param data 删除文章的请求数据
         * @returns API 响应，成功时返回空数据
         */
        deletePost(data: DeletePostRequest): Promise<ApiResponse<void>> {
            return http.post(API_ROUTES.POST.DELETE_ONE_POST, data);
        },
    };
};
