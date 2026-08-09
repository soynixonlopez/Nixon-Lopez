'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
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

  const setLang = (next: Locale) => {
    if (next !== locale) setLocale(next)
  }

  const langBtn =
    'inline-flex items-center bg-transparent p-0 text-[12px] font-semibold tracking-wide transition-colors sm:text-[13px]'
  const idle = 'text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-200'
  const active =
    'text-slate-900 underline decoration-brand decoration-2 underline-offset-[5px] dark:text-white dark:decoration-cyan-400'

  return (
    <nav
      aria-label={`${messages.common.language}, ${messages.common.theme}`}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <button
        type="button"
        onClick={() => setLang('es')}
        aria-pressed={locale === 'es'}
        className={`${langBtn} ${locale === 'es' ? active : idle}`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={locale === 'en'}
        className={`${langBtn} ${locale === 'en' ? active : idle}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? messages.common.lightMode : messages.common.darkMode}
        title={isDark ? messages.common.lightMode : messages.common.darkMode}
        className={`inline-flex items-center justify-center bg-transparent p-0 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white ${
          compact ? 'h-8 w-8' : 'h-9 w-9'
        }`}
      >
        {mounted ? (
          isDark ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden /> : <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
        ) : (
          <Moon className="h-[18px] w-[18px] opacity-0" aria-hidden />
        )}
      </button>
    </nav>
  )
}
