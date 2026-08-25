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
      {/* Static champagne canvas: visible paper grain + platinum aura */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10'
        style={{ backgroundImage: 'var(--paper-texture), var(--canvas-grad)' }}
      />
      {/* Emerald structural color band on the page edge — wide enough to
          register as composition, not decoration */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 left-0 z-20 w-6'
        style={{
          background:
            'linear-gradient(180deg, #2a6b54 0%, #1a4d3e 62%, #143d30 100%)',
          boxShadow: '1px 0 0 rgba(244, 238, 216, 0.3), 5px 0 0 rgba(200, 169, 106, 0.18)',
        }}
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
      {/* Emerald seal — the cover's bookplate anchor, bottom-right of the
          wordmark zone. Large emerald mass is what reads as luxury at a
          glance (thin edge decorations do not register). */}
      <div
        aria-hidden
        className='pointer-events-none absolute right-[6%] bottom-[12%] hidden select-none lg:block'
      >
        <div
          className='border-[color:var(--platinum)]/45 p-1.5'
          style={{ boxShadow: '0 18px 44px rgba(10, 26, 20, 0.32)' }}
        >
          <div
            className='border-[color:var(--platinum)]/25 flex w-[clamp(160px,15vw,240px)] flex-col items-center gap-6 px-7 py-8'
            style={{
              background:
                'linear-gradient(165deg, #245a47 0%, #1a4d3e 45%, #123528 100%)',
            }}
          >
            <img
              src='/logo.png'
              alt=''
              className='w-14 object-contain invert sepia-[0.25] saturate-[0.45] contrast-[0.92]'
            />
            <span
              aria-hidden
              className='block h-px w-8 bg-[#e8dfc6]/50'
            />
            <div className='flex flex-col items-center gap-1'>
              {['A', 'T', 'L', 'A', 'S'].map((ch) => (
                <span
                  key={ch}
                  className='font-serif text-base font-semibold text-[#e8dfc6]'
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </div>
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
          className='platinum-title platinum-press landing-animate-fade-up font-serif text-[clamp(4.5rem,17vw,15rem)] leading-[0.95] font-semibold tracking-[0.08em] uppercase opacity-0 select-none'
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
    </section>
  )
}
