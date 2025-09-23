import { useEffect, useRef } from 'react'
import { createColorScale, withAlpha } from '@/utils/color'

type Params = {
  values: number[]
  active?: { i?: number; j?: number; pivot?: number; range?: { l: number; r: number } }
  palette: 'default' | 'high-contrast' | 'colorblind'
  glow: boolean
  showRange: boolean
}

type AnimationState = {
  swapArc?: { i: number; j: number; progress: number }
  pivotPulse?: { index: number; intensity: number }
  motionTrails: Array<{ x: number; y: number; age: number; value: number }>
}

export function useBarsRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  { values, active, palette, glow, showRange }: Params
) {
  const rafRef = useRef<number>()
  const prevHeightsRef = useRef<number[]>()
  const animStateRef = useRef<AnimationState>({ motionTrails: [] })
  const lastActiveRef = useRef<typeof active>()
  
  useEffect(() => {
    const rootCanvas = canvasRef.current
    if (!rootCanvas) return
    const ctx = rootCanvas.getContext('2d')!

    // Detect new swaps and pivots for animations
    if (active && lastActiveRef.current) {
      const curr = active
      const prev = lastActiveRef.current
      
      // New swap detected
      if (curr.i !== undefined && curr.j !== undefined && 
          (curr.i !== prev.i || curr.j !== prev.j)) {
        animStateRef.current.swapArc = { i: curr.i, j: curr.j, progress: 0 }
      }
      
      // New pivot detected
      if (curr.pivot !== undefined && curr.pivot !== prev.pivot) {
        animStateRef.current.pivotPulse = { index: curr.pivot, intensity: 1 }
      }
    }
    lastActiveRef.current = active

    function render() {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr
        canvas.height = height * dpr
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const n = Math.max(1, values.length)
      const w = width / n
      const max = Math.max(...values, 1)
      const color = createColorScale(max, palette)

      // Range shading
      if (showRange && active?.range) {
        const l = active.range.l
        const r = active.range.r
        const x = (l / n) * width
        const rw = ((r - l + 1) / n) * width
        ctx.fillStyle = withAlpha('#0ea5e9', 0.08)
        ctx.fillRect(x, 0, rw, height)
      }

      // Motion trails
      const anim = animStateRef.current
      anim.motionTrails = anim.motionTrails.filter(trail => {
        trail.age += 0.02
        if (trail.age > 1) return false
        const alpha = 1 - trail.age
        ctx.fillStyle = withAlpha('#60a5fa', alpha * 0.3)
        ctx.fillRect(trail.x - 2, trail.y - 2, 4, 4)
        return true
      })

      const prev = prevHeightsRef.current ?? []
      const curHeights = new Array(n)
      const ease = (t: number) => t * (2 - t) // easeOutQuad
      
      for (let i = 0; i < n; i++) {
        const v = values[i]
        const target = (v / max) * (height - 8)
        const last = prev[i] ?? target
        const h = last + (target - last) * ease(0.4)
        curHeights[i] = h
        const x = i * w
        const y = height - h
        const isActive = i === active?.i || i === active?.j
        const isPivot = i === active?.pivot
        
        // Add motion trails for active bars
        if (isActive && Math.random() < 0.3) {
          anim.motionTrails.push({ x: x + w/2, y: y + h/2, age: 0, value: v })
        }
        
        const base = color(v)
        ctx.fillStyle = isPivot ? '#f59e0b' : isActive ? '#60a5fa' : base
        
        // Pivot pulse effect
        let extraGlow = 0
        if (isPivot && anim.pivotPulse?.index === i) {
          const pulse = Math.sin(Date.now() * 0.01) * 0.5 + 0.5
          extraGlow = pulse * 8
          anim.pivotPulse.intensity *= 0.98
          if (anim.pivotPulse.intensity < 0.1) anim.pivotPulse = undefined
        }
        
        if ((glow && (isActive || isPivot)) || extraGlow > 0) {
          ctx.shadowColor = withAlpha(ctx.fillStyle as string, 0.9)
          ctx.shadowBlur = 12 + extraGlow
        } else {
          ctx.shadowBlur = 0
        }
        ctx.fillRect(x + 1, y, Math.max(1, w - 2), h)
      }
      
      // Draw swap arc
      if (anim.swapArc) {
        const { i, j, progress } = anim.swapArc
        const x1 = i * w + w/2
        const x2 = j * w + w/2
        const y1 = height - curHeights[i]
        const y2 = height - curHeights[j]
        const midX = (x1 + x2) / 2
        const midY = Math.min(y1, y2) - 40
        
        ctx.strokeStyle = withAlpha('#60a5fa', 1 - progress)
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.quadraticCurveTo(midX, midY, x2, y2)
        ctx.stroke()
        
        anim.swapArc.progress += 0.05
        if (anim.swapArc.progress >= 1) anim.swapArc = undefined
      }
      
      prevHeightsRef.current = curHeights
    }

    let running = true
    const loop = () => {
      if (!running) return
      render()
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [canvasRef, values, active, palette, glow, showRange])
}
