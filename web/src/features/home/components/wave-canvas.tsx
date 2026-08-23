/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useEffect, useRef } from 'react'

/**
 * Flowing-line canvas: layered sine waves with mouse parallax, in the brand
 * gold. Zero dependencies, GPU-cheap (1px strokes), pauses off-screen and on
 * hidden tabs, and renders a single static frame under prefers-reduced-motion.
 *
 * Colors are hard-coded to the dark-luxe landing palette on purpose: this
 * surface locks its own warm near-black theme regardless of the app theme.
 */
export function WaveCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    let width = 0
    let height = 0
    let time = 0
    let running = true
    let raf = 0
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }

    interface Line {
      base: number
      amp1: number
      amp2: number
      freq1: number
      freq2: number
      speed1: number
      speed2: number
      phase: number
      alpha: number
    }
    let lines: Line[] = []
    const LINE_COUNT = coarse ? 9 : 13

    function buildLines() {
      lines = []
      for (let i = 0; i < LINE_COUNT; i++) {
        const p = i / (LINE_COUNT - 1)
        lines.push({
          base: height * (0.18 + p * 0.72),
          amp1: 26 + 46 * Math.sin(p * Math.PI),
          amp2: 10 + 18 * Math.sin(p * Math.PI),
          freq1: 0.0038 + p * 0.0022,
          freq2: 0.0095 - p * 0.003,
          speed1: 0.35 + p * 0.3,
          speed2: 0.6 - p * 0.25,
          phase: p * Math.PI * 2.4,
          alpha: 0.05 + 0.3 * Math.sin(p * Math.PI),
        })
      }
    }

    function drawFrame(t: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      const step = Math.max(6, width / 160)

      for (const line of lines) {
        const grad = ctx.createLinearGradient(0, 0, width, 0)
        grad.addColorStop(0, 'rgba(201,162,78,0)')
        grad.addColorStop(0.25, `rgba(201,162,78,${line.alpha * 0.7})`)
        grad.addColorStop(0.55, `rgba(232,201,126,${line.alpha})`)
        grad.addColorStop(0.85, `rgba(201,162,78,${line.alpha * 0.55})`)
        grad.addColorStop(1, 'rgba(201,162,78,0)')
        ctx.beginPath()
        ctx.strokeStyle = grad
        ctx.lineWidth = 1
        for (let x = -step; x <= width + step; x += step) {
          const dx = x - mouse.x
          const influence = Math.exp(-(dx * dx) / (2 * 160 * 160))
          const lift = influence * (mouse.y - line.base) * 0.16
          const y =
            line.base +
            Math.sin(x * line.freq1 + t * line.speed1 + line.phase) *
              (line.amp1 + influence * 34) +
            Math.sin(x * line.freq2 - t * line.speed2 + line.phase * 2) *
              line.amp2 +
            lift
          if (x === -step) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      const glow = ctx.createRadialGradient(
        width * 0.72,
        height * 0.38,
        0,
        width * 0.72,
        height * 0.38,
        Math.max(width, height) * 0.5
      )
      glow.addColorStop(0, 'rgba(201,162,78,0.05)')
      glow.addColorStop(1, 'rgba(201,162,78,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)
    }

    function resize() {
      if (!canvas || !host || !ctx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = host.clientWidth
      height = host.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildLines()
      if (reduceMotion) drawFrame(0)
    }

    function loop() {
      if (!running) return
      time += 0.016
      drawFrame(time)
      raf = requestAnimationFrame(loop)
    }

    function start() {
      if (reduceMotion || running) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      mouse.tx = e.clientX - rect.left
      mouse.ty = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.tx = -9999
      mouse.ty = -9999
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (reduceMotion) return
        if (entries[0].isIntersecting) start()
        else stop()
      },
      { threshold: 0 }
    )
    io.observe(host)

    const onVisibility = () => {
      if (reduceMotion) return
      if (document.hidden) stop()
      else start()
    }

    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', resize)

    resize()
    if (reduceMotion) {
      running = false
      drawFrame(0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      stop()
      io.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div ref={hostRef} aria-hidden className={className}>
      <canvas ref={canvasRef} className='block h-full w-full' />
    </div>
  )
}
