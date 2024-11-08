import { ref, onMounted, onUnmounted } from 'vue'

export default function UseFooterVisibility() {
  const showFooter = ref(true)
  let lastScrollY = 0

  const handleScroll = () => {
    const currentScrollY = window.scrollY
    showFooter.value = currentScrollY <= lastScrollY
    lastScrollY = currentScrollY
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    showFooter
  }
}
