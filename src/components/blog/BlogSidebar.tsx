'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { BookOpen, Layers } from 'lucide-react'
import { blogPostPath, formatBlogDate, type BlogPostRow } from '@/lib/blog'
import { estimateReadingMinutes } from '@/lib/blog-reading'
import { BlogCtaBox } from '@/components/blog/BlogCtaBox'
import { BlogToc } from '@/components/blog/BlogToc'
import { blogSurface } from '@/components/blog/blog-ui'
import type { BlogTocItem } from '@/lib/blog-toc'

type Props = {
  recentPosts: BlogPostRow[]
  categories: string[]
  categoryCounts?: Record<string, number>
  totalCount?: number
  currentSlug?: string
  toc?: BlogTocItem[]
  onFilterChange?: (filters: { query: string; category: string | null }) => void
  activeCategory?: string | null
  searchQuery?: string
  mode?: 'index' | 'article'
}

export function BlogSidebar({
  recentPosts,
  categories,
  categoryCounts = {},
  totalCount = 0,
  currentSlug,
  toc,
  onFilterChange,
  activeCategory = null,
  searchQuery = '',
  mode = 'index',
}: Props) {
  const recent = useMemo(() => {
    return recentPosts
      .filter((p) => !currentSlug || p.slug !== currentSlug)
      .slice(0, 3)
  }, [recentPosts, currentSlug])

  const emitCategory = (category: string | null) => {
    onFilterChange?.({ query: searchQuery, category })
  }

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      {mode === 'index' ? (
        <div className={`${blogSurface} p-5`}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
            Filtrar recursos
          </p>

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              <BookOpen className="h-3.5 w-3.5 text-brand" aria-hidden />
              Tipo de contenido
            </div>
            <button
              type="button"
              onClick={() => emitCategory(null)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                !activeCategory
                  ? 'bg-brand/10 font-semibold text-brand ring-1 ring-brand/20'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              <span>Artículos</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800">
                {totalCount}
              </span>
            </button>
          </div>

          {categories.length > 0 ? (
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                <Layers className="h-3.5 w-3.5 text-brand" aria-hidden />
                Temas
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    type="button"
                    onClick={() => emitCategory(null)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      !activeCategory
                        ? 'bg-brand/10 font-semibold text-brand'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span>Todos los temas</span>
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => emitCategory(category)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        activeCategory === category
                          ? 'bg-brand/10 font-semibold text-brand ring-1 ring-brand/20'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                      }`}
                    >
                      <span className="line-clamp-2">{category}</span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800">
                        {categoryCounts[category] ?? 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {mode === 'article' && toc && toc.length > 0 ? (
        <div className="hidden lg:block">
          <BlogToc items={toc} />
        </div>
      ) : null}

      {mode === 'article' ? (
        <BlogCtaBox
          compact
          title="¿Tienes un proyecto en mente?"
          description="Hablemos sobre lo que quieres construir."
          primaryLabel="Solicitar cotización →"
        />
      ) : (
        <BlogCtaBox
          compact
          title="¿Quieres resultados, no solo contenido?"
          description="Te ayudo a definir la solución digital adecuada para tu negocio."
          primaryLabel="Solicitar cotización →"
        />
      )}

      {recent.length > 0 ? (
        <div className={`${blogSurface} p-5`}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
            Lecturas destacadas
          </p>
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {recent.map((post) => {
              const mins = estimateReadingMinutes(post.content || post.excerpt)
              return (
                <li key={post.id} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={blogPostPath(post.slug)}
                    className="block text-sm font-semibold leading-snug text-slate-800 transition hover:text-brand dark:text-slate-100"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">
                    {mins} min · {formatBlogDate(post.published_at || post.created_at)}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </aside>
  )
}
