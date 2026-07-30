'use client'

import { useEffect } from 'react'

const REGISTER_ID = 'registro'
const MAX_ATTEMPTS = 40
const POLL_MS = 50

function scrollToRegister(behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(REGISTER_ID)
  if (!el) return false
  el.scrollIntoView({ behavior, block: 'start' })
  return true
}

/** Asegura que los enlaces #registro funcionen siempre, incluso antes de hidratar secciones lazy. */
export default function MasterclassScrollToRegister() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        `a[href="#${REGISTER_ID}"]`
      )
      if (!anchor) return

      event.preventDefault()

      if (scrollToRegister()) {
        window.history.pushState(null, '', `#${REGISTER_ID}`)
        return
      }

      let attempts = 0
      const timer = window.setInterval(() => {
        if (scrollToRegister() || ++attempts >= MAX_ATTEMPTS) {
          window.clearInterval(timer)
          if (attempts < MAX_ATTEMPTS) {
            window.history.pushState(null, '', `#${REGISTER_ID}`)
          }
        }
      }, POLL_MS)
    }

    document.addEventListener('click', onClick, true)

    if (window.location.hash === `#${REGISTER_ID}`) {
      window.requestAnimationFrame(() => {
        if (!scrollToRegister('auto')) {
          let attempts = 0
          const timer = window.setInterval(() => {
            if (scrollToRegister('auto') || ++attempts >= MAX_ATTEMPTS) {
              window.clearInterval(timer)
            }
          }, POLL_MS)
        }
      })
    }

    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
