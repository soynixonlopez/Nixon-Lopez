import Image from 'next/image'

type Props = {
  className?: string
  priority?: boolean
  alt?: string
  sizes?: string
}

/** Logo oficial — en claro se atenúa el fondo negro del asset */
export function BrandLogo({
  className = 'h-7 w-auto',
  priority = false,
  alt = 'Nixon Lopez',
  sizes = '200px',
}: Props) {
  return (
    <Image
      src="/images/logooficial.webp"
      alt={alt}
      width={1306}
      height={280}
      sizes={sizes}
      priority={priority}
      className={`object-contain object-left mix-blend-lighten dark:mix-blend-normal ${className}`}
    />
  )
}
