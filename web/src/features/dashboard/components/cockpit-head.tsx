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
import { KeyRound, Plus, Tags } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Atlas cockpit head — greeting + platinum quota card + quick actions.
 * Sits above the existing dashboard sections (which stay untouched).
 * Quota renders as the raw number, per the brand copy rules (no currency).
 */
export function CockpitHead() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.auth.user)

  const hour = new Date().getHours()
  const greetingKey =
    hour < 5
      ? 'Good night'
      : hour < 12
        ? 'Good morning'
        : hour < 18
          ? 'Good afternoon'
          : 'Good evening'
  const displayName = user?.display_name || user?.username || ''
  const dateLine = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className='platinum-panel relative overflow-hidden rounded-lg border border-border/60 p-5 sm:p-6'>
      <div aria-hidden className='platinum-hairline absolute inset-x-10 top-0' />
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div className='min-w-0'>
          <p className='platinum-label text-[10px] font-bold uppercase'>
            Atlas
          </p>
          <h2 className='mt-1.5 font-serif text-2xl font-semibold tracking-wide sm:text-[1.7rem]'>
            {t(greetingKey)}
            {displayName ? `，${displayName}` : ''}
          </h2>
          <p className='text-muted-foreground mt-1 text-xs'>{dateLine}</p>
        </div>
        <div className='text-right'>
          <p className='platinum-label text-[10px] font-bold uppercase'>
            {t('Remaining quota')}
          </p>
          <p className='font-serif text-3xl font-semibold tabular-nums sm:text-4xl'>
            {(user?.quota ?? 0).toLocaleString()}
          </p>
        </div>
      </div>
      <div className='mt-5 flex flex-wrap gap-2.5'>
        <Button
          size='sm'
          className='h-9 rounded-lg px-4 text-xs font-medium'
          render={<Link to='/wallet' />}
        >
          <Plus className='mr-1 size-3.5' />
          {t('Top up')}
        </Button>
        <Button
          size='sm'
          variant='outline'
          className='h-9 rounded-lg px-4 text-xs font-medium'
          render={<Link to='/keys' />}
        >
          <KeyRound className='mr-1 size-3.5' />
          {t('Create key')}
        </Button>
        <Button
          size='sm'
          variant='ghost'
          className='text-muted-foreground hover:text-foreground h-9 rounded-lg px-4 text-xs font-medium'
          render={<Link to='/pricing' />}
        >
          <Tags className='mr-1 size-3.5' />
          {t('View Pricing')}
        </Button>
      </div>
    </div>
  )
}
