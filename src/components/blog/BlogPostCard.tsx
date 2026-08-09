import Image from 'next/image'
import Link from 'next/link'
import { blogPostPath, formatBlogDate, type BlogPostRow } from '@/lib/blog'

type Props = {
  post: BlogPostRow
}

export function BlogPostCard({ post }: Props) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand/25 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <Link href={blogPostPath(post.slug)} className="relative block aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
        {post.featured_image_url ? (
          <Image
            src={post.featured_image_url}
            alt={post.featured_image_alt || post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">{post.category}</p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          <Link href={blogPostPath(post.slug)} className="hover:text-brand">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
          <time dateTime={post.published_at || post.created_at}>
            {formatBlogDate(post.published_at || post.created_at)}
          </time>
          <Link
            href={blogPostPath(post.slug)}
            className="font-semibold text-brand hover:underline"
          >
            Leer artículo →
          </Link>
        </div>
      </div>
    </article>
  )
}
