'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Meta (Facebook) Pixel — solo rutas públicas (no /admin).
 * Carga diferida (idle / interacción) para no competir con LCP/TBT.
 */
export function MetaPixel() {
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const pixelId =
    process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || '3255546571298614'

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return

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

    const events: Array<keyof WindowEventMap> = ['scroll', 'pointerdown', 'keydown', 'touchstart']
    events.forEach((event) => window.addEventListener(event, enable, { once: true, passive: true }))

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(enable, { timeout: 4500 })
    } else {
      timeoutId = setTimeout(enable, 3500)
    }

    return cleanup
  }, [pathname])

  if (pathname?.startsWith('/admin') || !ready) return null

  const idJson = JSON.stringify(pixelId)

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="lazyOnload"
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
      <noscript>
        <img
          height={1}
          width={1}
          className="hidden"
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
