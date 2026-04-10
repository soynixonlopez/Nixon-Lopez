'use client'

import { useEffect } from 'react'

export default function HashScroll() {
  useEffect(() => {
    const maxMs = 4000
    const tickMs = 120

    const tryScroll = (hash: string) => {
      if (!hash) return false
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return true
      }
      return false
    }

    const run = () => {
      const hash = window.location.hash
      if (!hash) return

      const start = Date.now()

      const t0 = window.setTimeout(() => {
        if (tryScroll(hash)) return
      }, 100)

      const i = window.setInterval(() => {
        if (tryScroll(hash)) {
          window.clearInterval(i)
          return
        }
        if (Date.now() - start > maxMs) {
          window.clearInterval(i)
        }
      }, tickMs)

      return () => {
        window.clearTimeout(t0)
        window.clearInterval(i)
      }
    }

    let cleanup: (() => void) | undefined
    cleanup = run()
    const onHash = () => {
      cleanup?.()
      cleanup = run()
    }
    window.addEventListener('hashchange', onHash)
    return () => {
      cleanup?.()
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  return null
}

