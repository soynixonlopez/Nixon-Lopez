'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getMessages, type Messages } from '@/i18n/messages'
import type { Locale } from '@/i18n/types'

const STORAGE_KEY = 'nl-locale'
const COOKIE_KEY = 'nl-locale'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: Messages
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function isLocale(value: string | undefined | null): value is Locale {
  return value === 'en' || value === 'es'
}

function persistLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
    document.cookie = `${COOKIE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`
  } catch {
    /* ignore */
  }
}

type Props = {
  children: ReactNode
  /** Locale leído en el servidor (cookie) para evitar mismatch de hidratación */
  initialLocale?: Locale
}

export function LocaleProvider({ children, initialLocale = 'es' }: Props) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    try {
      const fromStorage = window.localStorage.getItem(STORAGE_KEY)
      if (isLocale(fromStorage)) setLocaleState(fromStorage)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    persistLocale(locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      messages: getMessages(locale),
    }),
    [locale, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useI18n must be used within LocaleProvider')
  }
  return ctx
}

export function useMessages() {
  return useI18n().messages
}
