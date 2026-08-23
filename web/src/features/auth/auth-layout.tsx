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
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import { OrbitDot } from '@/components/primitive-rhythm'
import { ShaderBackdrop } from '@/components/shader-backdrop'
import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'
import { cn } from '@/lib/utils'

type AuthLayoutProps = {
  children: React.ReactNode
}

/**
 * 白金工坊 (Platinum Atelier) auth surface, wide-window edition. Large
 * screens split into two panes: a left editorial panel riding the champagne
 * ripple shader with the giant serif wordmark and gold dust, and a calm
 * right pane where the form sits directly on the surface — no box, divided
 * only by a self-drawing hairline. Small screens collapse to a single
 * column with the shader behind everything. Motion collapses under
 * prefers-reduced-motion.
 */

/** Deterministic dust field: left position, size, tempo, drift amplitude. */
const GOLD_DUST = [
  { left: '14%', size: 2.5, duration: 16, delay: 0, drift: 26 },
  { left: '27%', size: 1.5, duration: 21, delay: 4, drift: -18 },
  { left: '38%', size: 2, duration: 18, delay: 9, drift: 22 },
  { left: '52%', size: 1.5, duration: 23, delay: 2, drift: -24 },
  { left: '64%', size: 2.5, duration: 17, delay: 12, drift: 18 },
  { left: '76%', size: 1.5, duration: 20, delay: 6, drift: -20 },
  { left: '88%', size: 2, duration: 19, delay: 14, drift: 16 },
] as const

function GoldDust({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return null
  }

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className
      )}
    >
      {GOLD_DUST.map((dust) => (
        <motion.span
          key={`${dust.left}-${dust.duration}`}
          className='absolute bottom-0 rounded-full'
          style={{
            left: dust.left,
            width: dust.size,
            height: dust.size,
            background: 'var(--primary)',
            boxShadow: '0 0 8px var(--primary)',
          }}
          initial={{ y: '0vh', opacity: 0 }}
          animate={{
            y: ['0vh', '-36vh', '-72vh', '-108vh'],
            x: [0, dust.drift, -dust.drift, 0],
            opacity: [0, 0.65, 0.65, 0],
          }}
          transition={{
            duration: dust.duration,
            delay: dust.delay,
            times: [0, 0.25, 0.75, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/** Stagger helper: sets the CSS custom property that delays an entrance. */
const delay = (seconds: number) =>
  ({ '--d': `${seconds}s` }) as React.CSSProperties

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()

  const name = systemName || 'Atlas'
  // Unique, content-derived keys so repeated characters don't collide.
  const chars = [...name].map((ch, i) => ({ ch, key: `${i}-${ch}` }))

  return (
    <div className='relative grid h-svh max-w-none overflow-hidden lg:grid-cols-[1.15fr_1fr]'>
      {/* 小屏背景：整页涟漪（大屏由左侧艺术面板承载） */}
      <div aria-hidden className='absolute inset-0 lg:hidden'>
        <ShaderBackdrop variant='auth' />
        <GoldDust />
      </div>

      {/* 左侧白金艺术面板（大屏）：涟漪 + 金尘 + 巨型字标 */}
      <div className='relative hidden overflow-hidden lg:block'>
        <ShaderBackdrop variant='auth' />
        <GoldDust />
        <div className='relative z-10 flex h-full flex-col justify-center px-16 xl:px-24'>
          <p
            className='luxe-rise text-primary/80 font-mono text-[11px] font-medium tracking-[0.35em] uppercase'
            style={delay(0.3)}
          >
            {name} · AI Gateway
          </p>
          <h1
            aria-label={name}
            className='font-display mt-7 text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.95] font-medium tracking-tight'
          >
            {chars.map(({ ch, key }, i) => (
              <span
                key={key}
                aria-hidden='true'
                className='luxe-char'
                style={delay(0.45 + i * 0.06)}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h1>
          <span
            aria-hidden
            className='animate-hairline-x bg-primary/50 mt-9 h-px w-24'
            data-origin='left'
            style={{ animationDelay: '1s' }}
          />
          <p
            className='luxe-rise text-primary font-display mt-9 text-2xl italic tracking-wide'
            style={delay(1.1)}
          >
            All Models, One Mind.
          </p>
          <p
            className='luxe-rise text-foreground/60 mt-3 max-w-md text-sm leading-relaxed'
            style={delay(1.25)}
          >
            Unified access, usage analytics, and quota control — one gateway
            for every model.
          </p>
        </div>
      </div>

      {/* 右侧表单面板：表单直接铺于表面，无框无盒 */}
      <div className='bg-background relative overflow-y-auto'>
        {/* 持续漂移的金色氛围光晕：表单表面时刻呼吸 */}
        <div
          aria-hidden
          className='animate-drift-a pointer-events-none absolute -top-[15%] -left-[20%] h-[55%] w-[60%] rounded-full opacity-[0.16] blur-3xl dark:opacity-[0.1]'
          style={{
            background:
              'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className='animate-drift-b pointer-events-none absolute -right-[15%] -bottom-[18%] h-[60%] w-[65%] rounded-full opacity-[0.13] blur-3xl dark:opacity-[0.08]'
          style={{
            background:
              'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          }}
        />
        {/* 分隔细线自绘 + 周期滑落的金色光珠 */}
        <span
          aria-hidden
          className='absolute top-0 left-0 hidden h-full w-px overflow-hidden lg:block'
        >
          <span
            className='animate-hairline-y bg-foreground/10 absolute inset-0'
            style={{ animationDelay: '250ms' }}
          />
          <span
            className='animate-line-shine-y via-primary/80 absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent to-transparent'
          />
        </span>

        <Link
          to='/'
          className='landing-animate-fade-down absolute top-4 left-4 z-10 flex items-center gap-2 transition-opacity hover:opacity-80 sm:top-8 sm:left-8'
          style={{ animationDelay: '200ms' }}
        >
          <div className='animate-float relative h-8 w-8'>
            {/* 卫星轨道点环绕品牌标志 */}
            <OrbitDot
              duration={8}
              className='-inset-2.5'
              dotClassName='bg-foreground/35 size-1.5 dark:bg-foreground/45'
            />
            {loading ? (
              <Skeleton className='absolute inset-0 rounded-full' />
            ) : (
              <img
                src={logo}
                alt={t('Logo')}
                className='h-8 w-8 rounded-full object-cover'
              />
            )}
          </div>
          {loading ? (
            <Skeleton className='h-6 w-24' />
          ) : (
            <span className='font-serif text-lg font-medium tracking-tight lg:hidden xl:inline-block'>
              {systemName}
            </span>
          )}
        </Link>

        <div className='flex min-h-svh items-center justify-center px-6 py-24 sm:px-12'>
          <div className='luxe-rise w-full max-w-md' style={delay(0.35)}>
            {children}
          </div>
        </div>
      </div>

      {/* 胶片颗粒（全视口） */}
      <span className='luxe-grain' />
    </div>
  )
}
