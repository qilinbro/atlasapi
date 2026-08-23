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
import { Link, useSearch } from '@tanstack/react-router'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { useTranslation } from 'react-i18next'

import { useStatus } from '@/hooks/use-status'

import { AuthLayout } from '../auth-layout'
import { TermsFooter } from '../components/terms-footer'
import { UserAuthForm } from './components/user-auth-form'

// 基元律动入场：节拍器式等距交错，与涟漪背景同频
const SIGN_IN_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const signInContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.55 },
  },
}

const signInItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: SIGN_IN_EASE },
  },
}

export function SignIn() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const { status } = useStatus()

  const title = t('Sign in')
  // Unique, content-derived keys so repeated characters don't collide.
  const titleChars = [...title].map((ch, i) => ({ ch, key: `${i}-${ch}` }))

  return (
    <AuthLayout>
      <motion.div
        variants={signInContainerVariants}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        animate='visible'
        className='w-full space-y-6'
      >
        <motion.div variants={signInItemVariants} className='space-y-3'>
          {/* Mono overline — 工坊铭牌 */}
          <p className='text-primary/80 font-mono text-[10px] font-medium tracking-[0.3em] uppercase'>
            Atlas · Sign In
          </p>
          {/* 展示标题：艺术毛笔楷书，逐字上浮揭示 */}
          <h2
            aria-label={title}
            className='font-artistic text-primary/95 text-[clamp(2.75rem,6vw,3.5rem)] leading-[1.1] tracking-normal'
          >
            {titleChars.map(({ ch, key }, i) => (
              <span
                key={key}
                aria-hidden='true'
                className='luxe-char'
                style={{ '--d': `${0.6 + i * 0.07}s` } as React.CSSProperties}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h2>
          {!status?.self_use_mode_enabled &&
            status?.register_enabled !== false && (
              <p className='text-muted-foreground pt-1 text-left text-sm sm:text-base'>
                {t("Don't have an account?")}{' '}
                <Link
                  to='/sign-up'
                  className='hover:text-primary font-medium underline underline-offset-4'
                >
                  {t('Sign up')}
                </Link>
                .
              </p>
            )}
        </motion.div>

        <motion.div variants={signInItemVariants}>
          <UserAuthForm redirectTo={redirect} />
        </motion.div>

        <motion.div variants={signInItemVariants}>
          <TermsFooter
            variant='sign-in'
            status={status}
            className='text-center'
          />
        </motion.div>
      </motion.div>
    </AuthLayout>
  )
}
