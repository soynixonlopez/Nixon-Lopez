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
import { useServerInsertedHTML } from 'next/navigation'

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: Theme
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = 'theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Script SSR fuera del árbol React (evita el warning de React 19 / Next 16). */
const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(STORAGE_KEY)};var t=localStorage.getItem(k);var d=document.documentElement;if(t==='dark'){d.classList.add('dark');d.style.colorScheme='dark';}else{d.classList.remove('dark');d.style.colorScheme='light';}}catch(e){}})();`

function applyThemeClass(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }
}

type Props = {
  children: ReactNode
  /** Fuerza un tema (p. ej. admin siempre claro) */
  forcedTheme?: Theme
  defaultTheme?: Theme
}

export function ThemeProvider({
  children,
  forcedTheme,
  defaultTheme = 'light',
}: Props) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [ready, setReady] = useState(false)

  useServerInsertedHTML(() => (
    <script
      id="nl-theme-init"
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
    />
  ))

  useEffect(() => {
    if (forcedTheme) {
      applyThemeClass(forcedTheme)
      setThemeState(forcedTheme)
      setReady(true)
      return
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const next: Theme = stored === 'dark' ? 'dark' : 'light'
      setThemeState(next)
      applyThemeClass(next)
    } catch {
      applyThemeClass(defaultTheme)
    }
    setReady(true)
  }, [forcedTheme, defaultTheme])

  const setTheme = useCallback(
    (next: Theme) => {
      if (forcedTheme) return
      setThemeState(next)
      applyThemeClass(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
    },
    [forcedTheme],
  )

  const value = useMemo<ThemeContextValue>(() => {
    const resolved = forcedTheme ?? theme
    return {
      theme: resolved,
      resolvedTheme: resolved,
      setTheme,
    }
  }, [forcedTheme, setTheme, theme])

  // Evita mismatch visual breve; el script SSR ya aplicó la clase
  if (!ready && !forcedTheme) {
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
