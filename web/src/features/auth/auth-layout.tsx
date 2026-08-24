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

import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'

type AuthLayoutProps = {
  children: React.ReactNode
}

/**
 * Atlas auth shell — platinum-led split layout.
 * Left (lg+): champagne aurora panel with serif brand block.
 * Right: form area; every auth route (sign-in / sign-up / reset / otp)
 * renders inside, inheriting the global material layer.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()

  return (
    <div className='grid h-svh max-w-none lg:grid-cols-[11fr_9fr]'>
      {/* Brand panel — hidden on small screens */}
      <div
        className='relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-14'
        style={{ background: 'var(--canvas-grad)' }}
      >
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_40%,black_10%,transparent_100%)]'
        />
        <div
          aria-hidden
          className='platinum-hairline absolute inset-x-14 top-14'
        />

        <div className='relative'>
          <Link
            to='/'
            className='flex items-center gap-3 transition-opacity hover:opacity-80'
          >
            <div className='relative h-9 w-9'>
              {loading ? (
                <Skeleton className='absolute inset-0 rounded-full' />
              ) : (
                <img
                  src={logo}
                  alt={t('Logo')}
                  className='h-9 w-9 rounded-full object-cover'
                />
              )}
            </div>
            <span className='platinum-title font-serif text-lg font-semibold tracking-[0.3em] uppercase'>
              {systemName}
            </span>
          </Link>
        </div>

        <div className='relative max-w-md'>
          <h2 className='font-serif text-4xl leading-snug font-semibold tracking-wide'>
            {t('One key, every leading domestic model.')}
          </h2>
          <div className='platinum-hairline my-8 w-40' />
          <div className='flex flex-wrap gap-x-8 gap-y-2'>
            {[t('Domestic models'), t('Pay as you go'), t('Stable gateway')].map(
              (item) => (
                <span
                  key={item}
                  className='platinum-label text-xs font-medium'
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div
          aria-hidden
          className='platinum-hairline relative w-24 opacity-70'
        />
      </div>

      {/* Form area */}
      <div className='bg-background relative flex items-center justify-center px-4 py-10 sm:px-8'>
        <Link
          to='/'
          className='absolute top-6 left-6 z-10 flex items-center gap-2 transition-opacity hover:opacity-80 lg:hidden'
        >
          <div className='relative h-8 w-8'>
            {loading ? (
              <Skeleton className='absolute inset-0 rounded-full' />
            ) : (
              <img
                src={logo}
                alt={t('Logo')}
                className='h-8 w-8 rounded-full object-cover'
              />
            )}
          </div>
          <h1 className='font-serif text-lg font-medium tracking-[0.2em]'>
            {systemName}
          </h1>
        </Link>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 pt-14 sm:w-[440px] sm:p-8 lg:pt-0'>
          {children}
        </div>
      </div>
    </div>
  )
}
