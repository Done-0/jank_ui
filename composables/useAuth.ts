// composables/useAuth.ts
import { useAuthStore } from '~/store/auth';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

export function useAuth() {
  const store = useAuthStore();
  const { user, loading, isLoggedIn } = storeToRefs(store);

  const hasLogined = computed(() => isLoggedIn.value); 

  return {
    user,
    loading,
    isLoggedIn,
    hasLogined,
    login: store.login,
    logout: store.logout,
    register: store.register,
    fetchProfile: store.fetchProfile
  };
}