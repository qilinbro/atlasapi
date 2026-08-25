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
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'

import { useSystemConfig } from '@/hooks/use-system-config'

import { MagneticLink } from '../magnetic-link'
import { StrobeCode } from '../strobe-code'
import { WaveCanvas } from '../wave-canvas'

interface BusinessLandingProps {
  isAuthenticated: boolean
}

/* Dark-luxe palette, locked for this surface (independent of app theme). */
const INK = '#f5f1e6'
const MUTED = '#a89e8a'
const GOLD = '#b8923e'
const GOLD_BRIGHT = '#d3b878'
const GOLD_DEEP = '#8a6a24'
const LINE = 'rgba(245, 241, 230, 0.16)'
const CANVAS = '#120f0a'
const PAPER = '#1a160f'
/* Champagne-gold metallic gradient for the display title (bright stops for the dark canvas). */
const GOLD_TEXT_GRADIENT = `linear-gradient(165deg, ${GOLD_BRIGHT} 0%, ${GOLD} 45%, #e8c87e 75%, ${GOLD_DEEP} 100%)`

/** Section shell in the tokenrhythm.studio rhythm: medium H2 + muted lead. */
function Section({
  title,
  lead,
  children,
  delaySeconds,
}: {
  title: string
  lead?: string
  children?: React.ReactNode
  delaySeconds: number
}) {
  return (
    <section
      className='luxe-rise mt-20 sm:mt-28'
      style={{ '--d': `${delaySeconds}s` } as CSSProperties}
    >
      <h2 className='text-3xl font-medium tracking-tight sm:text-4xl'>
        {title}
      </h2>
      {lead && (
        <p className='mt-3 max-w-2xl text-lg leading-relaxed' style={{ color: MUTED }}>
          {lead}
        </p>
      )}
      {children}
    </section>
  )
}

/**
 * Dark-luxe editorial landing following tokenrhythm.studio: repeated
 * brand wordmark and English tagline, a giant gold-gradient serif title,
 * then numbered capability cards, a four-step quickstart, a curl request
 * sample, and quick links — all on a warm near-black canvas with hairline
 * borders, champagne-gold accents, and flowing gold wave lines.
 * Entrance motion collapses under prefers-reduced-motion.
 */
export function BusinessLanding({ isAuthenticated }: BusinessLandingProps) {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()
  const [copied, setCopied] = useState(false)

  const name = systemName || 'Atlas'
  // Unique, content-derived keys so repeated characters don't collide.
  const chars = [...name].map((ch, i) => ({ ch, key: `${i}-${ch}` }))

  /** Stagger helper: sets the CSS custom property that delays an entrance. */
  const delay = (seconds: number): CSSProperties =>
    ({ '--d': `${seconds}s` }) as CSSProperties

  const capabilities = [
    {
      index: '01',
      title: t('Unified Access'),
      desc: t('One key for every model, behind a single standard API.'),
      to: '/keys',
    },
    {
      index: '02',
      title: t('Model Pricing'),
      desc: t('Transparent per-model pricing, pay as you go'),
      to: '/pricing',
    },
    {
      index: '03',
      title: t('Usage Analytics'),
      desc: t('Real-time insight into consumption, cost, and trends.'),
      to: '/usage-logs/common',
    },
    {
      index: '04',
      title: t('Quota Control'),
      desc: t('Fine-grained quota and permission management for teams.'),
      to: '/wallet',
    },
  ]

  const steps = [
    {
      title: t('Sign Up'),
      desc: t('Create an account or quick sign-in'),
      to: '/sign-up',
    },
    {
      title: t('Create API Key'),
      desc: t('Generate and manage keys in the console'),
      to: '/keys',
    },
    {
      title: t('Choose a Model'),
      desc: t('Browse models and transparent pricing'),
      to: '/pricing',
    },
    {
      title: t('Start Calling'),
      desc: t('Send your first chat completion request'),
      to: '/dashboard',
    },
  ]

  const quickLinks = [
    {
      title: t('Model Pricing'),
      desc: t('Transparent per-model pricing, pay as you go'),
      to: '/pricing',
    },
    {
      title: t('API Keys'),
      desc: t('One key for every model, behind a single standard API.'),
      to: '/keys',
    },
    {
      title: t('Usage Logs'),
      desc: t('Real-time insight into consumption, cost, and trends.'),
      to: '/usage-logs/common',
    },
  ]

  const curl = `curl ${location.origin}/v1/chat/completions \\
  -H "Authorization: Bearer $ATLAS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5.2",
    "messages": [{"role": "user", "content": "Hello, atlas."}]
  }'`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(curl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard may be unavailable (permissions / non-secure context).
    }
  }

  return (
    <section
      className='relative min-h-[100dvh] overflow-hidden font-sans'
      style={{ background: CANVAS, color: INK }}
    >
      {/* 流动金色曲线铺底：仅首屏范围（与参考站一致，线条密度与峰值都在视口内） */}
      <WaveCanvas className='absolute inset-x-0 top-0 h-[100dvh]' />

      <div className='relative z-10 mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-28'>
        {/* English tagline only \u2014 the small scrambled wordmark is removed */}
        <p
          className='luxe-rise font-fraunces text-xl italic'
          style={{ color: MUTED, ...delay(0.2) }}
        >
          All Models, One Mind.
        </p>

        {/* Giant Fraunces serif title, per-character rise */}
        <h1
          aria-label={name}
          className='mt-8 font-fraunces leading-[0.95] font-light'
          style={{
            fontSize: 'clamp(3.5rem, 13vw, 10.5rem)',
            letterSpacing: '-0.02em',
          }}
        >
          {chars.map(({ ch, key }, i) => (
            <span
              key={key}
              aria-hidden='true'
              className='luxe-char'
              style={{
                ...delay(0.25 + i * 0.07),
                backgroundImage: GOLD_TEXT_GRADIENT,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </h1>

        {/* CTAs */}
        <div
          className='luxe-rise mt-10 flex flex-wrap items-center gap-4'
          style={delay(1)}
        >
          {isAuthenticated ? (
            <MagneticLink
              to='/dashboard'
              className='h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-medium text-[#14110a] transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(201,162,78,0.35)]'
              style={{ background: GOLD }}
            >
              {t('Go to Dashboard')}
              <ArrowUpRight className='size-4' />
            </MagneticLink>
          ) : (
            <>
              <MagneticLink
                to='/sign-up'
                className='h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-medium text-[#14110a] transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(201,162,78,0.35)]'
                style={{ background: GOLD }}
              >
                {t('Get Started')}
                <ArrowUpRight className='size-4' />
              </MagneticLink>
              <MagneticLink
                to='/sign-in'
                className='h-12 items-center justify-center rounded-full border bg-transparent px-8 text-base font-medium transition-colors duration-300 hover:bg-white/[0.05]'
                style={{ borderColor: LINE, color: INK }}
              >
                {t('Sign In')}
              </MagneticLink>
            </>
          )}
        </div>

        {/* Core capabilities — numbered link cards */}
        <Section
          title={t('Core Capabilities')}
          lead={t('One gateway for access, pricing, analytics, and governance')}
          delaySeconds={1.15}
        >
          <div className='mt-8 grid gap-4 sm:grid-cols-2'>
            {capabilities.map((cap) => (
              <Link
                key={cap.index}
                to={cap.to}
                className='group rounded-2xl border border-[rgba(245,241,230,0.14)] bg-[#1a160f] p-6 transition-colors duration-300 hover:bg-[#241e13] sm:p-7'
              >
                <div className='flex items-center justify-between'>
                  <span
                    className='font-plex-mono text-base'
                    style={{ color: GOLD_BRIGHT }}
                  >
                    →{cap.index}
                  </span>
                  <ArrowUpRight
                    className='size-5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100'
                    style={{ color: GOLD_BRIGHT }}
                  />
                </div>
                <h3 className='mt-5 text-xl font-semibold tracking-tight sm:text-2xl'>
                  {cap.title}
                </h3>
                <p
                  className='mt-2 text-base leading-relaxed'
                  style={{ color: MUTED }}
                >
                  {cap.desc}
                </p>
              </Link>
            ))}
          </div>
        </Section>

        {/* Four-step quickstart */}
        <Section
          title={t('Get Started in Four Steps')}
          lead={t('From sign-up to your first request in minutes')}
          delaySeconds={1.3}
        >
          <div className='mt-8 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4'>
            {steps.map((step, i) => (
              <Link key={step.title} to={step.to} className='group block'>
                <div
                  className='text-3xl font-bold tracking-tight tabular-nums'
                  style={{ color: GOLD }}
                >
                  {i + 1}
                </div>
                <h3 className='mt-3 text-lg font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1'>
                  {step.title}
                </h3>
                <p
                  className='mt-1.5 text-base leading-relaxed'
                  style={{ color: MUTED }}
                >
                  {step.desc}
                </p>
              </Link>
            ))}
          </div>
        </Section>

        {/* Request sample — curl */}
        <Section
          title={t('Request Sample')}
          lead={t('Copy the code and start calling right away')}
          delaySeconds={1.45}
        >
            <div
              className='mt-8 overflow-hidden rounded-2xl border bg-[#1a160f]'
              style={{ borderColor: LINE }}
            >
            <div
              className='flex items-center justify-between border-b px-5 py-3'
              style={{ borderColor: LINE }}
            >
              <span className='font-plex-mono text-xs' style={{ color: MUTED }}>
                cURL
              </span>
              <button
                type='button'
                onClick={handleCopy}
                className='rounded-full border px-4 py-1.5 text-xs font-medium transition-colors duration-300 hover:bg-white/[0.05]'
                style={{ borderColor: LINE, color: INK }}
              >
                {copied ? t('Copied') : t('Copy')}
              </button>
            </div>
            <pre
              className='overflow-x-auto p-5 font-plex-mono text-sm leading-relaxed'
              style={{ background: PAPER, color: INK }}
            >
              {/* 频闪解码：进入视口时乱码翻滚后逐字落定（unfds.com 风格） */}
              <StrobeCode text={curl} />
            </pre>
          </div>
        </Section>

        {/* Quick links */}
        <Section title={t('Quick Links')} delaySeconds={1.6}>
          <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {quickLinks.map((linkItem) => (
              <Link
                key={linkItem.title}
                to={linkItem.to}
                className='group rounded-2xl border border-[rgba(245,241,230,0.14)] bg-[#1a160f] p-5 transition-colors duration-300 hover:bg-[#241e13]'
              >
                <div className='flex items-center justify-between gap-2'>
                  <h3 className='text-base font-semibold tracking-tight'>
                    {linkItem.title}
                  </h3>
                  <ArrowRight
                    className='size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1'
                    style={{ color: GOLD_BRIGHT }}
                  />
                </div>
                <p
                  className='mt-2 text-base leading-relaxed'
                  style={{ color: MUTED }}
                >
                  {linkItem.desc}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </section>
  )
}
