'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import type { Locale } from '@/i18n/types'

export function SiteProviders({
  children,
  initialLocale = 'es',
}: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <ThemeProvider defaultTheme="light" forcedTheme={isAdmin ? 'light' : undefined}>
      <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
    </ThemeProvider>
  )
}
