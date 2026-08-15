'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/i18n/LocaleProvider'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          elementId: string,
        ) => void
      }
    }
  }
}

const SCRIPT_ID = 'google-translate-element-js'
const HOST_ID = 'google_translate_element_host'

function setGoogleTranslateLanguage(lang: 'es' | 'en') {
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  if (!combo) return false
  const value = lang === 'en' ? 'en' : 'es'
  if (combo.value !== value) {
    combo.value = value
    combo.dispatchEvent(new Event('change'))
  }
  return true
}

/** Traduce la página (incl. artículos CMS) al cambiar ES/EN. */
export function GooglePageTranslate() {
  const { locale } = useI18n()
  const pathname = usePathname()
  const initRef = useRef(false)
  const skipAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    if (skipAdmin) return

    window.googleTranslateElementInit = () => {
      const host = document.getElementById(HOST_ID)
      if (!host || !window.google?.translate?.TranslateElement) return
      if (!initRef.current) {
        // eslint-disable-next-line no-new
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'es',
            includedLanguages: 'es,en',
            autoDisplay: false,
          },
          HOST_ID,
        )
        initRef.current = true
      }
      setGoogleTranslateLanguage(locale === 'en' ? 'en' : 'es')
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit()
    }
  }, [skipAdmin, locale])

  useEffect(() => {
    if (skipAdmin) return
    let tries = 0
    const timer = window.setInterval(() => {
      tries += 1
      const ok = setGoogleTranslateLanguage(locale === 'en' ? 'en' : 'es')
      if (ok || tries > 40) window.clearInterval(timer)
    }, 250)
    return () => window.clearInterval(timer)
  }, [locale, skipAdmin, pathname])

  if (skipAdmin) return null

  return (
    <div
      id={HOST_ID}
      className="pointer-events-none fixed bottom-0 left-0 -z-10 h-px w-px overflow-hidden opacity-0"
      aria-hidden
    />
  )
}
