'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

const PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || '3255546571298614'

/**
 * Meta (Facebook) Pixel — rutas públicas (no /admin).
 * Idle corto para no pegarle al LCP + PageView en navegación SPA.
 */
export function MetaPixel() {
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      setReady(false)
      return
    }

    let done = false
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const enable = () => {
      if (done) return
      done = true
      setReady(true)
      cleanup()
    }

    const cleanup = () => {
      events.forEach((event) => window.removeEventListener(event, enable))
      if (idleId != null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId != null) clearTimeout(timeoutId)
    }

    const events: Array<keyof WindowEventMap> = [
      'scroll',
      'pointerdown',
      'keydown',
      'touchstart',
    ]
    events.forEach((event) =>
      window.addEventListener(event, enable, { once: true, passive: true }),
    )

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(enable, { timeout: 1800 })
    } else {
      timeoutId = setTimeout(enable, 1200)
    }

    return cleanup
  }, [pathname])

  // PageViews adicionales al cambiar de ruta (el primer PageView lo dispara el script)
  useEffect(() => {
    if (!ready || pathname?.startsWith('/admin') || !pathname) return

    if (lastTracked.current === null) {
      lastTracked.current = pathname
      return
    }
    if (lastTracked.current === pathname) return

    const track = () => {
      if (typeof window.fbq !== 'function') return false
      lastTracked.current = pathname
      window.fbq('track', 'PageView')
      return true
    }

    if (track()) return

    const intervalId = window.setInterval(() => {
      if (track()) window.clearInterval(intervalId)
    }, 250)
    const timeoutId = window.setTimeout(() => window.clearInterval(intervalId), 6000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [ready, pathname])

  const noscript = (
    <noscript>
      <img
        height={1}
        width={1}
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${encodeURIComponent(PIXEL_ID)}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  )

  if (pathname?.startsWith('/admin') || !ready) return noscript

  const idJson = JSON.stringify(PIXEL_ID)

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${idJson});
fbq('track', 'PageView');
          `.trim(),
        }}
      />
      {noscript}
    </>
  )
}
