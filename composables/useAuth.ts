// composables/useAuth.ts
import { useAuthStore } from '~/store/auth';
import { storeToRefs } from 'pinia';

export function useAuth() {
    const store = useAuthStore();
    const { user, loading } = storeToRefs(store);

    return {
        user,
        loading,
        initializeFromStorage: store.initializeFromStorage,  
        login: store.login,
        register: store.register,
        logout: store.logout,
        fetchProfile: store.fetchProfile,
        sendEmailVerificationCode: store.sendEmailVerificationCode,
        genImgVerification: store.genImgVerification,
    };
}
