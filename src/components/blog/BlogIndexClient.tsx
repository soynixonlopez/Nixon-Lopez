'use client'

import { useMemo, useState } from 'react'
import { BlogFeaturedPost } from '@/components/blog/BlogFeaturedPost'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { BlogSearch } from '@/components/blog/BlogSearch'
import { BlogBreadcrumbs } from '@/components/blog/BlogBreadcrumbs'
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

  const filtering = Boolean(query.trim() || category)
  const featured = !filtering ? (filtered[0] ?? null) : null
  const list = filtering ? filtered : filtered.slice(1)

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div className="order-2 min-w-0 lg:order-1">
        <BlogSidebar
          mode="index"
          recentPosts={posts}
          categories={categories}
          categoryCounts={categoryCounts}
          totalCount={posts.length}
          activeCategory={category}
          searchQuery={query}
          onFilterChange={({ query: q, category: c }) => {
            setQuery(q)
            setCategory(c)
          }}
        />
      </div>

      <div className="order-1 min-w-0 lg:order-2">
        <BlogBreadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Recursos' },
          ]}
        />

        <div className="mt-5">
          <BlogSearch
            value={query}
            onChange={(value) => {
              setQuery(value)
            }}
          />
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {filtered.length} artículo{filtered.length === 1 ? '' : 's'} en el centro de recursos
          {category ? ` · ${category}` : ''}
        </p>

        <div className="mt-6 space-y-5">
          {featured ? <BlogFeaturedPost post={featured} /> : null}

          {list.length === 0 && !featured ? (
            <p className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              No hay artículos que coincidan con tu búsqueda.
            </p>
          ) : (
            list.map((post) => <BlogPostCard key={post.id} post={post} horizontal />)
          )}
        </div>
      </div>
    </div>
  )
}
