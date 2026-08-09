import Link from 'next/link'
import { quoteUrl } from '@/lib/marketing'

type Props = {
  title?: string
  description?: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  compact?: boolean
}

export function BlogCtaBox({
  title = '¿Tienes un proyecto en mente?',
  description = 'Cuéntame qué quieres construir y te ayudo a definir la solución adecuada.',
  primaryHref = quoteUrl(),
  primaryLabel = 'Solicitar cotización',
  secondaryHref,
  secondaryLabel,
  compact = false,
}: Props) {
  return (
    <aside
      className={
        compact
          ? 'rounded-xl border border-brand/15 bg-gradient-to-br from-brand/[0.05] to-transparent p-5'
          : 'rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/[0.06] to-transparent px-6 py-8 sm:px-8'
      }
    >
      <p
        className={
          compact
            ? 'text-base font-semibold text-slate-900 dark:text-white'
            : 'text-xl font-bold text-slate-900 dark:text-white'
        }
      >
        {title}
      </p>
      <p
        className={`mt-2 leading-relaxed text-slate-600 dark:text-slate-400 ${
          compact ? 'text-sm' : 'text-sm sm:text-base'
        }`}
      >
        {description}
      </p>
      <div className={`mt-4 flex flex-wrap gap-3 ${compact ? '' : 'mt-5'}`}>
        <Link
          href={primaryHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-light"
        >
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-brand/30 hover:text-brand dark:border-slate-700 dark:text-slate-200"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </aside>
  )
}
