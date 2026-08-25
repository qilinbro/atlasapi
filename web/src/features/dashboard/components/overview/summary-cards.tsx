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
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserQuotaDates } from '@/features/dashboard/api'
import { useSummaryCardsConfig } from '@/features/dashboard/hooks/use-dashboard-config'
import { useStatus } from '@/hooks/use-status'
import { formatNumber, formatQuota } from '@/lib/format'
import { computeTimeRange } from '@/lib/time'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

function getRunwayDays(remainQuota: number, recentUsage: number): number | null {
  if (remainQuota <= 0 || recentUsage <= 0) return null
  const days = remainQuota / recentUsage
  if (!Number.isFinite(days)) return null
  return days
}

type HealthLevel = 'healthy' | 'caution' | 'critical'

function getHealthLevel(remainQuota: number, recentUsage: number): HealthLevel {
  if (remainQuota <= 0) return 'critical'
  const days = getRunwayDays(remainQuota, recentUsage)
  if (days !== null && days < 3) return 'caution'
  return 'healthy'
}

const HEALTH_DOT_CLASS: Record<HealthLevel, string> = {
  healthy: 'bg-success',
  caution: 'bg-warning',
  critical: 'bg-destructive',
}

export function SummaryCards() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.auth.user)
  const { loading } = useStatus()

  const summaryTimeRange = useMemo(() => computeTimeRange(1), [])
  const remainQuota = Number(user?.quota ?? 0)
  const usedQuota = Number(user?.used_quota ?? 0)
  const requestCount = Number(user?.request_count ?? 0)

  const usageTrendQuery = useQuery({
    queryKey: [
      'dashboard',
      'overview',
      'summary-sparklines',
      summaryTimeRange.start_timestamp,
      summaryTimeRange.end_timestamp,
    ],
    queryFn: async () =>
      getUserQuotaDates({
        start_timestamp: summaryTimeRange.start_timestamp,
        end_timestamp: summaryTimeRange.end_timestamp,
        default_time: 'hour',
      }),
    staleTime: 60 * 1000,
  })

  const recentUsage = useMemo(
    () =>
      (usageTrendQuery.data?.data ?? []).reduce(
        (total, item) => total + (Number(item.quota) || 0),
        0
      ),
    [usageTrendQuery.data?.data]
  )

  const healthLevel = getHealthLevel(remainQuota, recentUsage)
  const runwayDays = getRunwayDays(remainQuota, recentUsage)

  let runwayDisplay: string
  if (runwayDays !== null) {
    if (runwayDays < 1) {
      runwayDisplay = t('Less than 1 day left')
    } else if (runwayDays > 999) {
      runwayDisplay = `999+ ${t('days')}`
    } else {
      runwayDisplay = `~${formatNumber(Math.floor(runwayDays))} ${t('days')}`
    }
  } else if (remainQuota <= 0) {
    runwayDisplay = t('Balance depleted')
  } else {
    runwayDisplay = t('No recent usage')
  }

  const stats = useSummaryCardsConfig({
    usedDisplay: formatQuota(usedQuota),
    requestCountDisplay: formatNumber(requestCount),
    todayUsageDisplay: formatQuota(recentUsage),
  })

  return (
    <div className='bg-card relative overflow-hidden rounded-2xl border shadow-[var(--shadow-md)]'>
      <div
        aria-hidden='true'
        className='bg-gradient-brand absolute inset-x-0 top-0 h-[3px]'
      />
      <div className='flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:gap-10'>
        <div className='flex min-w-0 shrink-0 flex-col items-start gap-4 lg:w-72 xl:w-80'>
          <span className='text-muted-foreground text-sm font-medium'>
            {t('Credit remaining')}
          </span>

          {loading ? (
            <Skeleton className='h-12 w-40' />
          ) : (
            <div
              className={cn(
                'text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl',
                healthLevel !== 'critical' && 'text-gradient-brand',
                healthLevel === 'critical' && 'text-destructive'
              )}
            >
              {formatQuota(remainQuota)}
            </div>
          )}

          <div className='flex items-center gap-2 text-sm'>
            <span
              className={cn(
                'size-2 shrink-0 rounded-full',
                HEALTH_DOT_CLASS[healthLevel]
              )}
              aria-hidden='true'
            />
            <span
              className={cn(
                'text-muted-foreground',
                healthLevel === 'critical' && 'text-destructive',
                healthLevel === 'caution' && 'text-warning'
              )}
            >
              {runwayDisplay}
            </span>
          </div>

          <Button
            className='mt-1 h-12 w-full justify-between px-5 text-base'
            render={<Link to='/wallet' />}
          >
            <span>{t('Wallet')}</span>
            <ArrowRight data-icon='inline-end' />
          </Button>
        </div>

        <div className='hidden w-px self-stretch bg-border lg:block' />

        <div className='grid min-w-0 flex-1 grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3'>
          {stats.map((stat) => (
            <div key={stat.key} className='flex min-w-0 flex-col gap-2'>
              <span className='text-muted-foreground text-sm font-medium'>
                {stat.title}
              </span>
              {loading ? (
                <Skeleton className='h-9 w-24' />
              ) : (
                <div className='truncate text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl'>
                  {stat.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
