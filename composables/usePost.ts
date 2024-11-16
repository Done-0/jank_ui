// composables/usePost.ts
import { usePostStore } from '~/store/post';
import { storeToRefs } from 'pinia';

export function usePost() {
    const store = usePostStore();
    const { post, posts, loading, error } = storeToRefs(store);

    const handleError = (e: unknown, message: string) => {
        console.error(message, e);
        store.setError(message);
    };

    const refreshPosts = async () => {
        try {
            await store.getAllPosts();
        } catch (e) {
            handleError(e, 'Error refreshing posts');
        }
    };

    return {
        post,
        posts, 
        loading, 
        error, 
        refreshPosts,
    };
}
