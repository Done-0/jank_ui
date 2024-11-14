// composables/usePost.ts
import { usePostStore } from '~/store/post';
import { storeToRefs } from 'pinia';

export function usePost() {
    const store = usePostStore();
    const { post, loading, posts, error } = storeToRefs(store); 

    return {
        post,
        posts,
        loading,
        error,
    };
}