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

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'es'
  try {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY)
    if (fromStorage === 'en' || fromStorage === 'es') return fromStorage
    const match = document.cookie.match(/(?:^|; )nl-locale=(en|es)/)
    if (match?.[1] === 'en' || match?.[1] === 'es') return match[1]
  } catch {
    /* ignore */
  }
  return 'es'
}

function persistLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
    document.cookie = `${COOKIE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`
  } catch {
    /* ignore */
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = readStoredLocale()
    setLocaleState(stored)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    document.documentElement.lang = locale
    persistLocale(locale)
  }, [locale, ready])

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
