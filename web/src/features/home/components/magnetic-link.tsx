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
import type { CSSProperties, ReactNode } from 'react'

import { useMagnetic } from '@/hooks/use-magnetic'
import { cn } from '@/lib/utils'

interface MagneticLinkProps {
  to: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * A router Link with a magnetic hover pull, used for the dark-luxe landing
 * CTAs. Transform writes bypass React state; disabled on touch / reduced
 * motion (see useMagnetic). Children are optional so the link can serve
 * as a Button `render` target, which injects its own children.
 */
export function MagneticLink({
  to,
  children,
  className,
  style,
}: MagneticLinkProps) {
  const ref = useMagnetic<HTMLAnchorElement>()
  return (
    <Link
      ref={ref}
      to={to}
      className={cn('inline-flex', className)}
      style={style}
    >
      {children}
    </Link>
  )
}
