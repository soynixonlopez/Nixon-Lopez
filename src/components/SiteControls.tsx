'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Languages, Moon, Sun } from 'lucide-react'
import { useI18n } from '@/i18n/LocaleProvider'
import type { Locale } from '@/i18n/types'

type Props = {
  className?: string
  compact?: boolean
}

export function SiteControls({ className = '', compact = false }: Props) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { locale, setLocale, messages } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (resolvedTheme ?? theme) === 'dark'
  const nextLocale: Locale = locale === 'es' ? 'en' : 'es'

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={() => setLocale(nextLocale)}
        className={`inline-flex items-center justify-center gap-1.5 rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${
          compact ? 'h-9 min-w-9 px-2' : 'h-10 min-w-10 px-2.5'
        }`}
        aria-label={`${messages.common.language}: ${nextLocale.toUpperCase()}`}
        title={`${messages.common.language}: ${nextLocale.toUpperCase()}`}
      >
        <Languages className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-xs font-bold tracking-wide">{locale.toUpperCase()}</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={`inline-flex items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${
          compact ? 'h-9 w-9' : 'h-10 w-10'
        }`}
        aria-label={isDark ? messages.common.lightMode : messages.common.darkMode}
        title={isDark ? messages.common.lightMode : messages.common.darkMode}
      >
        {mounted ? (
          isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />
        ) : (
          <Moon className="h-4 w-4 opacity-0" aria-hidden />
        )}
      </button>
    </div>
  )
}
