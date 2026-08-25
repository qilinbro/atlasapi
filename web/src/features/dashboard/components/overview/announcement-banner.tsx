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
import { Megaphone, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useStatus } from '@/hooks/use-status'

/**
 * Compact announcement strip above the dashboard content. Shows the latest
 * announcement published by the admin and hides itself when none exist or
 * after the user dismisses it (per session).
 */
export function AnnouncementBanner() {
  const { t } = useTranslation()
  const { status, loading } = useStatus()
  const [dismissed, setDismissed] = useState(false)

  if (loading || dismissed) return null

  const announcements =
    (status?.announcements as unknown as { content?: string }[] | undefined) ??
    []
  const announcement = announcements[0]
  if (!announcement?.content) return null

  return (
    <div className='bg-gradient-brand-soft text-foreground flex items-start gap-3 rounded-2xl border border-border/60 p-4 sm:items-center'>
      <div className='bg-primary/15 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl'>
        <Megaphone className='size-4.5' />
      </div>
      <p className='min-w-0 flex-1 text-sm leading-relaxed break-words line-clamp-2'>
        {announcement.content}
      </p>
      <button
        type='button'
        aria-label={t('Dismiss')}
        onClick={() => setDismissed(true)}
        className='text-muted-foreground hover:text-foreground -m-1 rounded-md p-1 transition-colors'
      >
        <X className='size-4' />
      </button>
    </div>
  )
}
