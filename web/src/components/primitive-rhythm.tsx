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
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

/**
 * 基元律动 (Primitive Rhythm) motion primitives.
 *
 * Geometric primitives — dots, rings, bars, orbiters — that move on a shared
 * beat. Every animation touches only GPU-friendly properties (transform and
 * opacity) and collapses to a static state under `prefers-reduced-motion`.
 */

const EASE_IN_OUT: [number, number, number, number] = [0.45, 0, 0.55, 1]

interface RhythmDotsProps {
  /** Dot-matrix columns. */
  cols?: number
  /** Dot-matrix rows. */
  rows?: number
  /** Length of one full pulse cycle, in seconds. */
  beat?: number
  /** How far the ripple lags from center to edge (0–1 of the beat). */
  wave?: number
  className?: string
  dotClassName?: string
}

/**
 * A dot matrix pulsing in a radial wave — the ripple emanates from the
 * center outward, like a heartbeat spreading across the field.
 */
export function RhythmDots({
  cols = 9,
  rows = 5,
  beat = 2.6,
  wave = 0.55,
  className,
  dotClassName,
}: RhythmDotsProps) {
  const shouldReduceMotion = useReducedMotion()
  const centerX = (cols - 1) / 2
  const centerY = (rows - 1) / 2
  const maxDistance = Math.hypot(centerX, centerY)

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none grid', className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = i % cols
        const y = Math.floor(i / cols)
        const distance = Math.hypot(x - centerX, y - centerY) / maxDistance
        return (
          <motion.span
            key={i}
            className={cn(
              'bg-foreground/50 mx-auto block size-[3px] rounded-full',
              dotClassName
            )}
            initial={{ scale: 0.4, opacity: 0.14 }}
            animate={
              shouldReduceMotion
                ? undefined
                : { scale: [0.4, 1, 0.4], opacity: [0.14, 0.55, 0.14] }
            }
            transition={{
              duration: beat,
              times: [0, 0.35, 1],
              repeat: Infinity,
              ease: EASE_IN_OUT,
              delay: shouldReduceMotion ? 0 : distance * beat * wave,
            }}
          />
        )
      })}
    </div>
  )
}

interface RhythmRingsProps {
  /** Number of concentric rings in the ripple. */
  count?: number
  /** Time for one ring to expand and fade, in seconds. */
  beat?: number
  className?: string
  ringClassName?: string
}

/**
 * Concentric rings breathing outward in an endless ripple. The parent
 * element defines the ripple's size; rings scale within it.
 */
export function RhythmRings({
  count = 3,
  beat = 3.2,
  className,
  ringClassName,
}: RhythmRingsProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div
        aria-hidden
        className={cn('pointer-events-none absolute', className)}
      >
        <span
          className={cn(
            'border-foreground/12 absolute inset-0 rounded-full border',
            ringClassName
          )}
        />
      </div>
    )
  }

  return (
    <div aria-hidden className={cn('pointer-events-none absolute', className)}>
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          className={cn(
            'border-foreground/12 absolute inset-0 rounded-full border',
            ringClassName
          )}
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: [0.55, 0.8, 1], opacity: [0, 0.5, 0] }}
          transition={{
            duration: beat,
            times: [0, 0.4, 1],
            repeat: Infinity,
            ease: 'easeOut',
            delay: (i * beat) / count,
          }}
        />
      ))}
    </div>
  )
}

interface RhythmBarsProps {
  /** Number of equalizer bars. */
  count?: number
  /** Length of one bar cycle, in seconds. */
  beat?: number
  className?: string
  barClassName?: string
}

/**
 * An equalizer cluster: bars stretch and settle on golden-ratio phase
 * offsets so the group never collapses into a single synchronized pulse.
 */
export function RhythmBars({
  count = 5,
  beat = 2.2,
  className,
  barClassName,
}: RhythmBarsProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none flex h-8 items-end gap-1', className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          className={cn('bg-foreground/40 w-[3px] rounded-full', barClassName)}
          style={{ height: '100%', originY: 1 }}
          initial={{ scaleY: 0.25 }}
          animate={
            shouldReduceMotion
              ? undefined
              : { scaleY: [0.25, 1, 0.35, 0.65, 0.25] }
          }
          transition={{
            duration: beat,
            repeat: Infinity,
            ease: EASE_IN_OUT,
            delay: shouldReduceMotion ? 0 : ((i * 0.618) % 1) * beat,
          }}
        />
      ))}
    </div>
  )
}

interface OrbitDotProps {
  /** Time for one full revolution, in seconds. */
  duration?: number
  /** Sizes and positions the orbit path (the wrapper's bounding box). */
  className?: string
  dotClassName?: string
}

/**
 * A satellite dot travelling a fixed orbit — the wrapper element defines
 * the orbital radius via its own size and position.
 */
export function OrbitDot({
  duration = 9,
  className,
  dotClassName,
}: OrbitDotProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return null
  }

  return (
    <motion.div
      aria-hidden
      className={cn('pointer-events-none absolute', className)}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <span
        className={cn(
          'bg-primary absolute top-0 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full',
          dotClassName
        )}
      />
    </motion.div>
  )
}

interface PrimitiveRhythmBackdropProps {
  /** `hero` spreads a wide ripple field; `panel` stays calm and focused. */
  variant?: 'hero' | 'panel'
  className?: string
}

/**
 * Composed 基元律动 backdrop: dot ripples, breathing rings, and equalizer
 * bars layered on a shared tempo. Place inside a relatively positioned
 * parent; it renders behind content at `-z-10`.
 */
export function PrimitiveRhythmBackdrop({
  variant = 'hero',
  className,
}: PrimitiveRhythmBackdropProps) {
  if (variant === 'panel') {
    return (
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
          className
        )}
      >
        {/* Ripple field anchored behind the form card */}
        <RhythmDots
          cols={7}
          rows={4}
          beat={3}
          className='absolute inset-x-8 top-1/2 h-56 -translate-y-1/2 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,black_25%,transparent_100%)] opacity-70'
          dotClassName='bg-foreground/40 size-1'
        />
        {/* Breathing rings focal point above the card */}
        <RhythmRings
          count={3}
          beat={3.6}
          className='absolute top-[16%] left-1/2 size-44 -translate-x-1/2 [mask-image:radial-gradient(circle,black_55%,transparent_100%)] opacity-50'
          ringClassName='border-foreground/15'
        />
        {/* Equalizer accent in the lower corner */}
        <RhythmBars
          count={4}
          beat={2}
          className='absolute bottom-10 left-6 hidden opacity-35 sm:left-10 sm:flex'
          barClassName='bg-foreground/30'
        />
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className
      )}
    >
      {/* Wide ripple field sweeping the hero */}
      <RhythmDots
        cols={13}
        rows={6}
        beat={2.8}
        className='absolute inset-x-0 top-[6%] mx-auto h-[62%] max-w-5xl [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black_20%,transparent_100%)]'
        dotClassName='bg-blue-500/60 dark:bg-blue-400/50 size-1'
      />
      {/* Breathing rings behind the terminal demo */}
      <RhythmRings
        count={3}
        beat={3.4}
        className='top-[18%] right-[4%] hidden size-80 [mask-image:radial-gradient(circle,black_50%,transparent_100%)] opacity-45 lg:block'
        ringClassName='border-blue-400/25 dark:border-blue-400/20'
      />
      {/* Satellite orbit crossing the field */}
      <OrbitDot
        duration={16}
        className='top-[12%] right-[10%] hidden size-[26rem] opacity-40 lg:block'
        dotClassName='bg-violet-400/70 dark:bg-violet-400/60 size-2'
      />
    </div>
  )
}
