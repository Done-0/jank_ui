// composables/usePost.ts
import { usePostStore } from '~/store/post';
import { storeToRefs } from 'pinia';

/**
 * 自定义 hook，用于访问文章的 store 数据
 */
export function usePost() {
    const store = usePostStore();
    const { post, posts, loading, error } = storeToRefs(store); 

    /**
     * 刷新所有文章
     */
    const refreshPosts = async () => {
        try {
            await store.getAllPosts();
        } catch (e) {
            console.error('Error refreshing posts', e);
        }
    };

    return {
        post,         // 当前文章
        posts,        // 所有文章列表
        loading,      // 加载状态
        error,        // 错误信息
        refreshPosts, // 刷新文章列表
    };
}
