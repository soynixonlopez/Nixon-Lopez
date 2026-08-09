import type { BlogPostRow } from '@/lib/blog'

/** Artículos relacionados: categoría → tags → recientes. Excluye el actual. */
export function getRelatedBlogPosts(
  current: BlogPostRow,
  all: BlogPostRow[],
  limit = 3,
): BlogPostRow[] {
  const others = all.filter((p) => p.id !== current.id && p.slug !== current.slug)
  if (!others.length) return []

  const tagSet = new Set(current.tags.map((t) => t.toLowerCase()))

  const scored = others.map((post) => {
    let score = 0
    if (post.category === current.category) score += 10
    for (const tag of post.tags) {
      if (tagSet.has(tag.toLowerCase())) score += 3
    }
    const t = new Date(post.published_at || post.created_at).getTime()
    score += Math.min(2, t / 1e15)
    return { post, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.post)
}

/** Prev/next por published_at (DESC: next = más reciente, prev = más antiguo). */
export function getAdjacentBlogPosts(
  current: BlogPostRow,
  all: BlogPostRow[],
): { previous: BlogPostRow | null; next: BlogPostRow | null } {
  const ordered = [...all].sort((a, b) => {
    const ta = new Date(a.published_at || a.created_at).getTime()
    const tb = new Date(b.published_at || b.created_at).getTime()
    return tb - ta
  })
  const idx = ordered.findIndex((p) => p.id === current.id || p.slug === current.slug)
  if (idx < 0) return { previous: null, next: null }
  return {
    next: idx > 0 ? ordered[idx - 1] : null,
    previous: idx < ordered.length - 1 ? ordered[idx + 1] : null,
  }
}

export function getPublishedCategories(posts: BlogPostRow[]): string[] {
  const set = new Set<string>()
  for (const post of posts) {
    if (post.category.trim()) set.add(post.category.trim())
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
}

export function filterPostsByQuery(posts: BlogPostRow[], query: string): BlogPostRow[] {
  const q = query.trim().toLowerCase()
  if (!q) return posts
  return posts.filter((post) => {
    const hay = `${post.title}\n${post.excerpt}\n${post.content}`.toLowerCase()
    return hay.includes(q)
  })
}

export function filterPostsByCategory(posts: BlogPostRow[], category: string | null): BlogPostRow[] {
  if (!category?.trim()) return posts
  return posts.filter((p) => p.category === category.trim())
}
