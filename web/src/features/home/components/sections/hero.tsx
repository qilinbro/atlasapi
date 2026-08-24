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
import { ArrowRight, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

/**
 * Atlas hero — copy v.A (domestic-model narrative), platinum-led.
 * Layout: brand row → serif headline → single-sentence sub → CTAs.
 * Static quick-start card on the right (no typing / carousel motion).
 */
export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const docsUrl =
    (status?.docs_link as string | undefined) || 'https://docs.newapi.pro'

  const renderDocsButton = () => (
    <Button
      variant='outline'
      className='group hover:border-border h-11 items-center gap-1.5 rounded-lg px-5 text-sm font-medium'
      render={
        docsUrl.startsWith('http') ? (
          <a href={docsUrl} target='_blank' rel='noopener noreferrer' />
        ) : undefined
      }
    >
      <BookOpen className='text-muted-foreground/80 group-hover:text-foreground size-4 transition-colors duration-200' />
      <span>{t('Docs')}</span>
    </Button>
  )

  return (
    <section className='relative z-10 overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28'>
      {/* Champagne aurora — brand hues only, static */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-25'
        style={{ background: 'var(--canvas-grad)' }}
      />
      {/* Grid pattern, token-driven */}
      <div
        aria-hidden
        className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_20%,transparent_100%)] bg-[size:4rem_4rem] opacity-[0.10]'
      />

      <div className='mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8'>
        {/* Left: brand row → headline → sub → CTAs → supported apps */}
        <div className='flex flex-col items-start text-left lg:col-span-6'>
          <div className='landing-animate-fade-up platinum-title mb-6 font-serif text-sm font-semibold tracking-[0.55em] uppercase opacity-0'>
            Atlas
          </div>

          <h1
            className='landing-animate-fade-up font-serif text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.18] font-semibold tracking-tight opacity-0'
            style={{ animationDelay: '60ms' }}
          >
            {t('LLM API Service Platform')}
          </h1>
          <p
            className='landing-animate-fade-up text-muted-foreground mt-5 max-w-xl text-base leading-relaxed opacity-0 md:text-[15px]'
            style={{ animationDelay: '120ms' }}
          >
            {t('One key, every leading domestic model.')}
          </p>

          <div
            className='landing-animate-fade-up mt-8 flex flex-wrap items-center gap-3 opacity-0'
            style={{ animationDelay: '180ms' }}
          >
            {props.isAuthenticated ? (
              <>
                <Button
                  className='group h-11 rounded-lg px-5 text-sm font-medium'
                  render={<Link to='/dashboard' />}
                >
                  {t('Go to Dashboard')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                {renderDocsButton()}
              </>
            ) : (
              <>
                <Button
                  className='group h-11 rounded-lg px-5 text-sm font-medium'
                  render={<Link to='/sign-up' />}
                >
                  {t('Start Using')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                <Button
                  variant='outline'
                  className='hover:border-border h-11 rounded-lg px-5 text-sm font-medium'
                  render={<Link to='/pricing' />}
                >
                  {t('View Pricing')}
                </Button>
                {renderDocsButton()}
              </>
            )}
          </div>

          <div
            className='landing-animate-fade-up mt-10 w-full max-w-xl opacity-0'
            style={{ animationDelay: '240ms' }}
          >
            <span className='platinum-label text-[10px] font-bold uppercase'>
              {t('Trusted client apps')}
            </span>
            <p className='text-muted-foreground/60 mt-1.5 text-xs leading-relaxed'>
              {t('Works out of the box with popular chat clients.')}
            </p>
          </div>
        </div>

        {/* Right: static quick-start card, platinum panel */}
        <div
          className='landing-animate-fade-up flex w-full justify-center opacity-0 lg:col-span-6'
          style={{ animationDelay: '320ms' }}
        >
          <div className='platinum-panel relative mt-8 w-full max-w-lg overflow-hidden rounded-lg border border-border/70 lg:mt-0'>
            <div className='platinum-hairline absolute inset-x-8 top-0' />
            <div className='flex items-center justify-between border-b border-border/60 px-5 py-3'>
              <span className='platinum-label text-[10px] font-bold uppercase'>
                {t('Quick start')}
              </span>
              <div className='flex gap-1.5' aria-hidden>
                <span className='bg-border size-2 rounded-full' />
                <span className='bg-border size-2 rounded-full' />
                <span className='size-2 rounded-full bg-[var(--platinum)]/60' />
              </div>
            </div>
            <pre className='overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-6'>
              <code>
                <span className='text-muted-foreground'># {t('Replace with your Atlas key')}</span>
                {'\n'}
                <span className='emerald-accent'>curl</span> https://api.atlas.dev/v1/chat/completions {'\'\n'}
                {'  '}-H <span className='text-[var(--platinum-ink)]'>'Authorization: Bearer sk-...'</span> {'\'\n'}
                {'  '}-d {'\'{ "model": "deepseek-chat", "messages": [...] }\''}
              </code>
            </pre>
            <div className='border-t border-border/60 px-5 py-3.5'>
              <div className='flex flex-wrap gap-x-6 gap-y-1.5 text-xs'>
                <span className='text-muted-foreground'>
                  Base URL&nbsp;
                  <span className='text-foreground font-mono'>/v1</span>
                </span>
                <span className='text-muted-foreground'>
                  {t('Protocol')}&nbsp;
                  <span className='text-foreground'>OpenAI-compatible</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
