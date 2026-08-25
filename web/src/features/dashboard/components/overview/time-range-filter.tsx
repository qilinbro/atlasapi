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

import { Input } from '@/components/ui/input'
import type { TimeRangePreset } from '@/features/dashboard/lib'
import { cn } from '@/lib/utils'

const PRESETS: { key: TimeRangePreset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 Days' },
  { key: '14d', label: '14 Days' },
  { key: '30d', label: '30 Days' },
  { key: 'all', label: 'All' },
  { key: 'custom', label: 'Custom' },
]

interface TimeRangeFilterProps {
  value: TimeRangePreset
  customStart: string
  customEnd: string
  onPresetChange: (preset: TimeRangePreset) => void
  onCustomRangeChange: (start: string, end: string) => void
}

/** Segmented time-range pills with inline date pickers for the custom
 * range, mirroring the reference console layout. */
export function TimeRangeFilter(props: TimeRangeFilterProps) {
  const { t } = useTranslation()
  const { value, customStart, customEnd } = props

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='bg-card inline-flex max-w-full flex-wrap items-center gap-1 rounded-xl border p-1'>
        {PRESETS.map((preset) => (
          <button
            key={preset.key}
            type='button'
            onClick={() => props.onPresetChange(preset.key)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
              value === preset.key
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            {t(preset.label)}
          </button>
        ))}
      </div>

      {value === 'custom' && (
        <div className='flex items-center gap-2'>
          <Input
            type='date'
            aria-label={t('Start date')}
            value={customStart}
            max={customEnd || undefined}
            onChange={(e) =>
              props.onCustomRangeChange(e.target.value, customEnd)
            }
            className='h-9 w-38'
          />
          <span className='text-muted-foreground text-sm'>–</span>
          <Input
            type='date'
            aria-label={t('End date')}
            value={customEnd}
            min={customStart || undefined}
            onChange={(e) =>
              props.onCustomRangeChange(customStart, e.target.value)
            }
            className='h-9 w-38'
          />
        </div>
      )}
    </div>
  )
}
