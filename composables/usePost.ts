// composables/usePost.ts
import { usePostStore } from '~/store/post';
import { storeToRefs } from 'pinia';

export function usePost() {
    const store = usePostStore();
    const { post, posts, loading, error } = storeToRefs(store);

    return {
        post,
        posts, 
        loading, 
        error,
        createPost: store.createPost,
        getPost: store.getPost,
        getAllPosts: store.getAllPosts,
        deletePost: store.deletePost,
        updatePost: store.updatePost,
    };
}
