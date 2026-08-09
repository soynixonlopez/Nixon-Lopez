import Image from 'next/image'
import Link from 'next/link'
import { blogPostPath, formatBlogDate, type BlogPostRow } from '@/lib/blog'
import { estimateReadingMinutes, formatReadingTime } from '@/lib/blog-reading'

type Props = {
  post: BlogPostRow
}

export function BlogFeaturedPost({ post }: Props) {
  const minutes = estimateReadingMinutes(post.content || post.excerpt)

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="grid lg:grid-cols-2">
        <Link
          href={blogPostPath(post.slug)}
          className="relative block aspect-[16/11] bg-slate-100 lg:aspect-auto lg:min-h-[320px] dark:bg-slate-900"
        >
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt={post.featured_image_alt || post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : null}
        </Link>
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Artículo destacado
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {post.category}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            <Link href={blogPostPath(post.slug)} className="hover:text-brand">
              {post.title}
            </Link>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {post.excerpt}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <time dateTime={post.published_at || post.created_at}>
              {formatBlogDate(post.published_at || post.created_at)}
            </time>
            <span aria-hidden>·</span>
            <span>{formatReadingTime(minutes)}</span>
          </div>
          <Link
            href={blogPostPath(post.slug)}
            className="mt-6 inline-flex w-fit items-center text-sm font-semibold text-brand hover:underline"
          >
            Leer artículo →
          </Link>
        </div>
      </div>
    </article>
  )
}
