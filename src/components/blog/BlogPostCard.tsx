import Image from 'next/image'
import Link from 'next/link'
import { blogPostPath, formatBlogDate, type BlogPostRow } from '@/lib/blog'
import { estimateReadingMinutes, formatReadingTime } from '@/lib/blog-reading'
import { blogChip, blogSurface } from '@/components/blog/blog-ui'

type Props = {
  post: BlogPostRow
  compact?: boolean
  horizontal?: boolean
}

export function BlogPostCard({ post, compact = false, horizontal = false }: Props) {
  const minutes = estimateReadingMinutes(post.content || post.excerpt)

  if (horizontal) {
    return (
      <article
        className={`${blogSurface} overflow-hidden transition hover:shadow-[0_14px_44px_rgba(15,23,42,0.1)]`}
      >
        <div className="grid sm:grid-cols-[220px_1fr]">
          <Link
            href={blogPostPath(post.slug)}
            className="relative block aspect-[16/10] bg-slate-100 sm:aspect-auto sm:min-h-full dark:bg-slate-900"
          >
            {post.featured_image_url ? (
              <Image
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 220px"
              />
            ) : null}
          </Link>
          <div className="flex flex-col justify-center p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <time dateTime={post.published_at || post.created_at}>
                {formatBlogDate(post.published_at || post.created_at)}
              </time>
              <span aria-hidden>·</span>
              <span>{formatReadingTime(minutes)}</span>
            </div>
            <span className={`${blogChip} mt-3 w-fit`}>{post.category}</span>
            <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              <Link href={blogPostPath(post.slug)} className="hover:text-brand">
                {post.title}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {post.excerpt}
            </p>
            <Link
              href={blogPostPath(post.slug)}
              className="mt-4 inline-flex w-fit text-sm font-semibold text-brand hover:underline"
            >
              Leer artículo →
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={blogPostPath(post.slug)}
        className="relative block aspect-[16/10] overflow-hidden rounded-3xl bg-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:bg-slate-900"
      >
        {post.featured_image_url ? (
          <Image
            src={post.featured_image_url}
            alt={post.featured_image_alt || post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes={compact ? '(max-width: 768px) 100vw, 33vw' : '(max-width: 768px) 100vw, 33vw'}
          />
        ) : null}
      </Link>
      <div className={`flex flex-1 flex-col ${compact ? 'pt-4' : 'pt-5'}`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <time dateTime={post.published_at || post.created_at}>
            {formatBlogDate(post.published_at || post.created_at)}
          </time>
          <span aria-hidden>·</span>
          <span>{formatReadingTime(minutes)}</span>
        </div>
        <span className={`${blogChip} mt-3 w-fit`}>{post.category}</span>
        <h3
          className={`mt-2 font-bold tracking-tight text-slate-900 dark:text-white ${
            compact ? 'text-base' : 'text-lg'
          }`}
        >
          <Link href={blogPostPath(post.slug)} className="hover:text-brand">
            {post.title}
          </Link>
        </h3>
        {!compact ? (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {post.excerpt}
          </p>
        ) : null}
        <Link
          href={blogPostPath(post.slug)}
          className="mt-4 inline-flex w-fit text-sm font-semibold text-brand hover:underline"
        >
          Leer artículo →
        </Link>
      </div>
    </article>
  )
}
