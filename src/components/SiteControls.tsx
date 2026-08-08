'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useI18n } from '@/i18n/LocaleProvider'
import type { Locale } from '@/i18n/types'

type Props = {
  className?: string
  compact?: boolean
}

/** Glifo propio: puente ES↔EN (no el icono genérico de traducción) */
function LocaleBridgeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4.5 8.5c2.8-3.2 7.2-3.2 10 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9.5 15.5c2.8 3.2 7.2 3.2 10 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="7" cy="9.2" r="1.35" fill="currentColor" />
      <circle cx="17" cy="14.8" r="1.35" fill="currentColor" />
      <path
        d="M11 7.2v9.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="0.2 2.4"
        opacity="0.55"
      />
      <path
        d="M10.1 11.2h3.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
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
        className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-transparent text-slate-600 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white ${
          compact ? 'h-9 px-2' : 'h-10 px-2.5'
        }`}
        aria-label={`${messages.common.language}: ${nextLocale.toUpperCase()}`}
        title={`${messages.common.language}: ${nextLocale.toUpperCase()}`}
      >
        <LocaleBridgeIcon className={compact ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />
        <span className="flex items-center gap-1 text-[11px] font-bold tracking-[0.12em]">
          <span className={locale === 'es' ? 'brand-accent-solid' : 'opacity-35'}>ES</span>
          <span className="opacity-30" aria-hidden>
            /
          </span>
          <span className={locale === 'en' ? 'brand-accent-solid' : 'opacity-35'}>EN</span>
        </span>
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
