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

/**
 * Atlas brand mark — an angular serif "A" (the titan holding the sky)
 * on an emerald lacquer tile with a champagne hairline horizon.
 * Colors are CSS-variable driven, so light/dark modes adapt for free.
 */
export function AtlasMark(props: { className?: string }) {
  return (
    <svg
      viewBox='0 0 48 48'
      xmlns='http://www.w3.org/2000/svg'
      className={props.className}
      aria-hidden
    >
      <defs>
        <linearGradient id='atlas-mark-tile' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='var(--primary)' stopOpacity='0.96' />
          <stop offset='100%' stopColor='var(--primary)' />
        </linearGradient>
      </defs>
      <rect
        x='2'
        y='2'
        width='44'
        height='44'
        rx='10'
        fill='url(#atlas-mark-tile)'
        stroke='var(--platinum)'
        strokeOpacity='0.55'
      />
      {/* Serif "A" — solid peak with an open crossbar cut */}
      <path
        fillRule='evenodd'
        d='M24 10.5 L36.5 37.5 H31.4 L28.1 29.6 H19.9 L16.6 37.5 H11.5 Z M24 19.2 L26.7 25.6 H21.3 Z'
        fill='var(--platinum-matte)'
      />
      {/* Champagne horizon under the peak */}
      <path
        d='M13.5 41 H34.5'
        stroke='var(--platinum)'
        strokeWidth='1.4'
        strokeLinecap='round'
        opacity='0.9'
      />
    </svg>
  )
}
