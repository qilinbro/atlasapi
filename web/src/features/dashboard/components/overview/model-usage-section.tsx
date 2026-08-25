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
import { ArrowRight, Database } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { toIntlLocale } from '@/i18n/languages'
import { formatCompactNumber, formatQuota } from '@/lib/format'

export interface ModelUsageRow {
  modelName: string
  count: number
  tokens: number
  quota: number
}

const MAX_ROWS = 8

/** "By model" breakdown: a compact table of the top models for the selected
 * time range, linking to the full analytics dashboard. */
export function ModelUsageSection({
  rows,
  loading,
}: {
  rows: ModelUsageRow[]
  loading: boolean
}) {
  const { t, i18n } = useTranslation()
  const locale = toIntlLocale(i18n.resolvedLanguage || i18n.language)
  const visible = rows.slice(0, MAX_ROWS)

  return (
    <section className='bg-card rounded-2xl border p-6 shadow-[var(--shadow-md)]'>
      <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-2'>
        <div className='min-w-0'>
          <h3 className='text-foreground text-lg font-semibold tracking-tight'>
            {t('By Model')}
          </h3>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t(
              'Model calls, tokens and cost for the selected time range.'
            )}
          </p>
        </div>
        <Link
          to='/dashboard/$section'
          params={{ section: 'models' }}
          className='text-primary hover:text-primary/80 inline-flex shrink-0 items-center gap-1 text-sm font-medium transition-colors'
        >
          {t('All Models')}
          <ArrowRight className='size-4' />
        </Link>
      </div>

      <div className='mt-5'>
        {renderModelTableBody({ loading, visible, t, locale })}
      </div>
    </section>
  )
}

function renderModelTableBody({
  loading,
  visible,
  t,
  locale,
}: {
  loading: boolean
  visible: ModelUsageRow[]
  t: (key: string) => string
  locale: Intl.LocalesArgument
}) {
  if (loading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className='h-9 w-full' />
        ))}
      </div>
    )
  }

  if (visible.length === 0) {
    return (
      <div className='py-8'>
        <Empty className='border-none p-0'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <Database className='size-5' />
            </EmptyMedia>
            <EmptyTitle>{t('No model usage data')}</EmptyTitle>
            <EmptyDescription>
              {t('Model statistics will appear here after the first API call.')}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='text-muted-foreground border-b text-left text-xs font-semibold tracking-[0.06em] uppercase'>
            <th className='py-2.5 pr-4 font-semibold'>{t('Model')}</th>
            <th className='py-2.5 pr-4 text-right font-semibold'>
              {t('Requests')}
            </th>
            <th className='py-2.5 pr-4 text-right font-semibold'>
              {t('Tokens')}
            </th>
            <th className='py-2.5 text-right font-semibold'>{t('Cost')}</th>
          </tr>
        </thead>
        <tbody className='divide-border/60 divide-y'>
          {visible.map((row) => (
            <tr key={row.modelName} className='transition-colors'>
              <td className='py-3 pr-4'>
                <span className='text-foreground truncate font-medium'>
                  {row.modelName}
                </span>
              </td>
              <td className='py-3 pr-4 text-right tabular-nums'>
                {formatCompactNumber(row.count, locale)}
              </td>
              <td className='py-3 pr-4 text-right tabular-nums'>
                {formatCompactNumber(row.tokens, locale)}
              </td>
              <td className='py-3 text-right font-medium tabular-nums'>
                {formatQuota(row.quota)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
