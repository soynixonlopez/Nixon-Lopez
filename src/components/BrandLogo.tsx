import Image from 'next/image'

type Props = {
  className?: string
  priority?: boolean
  alt?: string
  sizes?: string
  /** Solo marca N, sin wordmark */
  markOnly?: boolean
}

/**
 * Logo legible en claro y oscuro.
 * El asset oficial tiene "nixonlopez" casi negro sobre negro; aquí usamos
 * la N + wordmark tipográfico con buen contraste.
 */
export function BrandLogo({
  className = '',
  priority = false,
  alt = 'Nixon Lopez',
  sizes = '48px',
  markOnly = false,
}: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 min-w-0 ${className}`}>
      <Image
        src="/images/favicon.png"
        alt=""
        width={128}
        height={128}
        sizes={sizes}
        priority={priority}
        className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
        aria-hidden
      />
      {markOnly ? null : (
        <span className="truncate text-[1.05rem] font-semibold leading-none tracking-tight sm:text-[1.2rem]">
          <span className="text-slate-900 dark:text-white">nixonlopez</span>
          <span className="brand-accent">.dev</span>
        </span>
      )}
      <span className="sr-only">{alt}</span>
    </span>
  )
}
