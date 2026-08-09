import type { ReactNode } from 'react'
import { clsx } from 'clsx'

type Props = {
  children: ReactNode
  className?: string
}

/** H2 de sección: grande como el hero, pero un poco menos (jerarquía clara). */
export function SectionTitle({ children, className }: Props) {
  return (
    <h2
      className={clsx('section-title tracking-tight text-slate-900 dark:text-slate-50', className)}
      style={{
        fontSize: 'clamp(2.2rem, 6.8vw, 3rem)',
        lineHeight: 1.15,
        fontWeight: 800,
        letterSpacing: '-0.03em',
      }}
    >
      {children}
    </h2>
  )
}
