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
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

/** Cover strap facts — the magazine "cover lines" strip at the fold. */
const COVER_FACTS = [
  { key: 'Vendors', value: '08' },
  { key: 'Models', value: '30+' },
  { key: 'Single API Key', value: '01' },
] as const

/**
 * Atlas cover — editorial one-screen opening of the three-act page.
 * Giant platinum serif wordmark, one-line subtitle, inline index links.
 * The right column carries a bleeding platinum "A" glyph watermark over
 * the canvas aura; the fold closes with a mono data strap.
 * Static composition; entrance is a single fade-up pass.
 */
export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  return (
    <section
      id='cover'
      className='relative flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden px-6 py-16 md:px-12 md:py-20'
    >
      {/* Static champagne canvas with a faint platinum aura on the right */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10'
        style={{ background: 'var(--canvas-grad)' }}
      />
      {/* Bleeding line-art logo watermark — fills the right column */}
      <div
        aria-hidden
        className='pointer-events-none absolute top-1/2 right-[-14%] -z-10 hidden -translate-y-1/2 opacity-[0.12] select-none sm:block lg:right-[-8%] dark:opacity-[0.07] dark:invert dark:sepia-[0.3] dark:saturate-[0.5]'
      >
        <img
          src='/logo.png'
          alt=''
          className='h-[48vw] max-h-[580px] w-[48vw] max-w-[580px] object-contain'
        />
      </div>
      {/* Vertical hairline marking the asymmetric split */}
      <div
        aria-hidden
        className='platinum-hairline absolute top-24 bottom-24 right-[38%] hidden opacity-40 lg:block'
      />

      <div className='mx-auto my-auto w-full max-w-6xl'>
        <p className='platinum-label landing-animate-fade-up mb-6 text-[11px] font-bold uppercase opacity-0'>
          {t('LLM API Service Platform')}
        </p>

        <h1
          className='platinum-title landing-animate-fade-up font-serif text-[clamp(4.5rem,17vw,15rem)] leading-[0.95] font-semibold tracking-[0.08em] uppercase opacity-0 select-none'
          style={{ animationDelay: '60ms' }}
        >
          Atlas
        </h1>

        <p
          className='landing-animate-fade-up mt-8 max-w-xl font-serif text-xl leading-relaxed tracking-[0.12em] opacity-0 md:text-2xl'
          style={{ animationDelay: '140ms' }}
        >
          <span className='emerald-accent'>
            {t('One key, every leading domestic model.')}
          </span>
        </p>

        {/* Inline index — the cover doubles as the table of contents */}
        <nav
          className='landing-animate-fade-up mt-12 flex flex-wrap gap-x-10 gap-y-3 opacity-0'
          style={{ animationDelay: '220ms' }}
        >
          <a
            href='#plates'
            className='group text-muted-foreground hover:text-foreground inline-flex items-baseline gap-3 text-sm tracking-widest transition-colors'
          >
            <span className='text-[var(--platinum)] font-semibold'>01</span>
            {t('Domestic Model Matrix')}
            <span
              aria-hidden
              className='bg-border group-hover:bg-[var(--platinum)] h-px w-8 transition-colors'
            />
          </a>
          <a
            href='#back'
            className='group text-muted-foreground hover:text-foreground inline-flex items-baseline gap-3 text-sm tracking-widest transition-colors'
          >
            <span className='text-[var(--platinum)] font-semibold'>02</span>
            {t('Start Using')}
            <span
              aria-hidden
              className='bg-border group-hover:bg-[var(--platinum)] h-px w-8 transition-colors'
            />
          </a>
        </nav>

        <div
          className='landing-animate-fade-up mt-12 flex flex-wrap items-center gap-4 opacity-0'
          style={{ animationDelay: '300ms' }}
        >
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
      </div>

      {/* Data strap — cover lines set at the fold, mono numerals */}
      <div
        className='landing-animate-fade-up border-border/70 mx-auto mt-10 w-full max-w-6xl border-t pt-5 opacity-0'
        style={{ animationDelay: '380ms' }}
      >
        <div className='flex flex-wrap items-baseline gap-x-10 gap-y-2'>
          {COVER_FACTS.map((fact) => (
            <span
              key={fact.key}
              className='inline-flex items-baseline gap-2.5'
            >
              <span className='text-[color:var(--platinum-ink)] font-mono text-sm font-semibold tabular-nums'>
                {fact.value}
              </span>
              <span className='text-muted-foreground text-[11px] tracking-[0.18em] uppercase'>
                {t(fact.key)}
              </span>
            </span>
          ))}
          <span className='inline-flex items-baseline gap-2.5'>
            <span
              aria-hidden
              className='inline-block size-1.5 translate-y-[-1px] rotate-45 bg-[var(--platinum)]'
            />
            <span className='text-muted-foreground text-[11px] tracking-[0.18em] uppercase'>
              {t('Transparent Billing')}
            </span>
          </span>
        </div>
      </div>
    </section>
  )
}
