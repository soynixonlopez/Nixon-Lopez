import Link from 'next/link'

export type BlogCrumb = {
  label: string
  href?: string
}

type Props = {
  items: BlogCrumb[]
}

export function BlogBreadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Miga de pan" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-brand">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'line-clamp-1 text-slate-700 dark:text-slate-300' : undefined}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
