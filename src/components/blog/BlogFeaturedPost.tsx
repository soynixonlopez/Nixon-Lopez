import Image from 'next/image'
import Link from 'next/link'
import { blogPostPath, formatBlogDate, type BlogPostRow } from '@/lib/blog'
import { estimateReadingMinutes, formatReadingTime } from '@/lib/blog-reading'
import { blogChip, blogSurface } from '@/components/blog/blog-ui'

type Props = {
  post: BlogPostRow
}

export function BlogFeaturedPost({ post }: Props) {
  const minutes = estimateReadingMinutes(post.content || post.excerpt)

  return (
    <article className={`${blogSurface} overflow-hidden transition hover:shadow-[0_14px_44px_rgba(15,23,42,0.1)]`}>
      <div className="grid md:grid-cols-[1.05fr_1fr]">
        <Link
          href={blogPostPath(post.slug)}
          className="relative block aspect-[16/11] bg-slate-100 md:aspect-auto md:min-h-[280px] dark:bg-slate-900"
        >
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt={post.featured_image_alt || post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : null}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-white to-transparent md:block dark:from-slate-950"
            aria-hidden
          />
        </Link>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <time dateTime={post.published_at || post.created_at}>
              {formatBlogDate(post.published_at || post.created_at)}
            </time>
            <span aria-hidden>·</span>
            <span>{formatReadingTime(minutes)}</span>
          </div>
          <span className={`${blogChip} mt-3 w-fit`}>{post.category}</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem] sm:leading-snug dark:text-white">
            <Link href={blogPostPath(post.slug)} className="hover:text-brand">
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[0.95rem]">
            {post.excerpt}
          </p>
          <Link
            href={blogPostPath(post.slug)}
            className="mt-5 inline-flex w-fit text-sm font-semibold text-brand hover:underline"
          >
            Leer artículo →
          </Link>
        </div>
      </div>
    </article>
  )
}
