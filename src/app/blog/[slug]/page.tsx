import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BlogContent } from '@/components/blog/BlogContent'
import { BlogPostJsonLd } from '@/components/blog/BlogPostJsonLd'
import {
  blogPostPath,
  formatBlogDate,
  getPublishedBlogPostBySlug,
  isSameCalendarDay,
} from '@/lib/blog'
import { buildPageMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo'
import { quoteUrl } from '@/lib/marketing'
import { SITE_NAME } from '@/lib/site-config'

export const revalidate = 120

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { post, redirectTo } = await getPublishedBlogPostBySlug(slug)
  if (redirectTo) {
    return buildPageMetadata({
      title: 'Redirigiendo…',
      description: 'Este artículo cambió de URL.',
      path: blogPostPath(redirectTo),
      noIndex: true,
    })
  }
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      robots: { index: false, follow: false },
    }
  }

  const title = post.seo_title?.trim() || `${post.title} | ${SITE_NAME}`
  const description = post.seo_description?.trim() || post.excerpt
  const image = post.featured_image_url
    ? {
        url: post.featured_image_url,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: post.featured_image_alt || post.title,
      }
    : DEFAULT_OG_IMAGE

  return buildPageMetadata({
    title,
    description,
    path: blogPostPath(post.slug),
    absoluteTitle: Boolean(post.seo_title?.trim()) || title.includes(SITE_NAME),
    image,
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const { post, redirectTo } = await getPublishedBlogPostBySlug(slug)

  if (redirectTo) {
    permanentRedirect(blogPostPath(redirectTo))
  }
  if (!post) notFound()

  const showUpdated =
    Boolean(post.published_at) &&
    Boolean(post.updated_at) &&
    !isSameCalendarDay(post.published_at, post.updated_at)

  return (
    <>
      <BlogPostJsonLd post={post} />
      <Header />
      <main className="min-h-screen bg-white pt-[calc(4.5rem+env(safe-area-inset-top,0px))] dark:bg-slate-950">
        <article className="container-padding mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Miga de pan" className="mb-6 text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-brand">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-brand">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="line-clamp-1 text-slate-700 dark:text-slate-300" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{post.category}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span>{post.author_name}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.published_at || post.created_at}>
              {formatBlogDate(post.published_at || post.created_at)}
            </time>
            {showUpdated ? (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.updated_at}>
                  Actualizado {formatBlogDate(post.updated_at)}
                </time>
              </>
            ) : null}
          </div>

          {post.featured_image_url ? (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
              <Image
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : null}

          <div className="mt-10">
            <BlogContent html={post.content} />
          </div>

          {post.tags.length > 0 ? (
            <ul className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <aside className="mt-14 rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/[0.06] to-transparent px-6 py-8 sm:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              ¿Necesitas una página web para tu negocio?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Cotiza en minutos y recibe una propuesta clara, sin compromiso.
            </p>
            <Link
              href={quoteUrl()}
              className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-light"
            >
              Solicitar cotización
            </Link>
          </aside>
        </article>
      </main>
      <Footer />
    </>
  )
}
