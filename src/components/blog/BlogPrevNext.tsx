import Link from 'next/link'
import { blogPostPath, type BlogPostRow } from '@/lib/blog'

type Props = {
  previous: BlogPostRow | null
  next: BlogPostRow | null
}

export function BlogPrevNext({ previous, next }: Props) {
  if (!previous && !next) return null

  return (
    <nav
      aria-label="Navegación entre artículos"
      className="mt-12 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2 dark:border-slate-800"
    >
      {previous ? (
        <Link
          href={blogPostPath(previous.slug)}
          className="group rounded-xl border border-slate-200 p-4 transition hover:border-brand/30 dark:border-slate-800"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            ← Artículo anterior
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-brand dark:text-white">
            {previous.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={blogPostPath(next.slug)}
          className="group rounded-xl border border-slate-200 p-4 text-right transition hover:border-brand/30 sm:justify-self-end dark:border-slate-800"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Artículo siguiente →
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-brand dark:text-white">
            {next.title}
          </p>
        </Link>
      ) : null}
    </nav>
  )
}
