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
import { Coins, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { toIntlLocale } from '@/i18n/languages'
import { formatCompactNumber, formatNumber, formatQuota } from '@/lib/format'
import { useAuthStore } from '@/stores/auth-store'

export interface UsageStats {
  totalTokens: number
  totalQuota: number
  totalCount: number
  modelCount: number
  spanDays: number
}

interface StatRow {
  label: string
  value: string
}

function StatCardShell({
  icon,
  title,
  value,
  rows,
  loading,
}: {
  icon: React.ReactNode
  title: string
  value: string
  rows: StatRow[]
  loading: boolean
}) {
  return (
    <div className='bg-card relative overflow-hidden rounded-2xl border p-6 shadow-[var(--shadow-md)]'>
      <div className='flex items-center justify-between gap-3'>
        <h3 className='text-muted-foreground text-sm font-medium'>{title}</h3>
        <div className='bg-primary/15 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl'>
          {icon}
        </div>
      </div>

      {loading ? (
        <Skeleton className='mt-3 h-10 w-32' />
      ) : (
        <div className='text-gradient-brand mt-3 truncate text-4xl font-semibold tracking-tight tabular-nums'>
          {value}
        </div>
      )}

      <div className='divide-border/60 mt-5 border-t'>
        {rows.map((row) => (
          <div
            key={row.label}
            className='flex items-center justify-between gap-4 py-2.5 first:pt-3.5 last:pb-0'
          >
            <span className='text-muted-foreground text-sm'>{row.label}</span>
            {loading ? (
              <Skeleton className='h-4.5 w-20' />
            ) : (
              <span className='text-foreground text-sm font-medium tabular-nums'>
                {row.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Two summary cards: token usage and cost, following the reference
 * console layout (large headline number + four detail rows each). */
export function UsageStatCards({ stats, loading }: {
  stats: UsageStats | null
  loading: boolean
}) {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((state) => state.auth.user)
  const locale = toIntlLocale(i18n.resolvedLanguage || i18n.language)

  const s: UsageStats = stats ?? {
    totalTokens: 0,
    totalQuota: 0,
    totalCount: 0,
    modelCount: 0,
    spanDays: 1,
  }
  const safeCount = Math.max(s.totalCount, 1)
  const safeDays = Math.max(s.spanDays, 1)

  const compact = (value: number) =>
    value > 99999999
      ? formatCompactNumber(value, locale)
      : formatNumber(value, locale)

  const tokenRows: StatRow[] = [
    { label: t('Requests'), value: compact(s.totalCount) },
    { label: t('Models Used'), value: compact(s.modelCount) },
    {
      label: t('Avg Tokens / Request'),
      value: compact(Math.round(s.totalTokens / safeCount)),
    },
    {
      label: t('Avg Daily Tokens'),
      value: compact(Math.round(s.totalTokens / safeDays)),
    },
  ]

  const costRows: StatRow[] = [
    { label: t('Account Balance'), value: formatQuota(user?.quota ?? 0) },
    { label: t('Total Spent'), value: formatQuota(user?.used_quota ?? 0) },
    {
      label: t('Avg Cost / Request'),
      value: formatQuota(Math.round(s.totalQuota / safeCount)),
    },
    {
      label: t('Avg Daily Cost'),
      value: formatQuota(Math.round(s.totalQuota / safeDays)),
    },
  ]

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
      <StatCardShell
        icon={<Coins className='size-4.5' />}
        title={t('Total Tokens')}
        value={compact(s.totalTokens)}
        rows={tokenRows}
        loading={loading}
      />
      <StatCardShell
        icon={<Wallet className='size-4.5' />}
        title={t('Total Cost')}
        value={formatQuota(s.totalQuota)}
        rows={costRows}
        loading={loading}
      />
    </div>
  )
}
