import { ref } from 'vue'

export default function UseAuth() {
  const isLoggedIn = ref(false)
  const userProfileImage = ref('')

  const login = () => {
    // 模拟登录
    isLoggedIn.value = true
    userProfileImage.value = ''
  }

  const logout = () => {
    isLoggedIn.value = false
    userProfileImage.value = ''
  }

  return {
    isLoggedIn,
    userProfileImage,
    login,
    logout
  }
}
