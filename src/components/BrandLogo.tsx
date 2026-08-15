import Image from 'next/image'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'

type Props = {
  className?: string
  priority?: boolean
  alt?: string
  sizes?: string
  /** Solo marca N, sin wordmark */
  markOnly?: boolean
  /**
   * `official` = logooficial.png (cotización, contrato, panel admin).
   * `default` = N + wordmark tipográfico (sitio público claro/oscuro).
   */
  variant?: 'default' | 'official'
}

/**
 * Logo de marca.
 * - default: favicon + wordmark (buen contraste en header/footer público)
 * - official: logooficial.png (documentos y panel admin)
 */
export function BrandLogo({
  className = '',
  priority = false,
  alt = 'Nixon Lopez',
  sizes = '48px',
  markOnly = false,
  variant = 'default',
}: Props) {
  if (variant === 'official') {
    if (markOnly) {
      return (
        <span className={`inline-flex shrink-0 items-center ${className}`}>
          <Image
            src={INVOICE_BRANDING.logoPath}
            alt={alt}
            width={88}
            height={88}
            sizes={sizes}
            priority={priority}
            className="h-9 w-9 rounded-md object-cover object-left sm:h-10 sm:w-10"
          />
        </span>
      )
    }

    return (
      <span className={`inline-flex min-w-0 items-center ${className}`}>
        <Image
          src={INVOICE_BRANDING.logoPath}
          alt={alt}
          width={1774}
          height={887}
          sizes={sizes}
          priority={priority}
          className="h-8 w-auto max-w-[min(100%,200px)] object-contain object-left sm:h-9"
        />
      </span>
    )
  }

  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
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
