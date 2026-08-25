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
import { useEffect, useMemo, useState } from 'react'

import { ROLE } from '@/lib/roles'
import { useAuthStore } from '@/stores/auth-store'

import { getUserQuotaDates } from '../../api'
import {
  buildQueryParams,
  resolveTimeRange,
  type TimeRangePreset,
} from '../../lib'
import type { QuotaDataItem } from '../../types'
import { AnnouncementBanner } from './announcement-banner'
import { ModelUsageSection, type ModelUsageRow } from './model-usage-section'
import { PerformanceHealthPanel } from './performance-health-panel'
import { TimeRangeFilter } from './time-range-filter'
import { UsageStatCards, type UsageStats } from './usage-stat-cards'

/**
 * Console home following the reference layout: announcement strip, time-range
 * filter, two summary cards (tokens / cost), per-model breakdown, and the
 * admin-only performance panel.
 */
export function OverviewDashboard() {
  const user = useAuthStore((state) => state.auth.user)
  const isAdmin = Boolean(user?.role && user.role >= ROLE.ADMIN)

  const [preset, setPreset] = useState<TimeRangePreset>('today')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<QuotaDataItem[]>([])

  const range = useMemo(
    () => resolveTimeRange(preset, customStart, customEnd),
    [preset, customStart, customEnd]
  )

  useEffect(() => {
    if (!range) return
    const abortController = new AbortController()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)

    void getUserQuotaDates(
      buildQueryParams({
        start_timestamp: range.start,
        end_timestamp: range.end,
      }),
      isAdmin
    )
      .then((res) => {
        if (abortController.signal.aborted) return
        setData(res?.data || [])
      })
      .catch(() => {
        if (abortController.signal.aborted) return
        setData([])
      })
      .finally(() => {
        if (!abortController.signal.aborted) setLoading(false)
      })

    return () => {
      abortController.abort()
    }
  }, [range, isAdmin])

  const stats: UsageStats | null = useMemo(() => {
    if (!range) return null
    const spanDays = Math.max(
      1,
      Math.ceil((range.end - range.start) / 86400)
    )
    const modelAgg = aggregateByModel(data)
    return {
      totalTokens: data.reduce((sum, d) => sum + (Number(d.token_used) || 0), 0),
      totalQuota: data.reduce((sum, d) => sum + (Number(d.quota) || 0), 0),
      totalCount: data.reduce((sum, d) => sum + (Number(d.count) || 0), 0),
      modelCount: modelAgg.length,
      spanDays: preset === 'all' ? Math.max(spanDays, 1) : spanDays,
    }
  }, [data, range, preset])

  const modelRows = useMemo(() => aggregateByModel(data), [data])

  return (
    <div className='flex flex-col gap-4'>
      <AnnouncementBanner />

      <TimeRangeFilter
        value={preset}
        customStart={customStart}
        customEnd={customEnd}
        onPresetChange={setPreset}
        onCustomRangeChange={(start, end) => {
          setCustomStart(start)
          setCustomEnd(end)
        }}
      />

      <UsageStatCards stats={stats} loading={loading || !range} />

      <ModelUsageSection rows={modelRows} loading={loading} />

      {isAdmin && <PerformanceHealthPanel />}
    </div>
  )
}

function aggregateByModel(data: QuotaDataItem[]): ModelUsageRow[] {
  const map = new Map<string, ModelUsageRow>()
  for (const item of data) {
    const name = item.model_name || 'unknown'
    const row = map.get(name) ?? { modelName: name, count: 0, tokens: 0, quota: 0 }
    row.count += Number(item.count) || 0
    row.tokens += Number(item.token_used) || 0
    row.quota += Number(item.quota) || 0
    map.set(name, row)
  }
  return [...map.values()].sort((a, b) => b.quota - a.quota)
}
