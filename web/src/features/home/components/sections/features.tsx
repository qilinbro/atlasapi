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
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'

interface FeaturesProps {
  className?: string
}

type Plate = {
  vendor: string
  models: string[]
  /** grid span classes for the asymmetric editorial layout */
  span: string
  /** display size of the vendor wordmark */
  scale: 'xl' | 'lg' | 'md'
  /** optional engraved artwork filling the plate (public/plates/) */
  img?: string
}

const PLATES: Plate[] = [
  {
    vendor: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    span: 'md:col-span-3 md:row-span-2',
    scale: 'xl',
    img: '/plates/deepseek.png',
  },
  {
    vendor: 'Qwen',
    models: ['qwen-max', 'qwen-plus', 'qwen-turbo'],
    span: 'md:col-span-3 md:row-span-2',
    scale: 'xl',
    img: '/plates/qwen.png',
  },
  {
    vendor: 'GLM',
    models: ['glm-4-plus', 'glm-4-air'],
    span: 'md:col-span-2',
    scale: 'lg',
    img: '/plates/glm.png',
  },
  { vendor: 'Kimi', models: ['moonshot-v1'], span: 'md:col-span-2', scale: 'lg' },
  { vendor: 'Doubao', models: ['doubao-pro'], span: 'md:col-span-2', scale: 'lg' },
  { vendor: 'Hunyuan', models: ['hunyuan-turbo'], span: 'md:col-span-2', scale: 'md' },
  { vendor: 'Ernie', models: ['ernie-4.0'], span: 'md:col-span-2', scale: 'md' },
  { vendor: 'MiniMax', models: ['abab6.5'], span: 'md:col-span-2', scale: 'md' },
]

const VENDOR_SCALE: Record<Plate['scale'], string> = {
  xl: 'text-5xl md:text-6xl',
  lg: 'text-3xl md:text-4xl',
  md: 'text-2xl md:text-3xl',
}

/** Folio numerals — each plate is numbered like a print in an edition. */
const FOLIO = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

/**
 * Plates — the model wall. Each domestic vendor gets one editorial
 * "plate" on an asymmetric grid: giant serif wordmark, model ids set
 * small beneath, paper grain and a metal top hairline. Static; cards
 * reveal with a single fade-up when scrolled into view.
 */
export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  return (
    <section
      id='plates'
      className='border-border/60 relative border-t px-6 py-24 md:px-12 md:py-32'
    >
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-14 flex flex-wrap items-end justify-between gap-6'>
          <div className='relative'>
            {/* Giant emerald-outlined chapter numeral behind the heading */}
            <span
              aria-hidden
              className='font-serif text-[clamp(6rem,15vw,12rem)] leading-none font-semibold tracking-[0.06em] text-transparent opacity-[0.22] absolute -top-15 -left-3 select-none [-webkit-text-stroke:1.5px_var(--primary)]'
            >
              01
            </span>
            <p className='platinum-label relative z-10 mb-3 text-[11px] font-bold uppercase'>
              01 · {t('Domestic Model Matrix')}
            </p>
            <h2 className='relative z-10 font-serif text-3xl font-semibold tracking-wide md:text-4xl'>
              {t('Leading domestic models, one integration away')}
            </h2>
          </div>
          <Link
            to='/pricing'
            className='text-muted-foreground hover:text-foreground group inline-flex items-center gap-2 text-sm tracking-widest transition-colors'
          >
            {t('View Pricing')}
            <span
              aria-hidden
              className='bg-border group-hover:bg-[var(--platinum)] h-px w-8 transition-colors'
            />
          </Link>
        </AnimateInView>

        <div className='grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 md:grid-cols-6 md:gap-5'>
          {PLATES.map((plate, i) => (
            <AnimateInView
              key={plate.vendor}
              delay={(i % 4) * 80}
              className={`bg-card group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border/60 p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7 ${plate.span}`}
            >
              {plate.img && (
                <>
                  <img
                    src={plate.img}
                    alt=''
                    loading='lazy'
                    className='absolute inset-0 h-full w-full object-cover'
                  />
                  {/* Paper-tone scrim keeps overlaid text legible on the art */}
                  <div
                    aria-hidden
                    className='absolute inset-0 bg-[linear-gradient(180deg,rgba(246,240,226,0.78)_0%,rgba(246,240,226,0)_30%,rgba(246,240,226,0)_58%,rgba(246,240,226,0.72)_100%)]'
                  />
                </>
              )}
              <div
                aria-hidden
                className='platinum-hairline absolute inset-x-8 top-0 z-10 opacity-70'
              />
              <span
                aria-hidden
                className={`absolute top-5 right-6 z-10 font-mono text-[10px] tracking-[0.22em] opacity-75 ${
                  plate.img ? 'text-[#8a744a]' : 'text-[color:var(--platinum-ink)]'
                }`}
              >
                PL. {FOLIO[i]}
              </span>
              <h3
                className={`relative z-10 font-serif font-semibold tracking-[0.06em] ${VENDOR_SCALE[plate.scale]} ${
                  plate.img ? 'text-[#33291c]' : ''
                }`}
              >
                {plate.vendor}
              </h3>
              <div className='relative z-10 mt-6 flex flex-wrap gap-x-5 gap-y-1.5'>
                {plate.models.map((m) => (
                  <span
                    key={m}
                    className={`font-mono text-xs tracking-wider ${
                      plate.img ? 'text-[#6b5c42]' : 'text-muted-foreground'
                    }`}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
