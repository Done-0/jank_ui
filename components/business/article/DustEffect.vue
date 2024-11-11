interface ParticleOptions {
  x: number
  y: number
  width: number
  height: number
}

export const createDustParticles = (options: ParticleOptions) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Setup canvas
  canvas.width = options.width + 100
  canvas.height = options.height + 100
  Object.assign(canvas.style, {
    position: 'fixed',
    left: `${options.x - 50}px`,
    top: `${options.y - 50}px`,
    pointerEvents: 'none',
    zIndex: '9999'
  })

  document.body.appendChild(canvas)

  // Particle system
  const particles = Array.from({ length: 60 }, () => ({
    x: options.width * Math.random(),
    y: options.height * Math.random(),
    size: 1 + Math.random() * 2,
    speedX: (Math.random() - 0.5) * 3,
    speedY: (Math.random() - 0.5) * 3,
    life: 1
  }))

  // Animation
  let frame: number
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    let isAlive = false
    particles.forEach(p => {
      if (p.life <= 0) return
      
      isAlive = true
      p.x += p.speedX
      p.y += p.speedY
      p.life -= 0.02
      
      ctx.beginPath()
      ctx.fillStyle = `rgba(200, 200, 200, ${p.life})`
      ctx.arc(p.x + 50, p.y + 50, p.size, 0, Math.PI * 2)
      ctx.fill()
    })

    if (!isAlive) {
      cancelAnimationFrame(frame)
      canvas.remove()
      return
    }

    frame = requestAnimationFrame(animate)
  }

  animate()
}
