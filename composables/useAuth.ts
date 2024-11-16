// composables/useAuth.ts
import { useAuthStore } from '~/store/auth';
import { storeToRefs } from 'pinia';

export function useAuth() {
    const store = useAuthStore();
    const { user, loading, isLoggedIn } = storeToRefs(store);

    return {
        user,
        loading,
        isLoggedIn,
        login: store.login.bind(store),
        logout: store.logout.bind(store),
        register: store.register.bind(store),
        fetchProfile: store.fetchProfile.bind(store),
    };
}
