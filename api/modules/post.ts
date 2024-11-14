import { useHttp } from '~/api/http';
import { API_ROUTES } from '~/api/route';
import type {
    Post,
    CreatePostRequest,
    GetPostRequest,
    DeletePostRequest,
    UpdatePostRequest,
} from '~/types/post';
import type { ApiResponse } from '../types';

/**
 * 文章相关 API 模块
 */
export const usePostApi = () => {
    const http = useHttp();
    
    return {
        /**
         * 创建文章
         */
        createPost(data: CreatePostRequest): Promise<ApiResponse<Post>> {
            return http.post(API_ROUTES.POST.CREATE_ONE_POST, data);
        },
      
        /**
         * 获取单篇文章
         */
        getPost(data: GetPostRequest): Promise<ApiResponse<Post>> {
            return http.post(API_ROUTES.POST.GET_ONE_POST, data);
        },
      
        /**
         * 获取所有文章
         */
        getAllPosts(): Promise<ApiResponse<Post[]>> {
            return http.get(API_ROUTES.POST.GET_ALL_POSTS);
        },
      
        /**
         * 更新文章
         */
        updatePost(data: UpdatePostRequest): Promise<ApiResponse<Post>> {
            return http.post(API_ROUTES.POST.UPDATE_ONE_POST, data);
        },
        
        /**
         * 删除文章
         */
        deletePost(data: DeletePostRequest): Promise<ApiResponse<void>> {
            return http.post(API_ROUTES.POST.DELETE_ONE_POST, data);
        },
    };
};
