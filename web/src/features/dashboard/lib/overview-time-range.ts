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
export type TimeRangePreset = 'today' | '7d' | '14d' | '30d' | 'all' | 'custom'

function toUnixDays(dateStr: string, endOfDay: boolean): number {
  const date = new Date(`${dateStr}T00:00:00`)
  if (endOfDay) date.setHours(23, 59, 59)
  return Math.floor(date.getTime() / 1000)
}

/** Resolve a preset (plus optional custom dates) into a unix second range.
 * Returns null while a custom range is incomplete or invalid. */
export function resolveTimeRange(
  preset: TimeRangePreset,
  customStart: string,
  customEnd: string
): { start: number; end: number } | null {
  const now = Math.floor(Date.now() / 1000)
  switch (preset) {
    case 'today': {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      return { start: Math.floor(d.getTime() / 1000), end: now }
    }
    case '7d':
      return { start: now - 7 * 86400, end: now }
    case '14d':
      return { start: now - 14 * 86400, end: now }
    case '30d':
      return { start: now - 30 * 86400, end: now }
    case 'all':
      return { start: 0, end: now }
    case 'custom': {
      if (!customStart || !customEnd) return null
      const start = toUnixDays(customStart, false)
      const end = toUnixDays(customEnd, true)
      if (Number.isNaN(start) || Number.isNaN(end) || start > end) return null
      return { start, end }
    }
  }
}
