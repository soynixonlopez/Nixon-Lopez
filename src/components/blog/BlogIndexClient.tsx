'use client'

import { useMemo, useState } from 'react'
import { BlogFeaturedPost } from '@/components/blog/BlogFeaturedPost'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { BlogCtaBox } from '@/components/blog/BlogCtaBox'
import type { BlogPostRow } from '@/lib/blog'
import { filterPostsByCategory, filterPostsByQuery } from '@/lib/blog-related'

type Props = {
  posts: BlogPostRow[]
  categories: string[]
}

export function BlogIndexClient({ posts, categories }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const filtering = Boolean(query.trim() || category)
  const featured = !filtering ? (posts[0] ?? null) : null

  const list = useMemo(() => {
    if (filtering) {
      return filterPostsByQuery(filterPostsByCategory(posts, category), query)
    }
    return posts.slice(1)
  }, [posts, filtering, query, category])

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
      <div className="min-w-0">
        {featured ? (
          <div className="mb-12">
            <BlogFeaturedPost post={featured} />
          </div>
        ) : null}

        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {filtering ? 'Resultados' : 'Últimos artículos'}
          </h2>
          {filtering ? (
            <p className="mt-2 text-sm text-slate-500">
              {list.length} artículo{list.length === 1 ? '' : 's'} encontrado
              {list.length === 1 ? '' : 's'}
            </p>
          ) : null}
        </div>

        {list.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {filtering
              ? 'No hay artículos que coincidan con tu búsqueda.'
              : 'Pronto publicaremos más artículos.'}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {list.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="mt-12 lg:hidden">
          <BlogCtaBox />
        </div>
      </div>

      <div className="min-w-0">
        <BlogSidebar
          recentPosts={posts}
          categories={categories}
          activeCategory={category}
          onFilterChange={({ query: q, category: c }) => {
            setQuery(q)
            setCategory(c)
          }}
        />
      </div>
    </div>
  )
}
