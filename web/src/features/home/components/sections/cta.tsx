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
 * Back cover — the engraved emerald lacquer artwork fills the section;
 * the Atlas line-art logo sits centered on the artwork's empty medallion
 * (inverted to a warm off-white so it reads on lacquer). Headline and
 * actions anchor to the lower third, keeping the medallion unobstructed.
 * The lacquer gradient below stays as the loading fallback.
 */
export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  return (
    <section
      id='back'
      className='relative flex min-h-[85svh] flex-col overflow-hidden px-6 pt-16 pb-20 md:px-12'
      style={{
        background:
          'linear-gradient(160deg, #14342a 0%, #0f2a21 55%, #0b1f18 100%)',
      }}
    >
      <img
        src='/plates/backcover.png'
        alt=''
        loading='lazy'
        className='pointer-events-none absolute inset-0 h-full w-full object-cover select-none'
      />

      {/* Logo centered on the artwork medallion */}
      <img
        src='/logo.png'
        alt=''
        aria-hidden
        className='pointer-events-none absolute top-1/2 left-1/2 w-[clamp(88px,15vw,270px)] -translate-x-1/2 -translate-y-1/2 object-contain select-none invert sepia-[0.25] saturate-[0.45] contrast-[0.92]'
      />

      <p className='platinum-label relative z-10 mx-auto w-full max-w-6xl text-start text-[11px] font-bold uppercase'>
        02 · Atlas
      </p>

      <div className='relative z-10 mx-auto mt-auto flex w-full max-w-6xl flex-col items-center gap-8 text-center'>
        <h2 className='platinum-title font-serif text-[clamp(1.9rem,4.5vw,3.6rem)] leading-[1.2] font-semibold tracking-[0.1em]'>
          {t('One key, every leading domestic model.')}
        </h2>

        <div className='flex flex-wrap items-center justify-center gap-4'>
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
      </div>
    </section>
  )
}
