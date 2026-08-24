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

interface CTAProps {
  isAuthenticated?: boolean
}

/**
 * Back cover — a full-bleed emerald lacquer closing act with a giant
 * platinum serif line. On lacquer the interactive green would sink, so
 * the primary action is a platinum-hairline button (brand exception,
 * documented in AGENTS.md §2): emerald remains the interactive color
 * everywhere on canvas; here it arrives on hover fill.
 */
export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  return (
    <section
      id='back'
      className='relative flex min-h-[85svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center'
      style={{
        background:
          'linear-gradient(160deg, #14342a 0%, #0f2a21 55%, #0b1f18 100%)',
      }}
    >
      <div
        aria-hidden
        className='platinum-hairline absolute inset-x-16 top-16 opacity-60'
      />
      <div
        aria-hidden
        className='platinum-hairline absolute inset-x-16 bottom-16 opacity-60'
      />

      <p className='platinum-label landing-animate-fade-up mb-8 text-[11px] font-bold uppercase opacity-0'>
        02 · Atlas
      </p>

      <h2
        className='platinum-title landing-animate-fade-up font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.15] font-semibold tracking-[0.1em] opacity-0'
        style={{ animationDelay: '80ms' }}
      >
        {t('One key, every leading domestic model.')}
      </h2>

      <div
        className='landing-animate-fade-up mt-12 flex flex-wrap items-center justify-center gap-4 opacity-0'
        style={{ animationDelay: '180ms' }}
      >
        {props.isAuthenticated ? (
          <Button
            className='group h-12 rounded-lg border border-[color:var(--platinum)]/50 bg-transparent px-8 text-sm font-medium tracking-widest text-[color:var(--platinum)] hover:bg-[var(--primary)] hover:text-[color:var(--primary-foreground)]'
            render={<Link to='/dashboard' />}
          >
            {t('Go to Dashboard')}
            <ArrowRight className='ml-2 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
        ) : (
          <Button
            className='group h-12 rounded-lg border border-[color:var(--platinum)]/50 bg-transparent px-8 text-sm font-medium tracking-widest text-[color:var(--platinum)] hover:bg-[var(--primary)] hover:text-[color:var(--primary-foreground)]'
            render={<Link to='/sign-up' />}
          >
            {t('Start Using')}
            <ArrowRight className='ml-2 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
        )}
        <Button
          variant='outline'
          className='h-12 rounded-lg border-[color:var(--platinum)]/35 bg-transparent px-8 text-sm font-medium tracking-widest text-[color:var(--platinum-ink)] hover:border-[color:var(--platinum)]/70 hover:bg-transparent hover:text-[color:var(--platinum)]'
          render={<Link to='/pricing' />}
        >
          {t('View Pricing')}
        </Button>
      </div>
    </section>
  )
}
