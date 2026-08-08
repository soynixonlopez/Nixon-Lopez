'use client'

import { usePathname } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { LocaleProvider } from '@/i18n/LocaleProvider'

export function SiteProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme={isAdmin ? 'light' : undefined}
      disableTransitionOnChange
    >
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  )
}
