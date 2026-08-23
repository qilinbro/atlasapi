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
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'

import {
  RhythmBars,
  RhythmDots,
  RhythmRings,
} from '@/components/primitive-rhythm'
import { ShaderBackdrop } from '@/components/shader-backdrop'
import { useSystemConfig } from '@/hooks/use-system-config'

import { MagneticLink } from '../magnetic-link'
import { WaveCanvas } from '../wave-canvas'

interface BusinessLandingProps {
  isAuthenticated: boolean
}

/* Platinum-luxe palette, locked for this surface (independent of app theme). */
const INK = '#1c1812'
const MUTED = '#867e70'
const GOLD = '#b8923e'
const GOLD_BRIGHT = '#a17a2c'
const LINE = 'rgba(28,24,18,0.14)'
const CANVAS = '#f7f4ec'

/** Numbered editorial section, in the tokenrhythm.studio rhythm. */
function Section({
  index,
  label,
  title,
  children,
  delaySeconds,
}: {
  index: string
  label: string
  title: string
  children?: React.ReactNode
  delaySeconds: number
}) {
  return (
    <section
      className='luxe-rise mt-24'
      style={{ '--d': `${delaySeconds}s` } as CSSProperties}
    >
      <div className='flex items-baseline gap-4'>
        <span className='font-mono text-sm' style={{ color: GOLD_BRIGHT }}>
          {index}
        </span>
        <span
          className='font-mono text-[11px] tracking-[0.3em] uppercase'
          style={{ color: MUTED }}
        >
          {label}
        </span>
        <span className='h-px flex-1' style={{ background: LINE }} />
      </div>
      <h2 className='mt-6 font-serif text-3xl font-light tracking-tight sm:text-4xl'>
        {title}
      </h2>
      {children}
    </section>
  )
}

/**
 * Platinum-luxury editorial landing in the tokenrhythm.studio layout:
 * repeated brand wordmark, an English tagline, then numbered sections
 * (capability pillars, a curl request sample, docs CTA) on a warm platinum
 * canvas with the flowing-gold wave and film grain. Motion collapses under
 * prefers-reduced-motion. Upstream attribution lives in the site footer
 * (project policy) and is not part of this surface.
 */
export function BusinessLanding({ isAuthenticated }: BusinessLandingProps) {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()

  const name = systemName || 'Atlas'
  // Unique, content-derived keys so repeated characters don't collide.
  const chars = [...name].map((ch, i) => ({ ch, key: `${i}-${ch}` }))

  /** Stagger helper: sets the CSS custom property that delays an entrance. */
  const delay = (seconds: number): CSSProperties =>
    ({ '--d': `${seconds}s` }) as CSSProperties

  const pillars = [
    {
      title: t('Unified Access'),
      desc: t('One key for every model, behind a single standard API.'),
    },
    {
      title: t('Usage Analytics'),
      desc: t('Real-time insight into consumption, cost, and trends.'),
    },
    {
      title: t('Quota Control'),
      desc: t('Fine-grained quota and permission management for teams.'),
    },
  ]

  const curl = `curl ${location.origin}/v1/chat/completions \\
  -H "Authorization: Bearer $ATLAS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5.2",
    "messages": [{"role": "user", "content": "Hello, atlas."}]
  }'`

  return (
    <section
      className='relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden font-light'
      style={{ background: CANVAS, color: INK }}
    >
      {/* 香槟色涟漪颗粒 shader 铺底，画布自身缓慢呼吸 */}
      <ShaderBackdrop variant='luxe' />
      <WaveCanvas className='absolute inset-0' />
      <span className='luxe-grain' />

      {/* 基元律动：金色基元按同一节拍呼吸 — 涟漪点阵、呼吸圆环、频谱条 */}
      <div aria-hidden className='pointer-events-none absolute inset-0'>
        <RhythmDots
          cols={6}
          rows={4}
          beat={3.2}
          className='absolute top-[16%] right-[5%] hidden w-64 opacity-55 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] sm:grid'
          dotClassName='size-1 bg-[#b8923e]/70'
        />
        <RhythmRings
          count={3}
          beat={4}
          className='top-[24%] left-[20%] hidden size-[26rem] opacity-40 [mask-image:radial-gradient(circle,black_55%,transparent_100%)] sm:block'
          ringClassName='border-[#b8923e]/30'
        />
        <RhythmBars
          count={5}
          beat={2.4}
          className='absolute top-[31%] right-[5%] hidden h-7 opacity-50 sm:flex'
          barClassName='bg-[#b8923e]/60'
        />
      </div>

      <div className='relative z-10 mx-auto w-full max-w-5xl px-6 py-24 sm:px-10'>
        {/* Repeated brand wordmark + English tagline */}
        <p
          className='luxe-rise font-mono text-[11px] tracking-[0.3em] uppercase'
          style={{ color: GOLD, ...delay(0.1) }}
        >
          {name}&nbsp;&nbsp;&nbsp;&nbsp;{name}
        </p>
        <p
          className='luxe-rise mt-3 font-serif text-lg italic'
          style={{ color: MUTED, ...delay(0.2) }}
        >
          All Models, One Mind.
        </p>

        {/* Giant serif title, per-character rise */}
        <h1
          aria-label={name}
          className='mt-6 font-serif leading-[0.92] font-light'
          style={{
            fontSize: 'clamp(3.5rem,13vw,10.5rem)',
            letterSpacing: '-0.02em',
          }}
        >
          {chars.map(({ ch, key }, i) => (
            <span
              key={key}
              aria-hidden='true'
              className='luxe-char'
              style={delay(0.2 + i * 0.07)}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <p
          className='luxe-rise mt-8 font-serif text-2xl font-light sm:text-3xl'
          style={delay(0.7)}
        >
          {t('One gateway for every model.')}
        </p>
        <p
          className='luxe-rise mt-4 max-w-xl text-base leading-relaxed'
          style={{ color: MUTED, ...delay(0.85) }}
        >
          {t(
            'A unified AI gateway: one key for every model, with usage analytics and quota management.'
          )}
        </p>

        {/* CTAs */}
        <div
          className='luxe-rise mt-10 flex flex-wrap items-center gap-4'
          style={delay(1)}
        >
          {isAuthenticated ? (
            <MagneticLink
              to='/dashboard'
              className='h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-medium text-[#14110a] transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(201,162,78,0.25)]'
              style={{ background: GOLD }}
            >
              {t('Go to Dashboard')}
              <ArrowUpRight className='size-4' />
            </MagneticLink>
          ) : (
            <>
              <MagneticLink
                to='/sign-up'
                className='h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-medium text-[#14110a] transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(201,162,78,0.25)]'
                style={{ background: GOLD }}
              >
                {t('Get Started')}
                <ArrowUpRight className='size-4' />
              </MagneticLink>
              <MagneticLink
                to='/sign-in'
                className='h-12 items-center justify-center rounded-full border bg-transparent px-8 text-sm font-medium transition-colors duration-300 hover:bg-black/[0.04]'
                style={{ borderColor: LINE, color: INK }}
              >
                {t('Sign In')}
              </MagneticLink>
            </>
          )}
        </div>

        {/* 01 / Capability — pillar rows */}
        <Section
          index='01'
          label='Capability'
          title={t('Usage Analytics')}
          delaySeconds={1.15}
        >
          <ul className='mt-2'>
            {pillars.map((p, i) => (
              <li
                key={p.title}
                className='group grid grid-cols-[3rem_1fr_auto] items-center gap-6 border-b py-7'
                style={{ borderColor: LINE }}
              >
                <span
                  className='font-mono text-sm transition-transform duration-500 group-hover:translate-x-2'
                  style={{ color: MUTED }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className='font-serif text-xl font-light transition-transform duration-500 group-hover:translate-x-2 sm:text-2xl'>
                    {p.title}
                  </div>
                  <div
                    className='mt-1 max-w-md text-sm'
                    style={{ color: MUTED }}
                  >
                    {p.desc}
                  </div>
                </div>
                <ArrowUpRight
                  className='size-5 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100'
                  style={{ color: GOLD_BRIGHT }}
                />
              </li>
            ))}
          </ul>
        </Section>

        {/* 02 / Request — curl sample */}
        <Section
          index='02'
          label='Request'
          title={t('One key for every model, behind a single standard API.')}
          delaySeconds={1.3}
        >
          <pre
            className='mt-6 overflow-x-auto rounded-2xl border p-6 font-mono text-[13px] leading-relaxed'
            style={{
              borderColor: LINE,
              background: 'rgba(255,253,248,0.72)',
              color: INK,
            }}
          >
            <code>{curl}</code>
          </pre>
        </Section>

        {/* 03 / Docs — closing CTA */}
        <Section
          index='03'
          label='Docs'
          title={t('Get Started')}
          delaySeconds={1.45}
        >
          <p
            className='mt-4 max-w-xl text-base leading-relaxed'
            style={{ color: MUTED }}
          >
            {t(
              'A unified AI gateway: one key for every model, with usage analytics and quota management.'
            )}
          </p>
          <div className='mt-8'>
            <MagneticLink
              to={isAuthenticated ? '/dashboard' : '/sign-up'}
              className='group inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm font-medium text-[#14110a] transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(201,162,78,0.25)]'
              style={{ background: GOLD }}
            >
              {isAuthenticated ? t('Go to Dashboard') : t('Get Started')}
              <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-1' />
            </MagneticLink>
          </div>
        </Section>
      </div>
    </section>
  )
}
