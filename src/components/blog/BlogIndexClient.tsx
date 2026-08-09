'use client'

import { useMemo, useState } from 'react'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogSearch } from '@/components/blog/BlogSearch'
import type { BlogPostRow } from '@/lib/blog'
import { filterPostsByCategory, filterPostsByQuery } from '@/lib/blog-related'

type Props = {
  posts: BlogPostRow[]
  categories: string[]
}

export function BlogIndexClient({ posts, categories }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const post of posts) {
      counts[post.category] = (counts[post.category] || 0) + 1
    }
    return counts
  }, [posts])

  const filtered = useMemo(() => {
    return filterPostsByQuery(filterPostsByCategory(posts, category), query)
  }, [posts, query, category])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-xl">
        <BlogSearch value={query} onChange={setQuery} />
      </div>

      {categories.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              !category
                ? 'bg-brand text-white'
                : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:text-brand dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-700'
            }`}
          >
            Todos ({posts.length})
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                category === cat
                  ? 'bg-brand text-white'
                  : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:text-brand dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-700'
              }`}
            >
              {cat} ({categoryCounts[cat] ?? 0})
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-5 text-center text-sm text-slate-500">
        {filtered.length} artículo{filtered.length === 1 ? '' : 's'}
        {category ? ` · ${category}` : ''}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          No hay artículos que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
