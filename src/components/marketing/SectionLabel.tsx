import type { ReactNode } from 'react'
import { clsx } from 'clsx'

type Props = {
  children: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/** Etiqueta de sección sin pill ni mayúsculas espaciadas (evita look genérico/IA). */
export function SectionLabel({ children, align = 'center', className }: Props) {
  return (
    <p
      className={clsx(
        'mb-4 flex items-center gap-2.5 text-sm font-medium text-brand',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      )}
    >
      <span className="h-px w-5 shrink-0 bg-brand/50" aria-hidden />
      <span>{children}</span>
    </p>
  )
}
