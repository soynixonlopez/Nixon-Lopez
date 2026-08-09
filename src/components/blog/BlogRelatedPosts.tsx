import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { blogPostPath, type BlogPostRow } from '@/lib/blog'
import { blogSurface } from '@/components/blog/blog-ui'

type Props = {
  posts: BlogPostRow[]
}

export function BlogRelatedPosts({ posts }: Props) {
  if (!posts.length) return null

  return (
    <section aria-labelledby="related-posts-heading" className="mt-12">
      <h2
        id="related-posts-heading"
        className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
      >
        Siguiente lectura
      </h2>
      <ul className="mt-4 space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={blogPostPath(post.slug)}
              className={`group flex items-center justify-between gap-4 ${blogSurface} px-5 py-4 transition hover:border-brand/25`}
            >
              <span className="text-sm font-semibold text-slate-800 group-hover:text-brand dark:text-slate-100">
                {post.title}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-brand" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
