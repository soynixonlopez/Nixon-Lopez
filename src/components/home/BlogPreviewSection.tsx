import Image from 'next/image'
import Link from 'next/link'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { getRecentBlogPosts, blogPostPath, formatBlogDate } from '@/lib/blog'
import { estimateReadingMinutes, formatReadingTime } from '@/lib/blog-reading'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'

export async function BlogPreviewSection() {
  const posts = await getRecentBlogPosts(3)
  if (!posts.length) return null

  const [featured, ...rest] = posts

  return (
    <section
      id="recursos"
      className="relative isolate overflow-hidden bg-[#F5F7FB] py-16 sm:py-24 dark:bg-slate-900/40"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
        aria-hidden
      />

      <div className="container-padding relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Recursos</SectionLabel>
          <SectionTitle>Ideas para hacer crecer tu presencia digital</SectionTitle>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Consejos, estrategias y experiencias sobre desarrollo web, tecnología y negocios
            digitales.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <Link
              href={blogPostPath(featured.slug)}
              className="relative block aspect-[16/10] bg-slate-100 dark:bg-slate-900"
            >
              {featured.featured_image_url ? (
                <Image
                  src={featured.featured_image_url}
                  alt={featured.featured_image_alt || featured.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : null}
            </Link>
            <div className="p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
                {featured.category}
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                <Link href={blogPostPath(featured.slug)} className="hover:text-brand">
                  {featured.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {featured.excerpt}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <time dateTime={featured.published_at || featured.created_at}>
                  {formatBlogDate(featured.published_at || featured.created_at)}
                </time>
                <span aria-hidden>·</span>
                <span>
                  {formatReadingTime(estimateReadingMinutes(featured.content || featured.excerpt))}
                </span>
              </div>
              <Link
                href={blogPostPath(featured.slug)}
                className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline"
              >
                Leer artículo →
              </Link>
            </div>
          </article>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((post) => (
              <BlogPostCard key={post.id} post={post} compact />
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-light"
          >
            Ver todos los artículos
          </Link>
        </div>
      </div>
    </section>
  )
}
