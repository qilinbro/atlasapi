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
import { GrainGradient } from '@paper-design/shaders-react'
import { useReducedMotion } from 'motion/react'

import { useTheme } from '@/context/theme-provider'
import { cn } from '@/lib/utils'

/**
 * Animated WebGL backgrounds built on paper-design/shaders.
 *
 * Both variants breathe a grainy champagne `ripple` field — the 基元律动
 * motif rendered by the GPU. `luxe` underlays the platinum landing page with
 * a palette-locked cream canvas; `auth` covers the login surface edge to edge
 * with theme-aware colors (cream champagnes on light, bronze-to-gold on a
 * warm ink base on dark), while the form sits on a frosted panel to stay
 * readable. Motion stops entirely (`speed = 0`) under prefers-reduced-motion,
 * and the library pauses shaders that are off-screen or in a hidden tab.
 */

interface ShaderBackdropProps {
  variant?: 'luxe' | 'auth'
  className?: string
}

/** Tempo per variant — the auth surface never sits still. */
const SHADER_SPEED: Record<'luxe' | 'auth', number> = {
  luxe: 0.12,
  auth: 0.45,
}

/** Ripple contrast per variant — the auth surface is the more dynamic one. */
const SHADER_INTENSITY: Record<'luxe' | 'auth', number> = {
  luxe: 0.45,
  auth: 0.65,
}

export function ShaderBackdrop({
  variant = 'auth',
  className,
}: ShaderBackdropProps) {
  const shouldReduceMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const speed = shouldReduceMotion ? 0 : SHADER_SPEED[variant]

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
    >
      <GrainGradient
        className='h-full w-full'
        colorBack={isDark ? '#161210' : '#f7f4ec'}
        colors={
          isDark
            ? ['#2e2415', '#54421f', '#8a6a33', '#d9b96a']
            : ['#efe6d3', '#e3d3ae', '#d3b87e', '#b8923e']
        }
        shape='ripple'
        softness={0.8}
        intensity={SHADER_INTENSITY[variant]}
        noise={0.35}
        speed={speed}
      />
    </div>
  )
}
