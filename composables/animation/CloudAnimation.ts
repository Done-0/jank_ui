interface CloudDrop {
  x: number;
  y: number;
  radius: number;
  color: string;
  dx: number;
  dy: number;
  alpha: number;
  targetAlpha: number;
  rotationSpeed: number;
  rotation: number;
  points: number[];
  life: number;
  maxLife: number;
  scale: number;
  targetScale: number;
  targetRadius: number;
  lastUpdate: number;
}

interface CloudAnimation {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  drops: CloudDrop[];
  animationId: number;
}

const CLOUD_CONFIG = {
  colors: [
    'rgba(45, 45, 45, 0.12)', 
    'rgba(60, 60, 60, 0.10)',
    'rgba(75, 75, 75, 0.08)',
  ],
  lightColors: [
    'rgba(245, 245, 245, 0.15)',
    'rgba(230, 230, 230, 0.12)',
    'rgba(215, 215, 215, 0.10)',
  ],
  dropCount: 8,
  minRadius: 100,
  maxRadius: 200,
  minSpeed: 0.002,
  maxSpeed: 0.005,
  transitionSpeed: 0.001,
  rotationSpeed: 0.00004,
  newDropInterval: 15000,
  fadeSpeed: 0.002,
  dropLifespan: 50000,
  pointCount: 26,
  elasticity: 0.99,
  scaleRange: { min: 0.95, max: 1.05 },
  scaleSpeed: 0.001,
  updateInterval: 1000 / 60,
} as const;

const performanceUtils = {
  dropPool: new Set<CloudDrop>(),
  
  getCloudDrop(canvas: HTMLCanvasElement): CloudDrop {
    const drop = this.dropPool.values().next().value || createCloudDrop(canvas);
    this.dropPool.delete(drop);
    return drop;
  },

  recycleCloudDrop(drop: CloudDrop) {
    this.dropPool.add(drop);
  }
};

function createCloudDrop(canvas: HTMLCanvasElement): CloudDrop {
  const isLight = Math.random() > 0.5;
  const colors = isLight ? CLOUD_CONFIG.lightColors : CLOUD_CONFIG.colors;
  const maxLife = CLOUD_CONFIG.dropLifespan + Math.random() * 5000;
  const scale = CLOUD_CONFIG.scaleRange.min + Math.random() * (CLOUD_CONFIG.scaleRange.max - CLOUD_CONFIG.scaleRange.min);
  
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: CLOUD_CONFIG.minRadius + Math.random() * (CLOUD_CONFIG.maxRadius - CLOUD_CONFIG.minRadius),
    targetRadius: CLOUD_CONFIG.minRadius + Math.random() * (CLOUD_CONFIG.maxRadius - CLOUD_CONFIG.minRadius),
    color: colors[Math.floor(Math.random() * colors.length)],
    dx: (Math.random() - 0.5) * CLOUD_CONFIG.maxSpeed,
    dy: (Math.random() - 0.5) * CLOUD_CONFIG.maxSpeed * 0.3,
    alpha: 0,
    targetAlpha: 0.1 + Math.random() * 0.15,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * CLOUD_CONFIG.rotationSpeed,
    points: Array.from({ length: CLOUD_CONFIG.pointCount }, () => 0.95 + Math.random() * 0.1),
    life: 0,
    maxLife,
    scale,
    targetScale: scale,
    lastUpdate: performance.now(),
  };
}

function drawCloudDrop(ctx: CanvasRenderingContext2D, drop: CloudDrop): void {
  const margin = drop.radius * 2;
  if (
    drop.x + margin < 0 ||
    drop.x - margin > ctx.canvas.width ||
    drop.y + margin < 0 ||
    drop.y - margin > ctx.canvas.height
  ) {
    return;
  }

  ctx.save();
  ctx.translate(drop.x, drop.y);
  ctx.rotate(drop.rotation);
  ctx.scale(drop.scale, drop.scale * 0.7);

  ctx.beginPath();
  const points = drop.points.length;
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const nextAngle = ((i + 1) % points / points) * Math.PI * 2;
    const radius = drop.radius * drop.points[i];
    const nextRadius = drop.radius * drop.points[(i + 1) % points];
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const nextX = Math.cos(nextAngle) * nextRadius;
    const nextY = Math.sin(nextAngle) * nextRadius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    }
    
    const cp1x = x + Math.cos(angle + Math.PI / 2) * radius * 0.6;
    const cp1y = y + Math.sin(angle + Math.PI / 2) * radius * 0.6;
    const cp2x = nextX - Math.cos(nextAngle + Math.PI / 2) * nextRadius * 0.6;
    const cp2y = nextY - Math.sin(nextAngle + Math.PI / 2) * nextRadius * 0.6;
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextX, nextY);
  }
  
  ctx.closePath();
  
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, drop.radius * 1.2);
  const baseColor = drop.color.slice(0, -4);
  gradient.addColorStop(0, `${baseColor}${drop.alpha * 1.5})`);
  gradient.addColorStop(0.4, `${baseColor}${drop.alpha * 1.2})`);
  gradient.addColorStop(0.7, `${baseColor}${drop.alpha * 0.8})`);
  gradient.addColorStop(1, `${baseColor}0)`);

  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function updateCloudDrop(drop: CloudDrop, canvas: HTMLCanvasElement): void {
  const now = performance.now();
  const deltaTime = now - drop.lastUpdate;

  if (deltaTime < CLOUD_CONFIG.updateInterval) {
    return;
  }

  drop.lastUpdate = now;
  drop.life += deltaTime;
  const lifeProgress = drop.life / drop.maxLife;

  const fadeInOut = (x: number): number => {
    if (x < 0.2) return (Math.sin((x / 0.2 - 0.5) * Math.PI) + 1) / 2;
    if (x > 0.8) return (Math.sin(((1 - x) / 0.2 - 0.5) * Math.PI) + 1) / 2;
    return 1;
  };

  drop.alpha = drop.targetAlpha * fadeInOut(lifeProgress);

  const easeInOut = (t: number): number => {
    const t2 = t < 0.5 ? t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return t2 * t2;
  };

  const transitionEase = easeInOut(1 - lifeProgress);
  drop.radius += (drop.targetRadius - drop.radius) * CLOUD_CONFIG.transitionSpeed * transitionEase;
  drop.scale += (drop.targetScale - drop.scale) * CLOUD_CONFIG.scaleSpeed * transitionEase;

  const moveSpeed = 1 - easeInOut(lifeProgress * 0.3);
  const randomFactor = 0.00008;
  drop.dx = drop.dx * CLOUD_CONFIG.elasticity + (Math.random() - 0.5) * randomFactor;
  drop.dy = drop.dy * CLOUD_CONFIG.elasticity + (Math.random() - 0.5) * randomFactor;

  drop.x += drop.dx * moveSpeed * deltaTime;
  drop.y += drop.dy * moveSpeed * deltaTime;
  drop.rotation += drop.rotationSpeed * moveSpeed * deltaTime;

  const margin = drop.radius * 2;
  if (drop.x < -margin || drop.x > canvas.width + margin ||
      drop.y < -margin || drop.y > canvas.height + margin) {
    drop.alpha *= 0.5;
    if (drop.x < -margin) drop.x = canvas.width + margin;
    if (drop.x > canvas.width + margin) drop.x = -margin;
    if (drop.y < -margin) drop.y = canvas.height + margin;
    if (drop.y > canvas.height + margin) drop.y = -margin;
  }
}

function animate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, drops: CloudDrop[]): number {
  let lastFrameTime = performance.now();
  
  function loop(currentTime: number) {
    const deltaTime = currentTime - lastFrameTime;
    
    if (deltaTime >= CLOUD_CONFIG.updateInterval) {
      lastFrameTime = currentTime;
      
      // 使用普通 canvas 代替 OffscreenCanvas
      const bufferCanvas = document.createElement('canvas');
      bufferCanvas.width = canvas.width;
      bufferCanvas.height = canvas.height;
      const bufferCtx = bufferCanvas.getContext('2d')!;
      
      bufferCtx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = drops.length - 1; i >= 0; i--) {
        const drop = drops[i];
        updateCloudDrop(drop, canvas);
        drawCloudDrop(bufferCtx, drop);
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bufferCanvas, 0, 0);
    }
    
    return requestAnimationFrame(loop);
  }
  
  return requestAnimationFrame(loop);
}

export default function UseCloudAnimation(containerRef: Ref<HTMLDivElement | null>) {
  const animations = ref<CloudAnimation[]>([]);
  const cleanupFunctions = ref<(() => void)[]>([]);

  function createCloudAnimation(container: HTMLElement) {
    try {
      const canvas = document.createElement('canvas');
      canvas.style.willChange = 'transform';
      const ctx = canvas.getContext('2d', { alpha: true });

      if (!ctx) {
        console.error('Canvas context not supported');
        return;
      }

      const setCanvasSize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
      };

      setCanvasSize();
      container.appendChild(canvas);

      const resizeObserver = new ResizeObserver(setCanvasSize);
      resizeObserver.observe(container);

      const drops: CloudDrop[] = [];
      const createDrops = (deadline: IdleDeadline) => {
        while (drops.length < CLOUD_CONFIG.dropCount && deadline.timeRemaining() > 0) {
          drops.push(performanceUtils.getCloudDrop(canvas));
        }
        if (drops.length < CLOUD_CONFIG.dropCount) {
          requestIdleCallback(createDrops);
        }
      };
      requestIdleCallback(createDrops);

      const animationId = animate(ctx, canvas, drops);

      const intervalId = setInterval(() => {
        const oldestDropIndex = drops.reduce((maxIndex, drop, index, arr) =>
          drop.life > arr[maxIndex].life ? index : maxIndex, 0);
        performanceUtils.recycleCloudDrop(drops[oldestDropIndex]);
        drops[oldestDropIndex] = performanceUtils.getCloudDrop(canvas);
      }, CLOUD_CONFIG.newDropInterval);

      const animation: CloudAnimation = { 
        canvas, 
        ctx, 
        drops, 
        animationId 
      };

      animations.value.push(animation);

      return () => {
        cancelAnimationFrame(animationId);
        clearInterval(intervalId);
        resizeObserver.disconnect();
        container.removeChild(canvas);
        drops.forEach(drop => performanceUtils.recycleCloudDrop(drop));
      };
    } catch (error) {
      console.error('Error creating cloud animation:', error);
      return undefined;
    }
  }

  onMounted(() => {
    if (containerRef.value) {
      const cleanup = createCloudAnimation(containerRef.value);
      if (cleanup) {
        cleanupFunctions.value.push(cleanup);
      }
    }
  });

  onUnmounted(() => {
    cleanupFunctions.value.forEach(cleanup => cleanup());
    cleanupFunctions.value = [];
    animations.value = [];
  });
}
