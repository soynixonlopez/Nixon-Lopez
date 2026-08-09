'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { blogPostPath, type BlogPostRow } from '@/lib/blog'
import { BlogCtaBox } from '@/components/blog/BlogCtaBox'
import { BlogSearch } from '@/components/blog/BlogSearch'
import { BlogToc } from '@/components/blog/BlogToc'
import type { BlogTocItem } from '@/lib/blog-toc'

type Props = {
  recentPosts: BlogPostRow[]
  categories: string[]
  currentSlug?: string
  toc?: BlogTocItem[]
  /** Filtro controlado desde /blog (opcional). */
  onFilterChange?: (filters: { query: string; category: string | null }) => void
  activeCategory?: string | null
  showSearch?: boolean
}

export function BlogSidebar({
  recentPosts,
  categories,
  currentSlug,
  toc,
  onFilterChange,
  activeCategory = null,
  showSearch = true,
}: Props) {
  const [query, setQuery] = useState('')

  const recent = useMemo(() => {
    return recentPosts
      .filter((p) => !currentSlug || p.slug !== currentSlug)
      .slice(0, 3)
  }, [recentPosts, currentSlug])

  const emit = (nextQuery: string, nextCategory: string | null) => {
    onFilterChange?.({ query: nextQuery, category: nextCategory })
  }

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      {showSearch ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <BlogSearch
            value={query}
            onChange={(value) => {
              setQuery(value)
              emit(value, activeCategory)
            }}
          />
        </div>
      ) : null}

      {toc && toc.length > 0 ? (
        <div className="hidden lg:block">
          <BlogToc items={toc} />
        </div>
      ) : null}

      {categories.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Categorías
          </p>
          <ul className="mt-3 space-y-1.5">
            {onFilterChange ? (
              <>
                <li>
                  <button
                    type="button"
                    onClick={() => emit(query, null)}
                    className={`w-full rounded-lg px-2.5 py-2 text-left text-sm transition ${
                      !activeCategory
                        ? 'bg-brand/10 font-medium text-brand'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`}
                  >
                    Todas
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => emit(query, category)}
                      className={`w-full rounded-lg px-2.5 py-2 text-left text-sm transition ${
                        activeCategory === category
                          ? 'bg-brand/10 font-medium text-brand'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </>
            ) : (
              categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/blog#categoria-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block rounded-lg px-2.5 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-brand dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    {category}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      {recent.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Artículos recientes
          </p>
          <ol className="mt-3 space-y-3">
            {recent.map((post, index) => (
              <li key={post.id} className="flex gap-3">
                <span className="mt-0.5 text-xs font-semibold text-slate-400">
                  {index + 1}.
                </span>
                <Link
                  href={blogPostPath(post.slug)}
                  className="text-sm font-medium leading-snug text-slate-700 transition hover:text-brand dark:text-slate-200"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <BlogCtaBox
        compact
        title="¿Tienes un proyecto?"
        description="Cuéntame qué quieres construir."
      />
    </aside>
  )
}
