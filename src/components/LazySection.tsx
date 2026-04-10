'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type LazySectionProps = {
  children: ReactNode
  /** Clases del placeholder mientras no se monta el contenido (reduce CLS). */
  minHeight?: string
  /** Margen extra al viewport para empezar a cargar antes del scroll (solo scroll natural). */
  rootMargin?: string
}

/**
 * Monta `children` solo cuando el bloque entra en el viewport (IntersectionObserver).
 * Reduce JS inicial y TBT en la home: los chunks de framer-motion bajo el pliegue no se piden hasta el scroll.
 */
export default function LazySection({
  children,
  minHeight = 'min-h-[22rem]',
  rootMargin = '0px 0px 180px 0px',
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { root: null, rootMargin, threshold: 0 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} className={!visible ? minHeight : undefined}>
      {visible ? children : null}
    </div>
  )
}
