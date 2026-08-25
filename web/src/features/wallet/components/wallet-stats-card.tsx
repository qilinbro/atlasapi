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
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { formatQuota } from '@/lib/format'

import type { UserWalletData } from '../types'

interface WalletStatsCardProps {
  user: UserWalletData | null
  loading?: boolean
}

export function WalletStatsCard(props: WalletStatsCardProps) {
  const { t } = useTranslation()

  const secondaryStats = [
    {
      label: t('Total Usage'),
      value: formatQuota(props.user?.used_quota ?? 0),
    },
    {
      label: t('API Requests'),
      value: (props.user?.request_count ?? 0).toLocaleString(),
    },
  ]

  if (props.loading) {
    return (
      <div className='rounded-2xl border p-6 sm:p-8'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='mt-3 h-12 w-40' />
        <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-24' />
        </div>
      </div>
    )
  }

  return (
    <div className='bg-card relative overflow-hidden rounded-2xl border p-6 shadow-[var(--shadow-md)] sm:p-8'>
      <div
        aria-hidden='true'
        className='bg-gradient-brand absolute inset-x-0 top-0 h-[3px]'
      />
      <div className='flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10'>
        <div className='flex min-w-0 shrink-0 flex-col gap-3 lg:w-72 xl:w-80'>
          <span className='text-muted-foreground text-sm font-medium'>
            {t('Current Balance')}
          </span>
          <div className='text-gradient-brand text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl'>
            {formatQuota(props.user?.quota ?? 0)}
          </div>
        </div>

        <div className='hidden w-px self-stretch bg-border lg:block' />

        <div className='grid min-w-0 flex-1 grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2'>
          {secondaryStats.map((stat) => (
            <div key={stat.label} className='flex min-w-0 flex-col gap-2'>
              <span className='text-muted-foreground text-sm font-medium'>
                {stat.label}
              </span>
              <div className='truncate text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl'>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
