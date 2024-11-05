import { ref, onMounted, onUnmounted } from 'vue'

export default function useBackgroundAnimation() {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let animationFrameId: number
  
  const initCanvas = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 设置canvas尺寸
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)
    
    // 粒子系统
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
    }> = []
    
    // 创建粒子
    const createParticles = () => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1
        })
      }
    }
    
    createParticles()
    
    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        // 更新位置
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // 边界检查
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
        
        // 绘制粒子
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(100, 100, 255, 0.1)'
        ctx.fill()
      })
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }
  
  onMounted(() => {
    const cleanup = initCanvas()
    if (cleanup) {
      onUnmounted(cleanup)
    }
  })
  
  return {
    canvasRef
  }
}
