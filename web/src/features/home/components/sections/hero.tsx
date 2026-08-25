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
import { ArrowRight } from 'lucide-react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

/** Cover strap facts — the magazine "cover lines" set at the fold. */
const COVER_FACTS = [
  { key: 'Vendors', value: '08' },
  { key: 'Models', value: '30+' },
  { key: 'Single API Key', value: '01' },
] as const

/**
 * Atlas cover — broadsheet masthead composition. Three horizontal zones:
 * a masthead row (label left, index right, hairline under), a confident
 * breathing void, then the title block anchored to the fold with the
 * wordmark scaled to fill the measure. Luxury comes from typographic
 * scale and rhythm, not from inserted blocks.
 */
export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  return (
    <section
      id='cover'
      className='relative flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden px-6 py-14 md:px-12 md:py-16'
    >
      {/* Static champagne canvas: visible paper grain + platinum aura */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10'
        style={{ backgroundImage: 'var(--paper-texture), var(--canvas-grad)' }}
      />
      {/* Book-cover double rule frame with corner diamonds */}
      <div
        aria-hidden
        className='border-[color:var(--platinum)]/25 pointer-events-none absolute inset-3 border md:inset-5'
      />
      <div
        aria-hidden
        className='border-[color:var(--platinum)]/12 pointer-events-none absolute inset-4 border md:inset-7'
      />
      {(
        [
          'top-3 left-3 md:top-5 md:left-5',
          'top-3 right-3 md:top-5 md:right-5',
          'bottom-3 left-3 md:bottom-5 md:left-5',
          'bottom-3 right-3 md:bottom-5 md:right-5',
        ] as const
      ).map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`bg-[var(--platinum)]/55 pointer-events-none absolute size-1.5 rotate-45 ${pos}`}
        />
      ))}

      <div className='mx-auto flex w-full max-w-6xl flex-1 flex-col'>
        {/* Masthead row — label and table of contents share one baseline */}
        <div className='landing-animate-fade-up border-border/70 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b pb-5 opacity-0'>
          <p className='platinum-label text-[11px] font-bold uppercase'>
            {t('LLM API Service Platform')}
          </p>
          <nav className='flex flex-wrap gap-x-8 gap-y-2'>
            <a
              href='#plates'
              className='group text-muted-foreground hover:text-foreground inline-flex items-baseline gap-2.5 text-xs tracking-widest transition-colors'
            >
              <span className='text-[var(--platinum)] font-semibold'>01</span>
              {t('Domestic Model Matrix')}
              <span
                aria-hidden
                className='bg-border group-hover:bg-[var(--platinum)] h-px w-6 transition-colors'
              />
            </a>
            <a
              href='#back'
              className='group text-muted-foreground hover:text-foreground inline-flex items-baseline gap-2.5 text-xs tracking-widest transition-colors'
            >
              <span className='text-[var(--platinum)] font-semibold'>02</span>
              {t('Start Using')}
              <span
                aria-hidden
                className='bg-border group-hover:bg-[var(--platinum)] h-px w-6 transition-colors'
              />
            </a>
          </nav>
        </div>

        {/* Breathing void — the luxury of confident emptiness */}
        <div className='flex-1' />

        {/* Title block anchored to the fold */}
        <h1
          className='platinum-title platinum-press landing-animate-fade-up font-serif text-[clamp(4.5rem,19.5vw,17.5rem)] leading-[0.9] font-semibold tracking-[0.04em] uppercase opacity-0 select-none'
          style={{ animationDelay: '80ms' }}
        >
          Atlas
        </h1>

        <p
          className='landing-animate-fade-up mt-7 font-serif text-xl leading-relaxed tracking-[0.14em] opacity-0 md:text-2xl'
          style={{ animationDelay: '160ms' }}
        >
          <span className='emerald-accent'>
            {t('One key, every leading domestic model.')}
          </span>
        </p>

        {/* Fold row — actions left, cover lines right, one shared baseline */}
        <div
          className='landing-animate-fade-up mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 opacity-0'
          style={{ animationDelay: '240ms' }}
        >
          <div className='flex flex-wrap items-center gap-4'>
            {props.isAuthenticated ? (
              <Button
                className='group h-12 rounded-lg px-7 text-sm font-medium tracking-widest'
                render={<Link to='/dashboard' />}
              >
                {t('Go to Dashboard')}
                <ArrowRight className='ml-2 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
            ) : (
              <Button
                className='group h-12 rounded-lg px-7 text-sm font-medium tracking-widest'
                render={<Link to='/sign-up' />}
              >
                {t('Start Using')}
                <ArrowRight className='ml-2 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
            )}
            <Button
              variant='outline'
              className='h-12 rounded-lg px-7 text-sm font-medium tracking-widest'
              render={<Link to='/pricing' />}
            >
              {t('View Pricing')}
            </Button>
          </div>

          <div className='flex flex-wrap items-baseline gap-x-6 gap-y-2'>
            {COVER_FACTS.map((fact) => (
              <Fragment key={fact.key}>
                <span className='inline-flex items-baseline gap-2.5'>
                  <span className='text-[color:var(--platinum-ink)] font-mono text-sm font-semibold tabular-nums'>
                    {fact.value}
                  </span>
                  <span className='text-muted-foreground text-[11px] tracking-[0.18em] uppercase'>
                    {t(fact.key)}
                  </span>
                </span>
                <span
                  aria-hidden
                  className='inline-block size-1 translate-y-[-2px] rotate-45 bg-[var(--primary)]/70'
                />
              </Fragment>
            ))}
            <span className='inline-flex items-baseline gap-2.5'>
              <span
                aria-hidden
                className='inline-block size-1.5 translate-y-[-1px] rotate-45 bg-[var(--primary)]'
              />
              <span className='text-muted-foreground text-[11px] tracking-[0.18em] uppercase'>
                {t('Transparent Billing')}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
