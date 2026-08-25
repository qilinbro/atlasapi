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
import { useEffect, useRef, useState } from 'react'

/** Glyph pool the code flickers through before settling (unfds.com style). */
const GLYPHS = '∅01/#—·<>{}/=+*$-_'

const DECODE_DURATION_MS = 1600
/** Near the end the remaining glyphs strobe between random and final. */
const STROBE_THRESHOLD = 0.8

interface StrobeCodeProps {
  text: string
  className?: string
}

/**
 * Strobe reveal for multi-line code: when the block scrolls into view the
 * text flickers through a random glyph pool, settling left-to-right, with a
 * final strobe phase before it locks in. Whitespace and newlines are kept
 * intact so the code layout never shifts. Renders the final text statically
 * under prefers-reduced-motion.
 */
export function StrobeCode({ text, className }: StrobeCodeProps) {
  const ref = useRef<HTMLElement>(null)
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    const el = ref.current
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (!el || reduceMotion) {
      setDisplay(text)
      return
    }

    // Hold a fully-scrambled placeholder until the block enters the viewport.
    const scrambleAll = () =>
      [...text]
        .map((ch) =>
          ch.trim() === '' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        )
        .join('')
    setDisplay(scrambleAll())

    let raf = 0
    const run = () => {
      const start = performance.now()
      const frame = (now: number) => {
        const progress = Math.min((now - start) / DECODE_DURATION_MS, 1)
        const settled = Math.floor(progress * text.length)
        let out = text.slice(0, settled)
        for (let i = settled; i < text.length; i++) {
          const ch = text[i]
          if (ch.trim() === '') {
            out += ch
          } else if (
            progress > STROBE_THRESHOLD &&
            Math.random() > 0.5 &&
            i < settled + text.length * (1 - STROBE_THRESHOLD)
          ) {
            // Strobe: tail characters blink between final and random.
            out += ch
          } else {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          }
        }
        setDisplay(out)
        if (progress < 1) raf = requestAnimationFrame(frame)
        else setDisplay(text)
      }
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          io.disconnect()
          run()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [text])

  return (
    <code ref={ref} className={className} aria-label={text}>
      {display}
    </code>
  )
}
