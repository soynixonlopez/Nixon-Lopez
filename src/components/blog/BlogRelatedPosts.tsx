import { BlogPostCard } from '@/components/blog/BlogPostCard'
import type { BlogPostRow } from '@/lib/blog'

type Props = {
  posts: BlogPostRow[]
}

export function BlogRelatedPosts({ posts }: Props) {
  if (!posts.length) return null

  return (
    <section aria-labelledby="related-posts-heading" className="mt-14">
      <h2
        id="related-posts-heading"
        className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
      >
        También te puede interesar
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} compact />
        ))}
      </div>
    </section>
  )
}
