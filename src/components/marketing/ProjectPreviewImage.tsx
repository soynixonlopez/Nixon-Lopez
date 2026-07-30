'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { isLivePreviewImage, toLivePreviewPrefetchUrl } from '@/lib/case-studies'

/** Espera tras prefetch para que thum.io termine la captura (ms) */
const LIVE_PREVIEW_READY_MS = 8000

type Props = {
  src: string
  alt: string
  sizes: string
  className?: string
  isDark?: boolean
}

export function ProjectPreviewImage({ src, alt, sizes, className = '', isDark = false }: Props) {
  const isLive = isLivePreviewImage(src)
  const [displaySrc, setDisplaySrc] = useState<string | null>(isLive ? null : src)
  const [loaded, setLoaded] = useState(!isLive)

  useEffect(() => {
    if (!isLive) {
      setDisplaySrc(src)
      setLoaded(false)
      return
    }

    let cancelled = false
    setDisplaySrc(null)
    setLoaded(false)

    async function prepareLivePreview() {
      try {
        await fetch(toLivePreviewPrefetchUrl(src), { mode: 'no-cors' })
      } catch {
        /* prefetch best-effort */
      }

      await new Promise((resolve) => setTimeout(resolve, LIVE_PREVIEW_READY_MS))

      if (!cancelled) {
        const separator = src.includes('?') ? '&' : '?'
        setDisplaySrc(`${src}${separator}cb=${Date.now()}`)
      }
    }

    prepareLivePreview()

    return () => {
      cancelled = true
    }
  }, [src, isLive])

  return (
    <>
      {!loaded && (
        <div
          className={`absolute inset-0 animate-pulse ${isDark ? 'bg-slate-800/90' : 'bg-slate-200/90'}`}
          aria-hidden
        />
      )}
      {displaySrc && (
        <Image
          src={displaySrc}
          alt={alt}
          fill
          unoptimized={isLive}
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        />
      )}
    </>
  )
}
