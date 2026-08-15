import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Clock } from 'lucide-react'
import { notFound, permanentRedirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BlogAuthorCard } from '@/components/blog/BlogAuthorCard'
import { BlogBreadcrumbs } from '@/components/blog/BlogBreadcrumbs'
import { BlogContent } from '@/components/blog/BlogContent'
import { BlogCtaBox } from '@/components/blog/BlogCtaBox'
import { BlogPostJsonLd } from '@/components/blog/BlogPostJsonLd'
import { BlogPrevNext } from '@/components/blog/BlogPrevNext'
import { BlogRelatedPosts } from '@/components/blog/BlogRelatedPosts'
import { BlogToc } from '@/components/blog/BlogToc'
import { blogChip, blogPageBg, blogSurface } from '@/components/blog/blog-ui'
import {
  blogPostPath,
  formatBlogDate,
  getPublishedBlogPostBySlug,
  getPublishedBlogPosts,
  isSameCalendarDay,
} from '@/lib/blog'
import { getAdjacentBlogPosts, getRelatedBlogPosts } from '@/lib/blog-related'
import { estimateReadingMinutes, formatReadingTime } from '@/lib/blog-reading'
import { enrichBlogHeadings, shouldShowToc } from '@/lib/blog-toc'
import { HOME_IMAGES } from '@/lib/marketing'
import { buildPageMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo'
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

  const allPosts = await getPublishedBlogPosts()
  const related = getRelatedBlogPosts(post, allPosts, 3)
  const { previous, next } = getAdjacentBlogPosts(post, allPosts)
  const { html: contentHtml, toc } = enrichBlogHeadings(post.content)
  const showToc = shouldShowToc(toc)
  const minutes = estimateReadingMinutes(post.content)
  const showUpdated =
    Boolean(post.published_at) &&
    Boolean(post.updated_at) &&
    !isSameCalendarDay(post.published_at, post.updated_at)

  return (
    <>
      <BlogPostJsonLd post={post} />
      <Header />
      <main className={blogPageBg}>
        <div className="container-padding mx-auto max-w-6xl py-8 sm:py-12">
          <section className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="min-w-0">
              <BlogBreadcrumbs
                items={[
                  { label: 'Inicio', href: '/' },
                  { label: 'Recursos', href: '/blog' },
                  { label: post.title },
                ]}
              />

              <p className={`${blogChip} mt-5`}>{post.category}</p>
              <h1 className="mt-4 text-[1.75rem] font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.35rem] lg:leading-[1.15] dark:text-white">
                {post.title}
              </h1>
              {post.excerpt ? (
                <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
                  {post.excerpt}
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
                <time dateTime={post.published_at || post.created_at}>
                  {formatBlogDate(post.published_at || post.created_at)}
                </time>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-2">
                  <span className="relative h-7 w-7 overflow-hidden rounded-full bg-slate-200">
                    <Image
                      src={HOME_IMAGES.about}
                      alt=""
                      fill
                      className="object-cover object-top"
                      sizes="28px"
                    />
                  </span>
                  <span>por {post.author_name}</span>
                </span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {formatReadingTime(minutes)}
                </span>
                {showUpdated ? (
                  <>
                    <span aria-hidden>·</span>
                    <time dateTime={post.updated_at}>
                      Actualizado {formatBlogDate(post.updated_at)}
                    </time>
                  </>
                ) : null}
              </div>

              <Link
                href="/blog"
                className="mt-6 inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand/30 hover:text-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Volver al centro de recursos
              </Link>
            </div>

            {post.featured_image_url ? (
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_16px_50px_rgba(15,23,42,0.12)] sm:rounded-3xl dark:bg-slate-900">
                <Image
                  src={post.featured_image_url}
                  alt={post.featured_image_alt || post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
            ) : null}
          </section>

          {showToc ? (
            <div className="mt-8 lg:hidden">
              <BlogToc items={toc} collapsible />
            </div>
          ) : null}

          <div className="mt-8 grid items-start gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
            <article className={`${blogSurface} min-w-0 p-5 sm:p-7 lg:p-8`}>
              <BlogContent html={contentHtml} />

              {post.tags.length > 0 ? (
                <div className="mt-10 border-t border-slate-100 pt-8 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Etiquetas
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <BlogRelatedPosts posts={related} />

              <div className="mt-10">
                <BlogCtaBox secondaryHref="/proyectos" secondaryLabel="Ver proyectos" />
              </div>

              <div className="mt-8">
                <BlogAuthorCard name={post.author_name} />
              </div>

              <BlogPrevNext previous={previous} next={next} />
            </article>

            <aside className="hidden lg:block">
              {/* Índice + CTA compacto: sticky sin scroll interno */}
              <div className="sticky top-24 z-10 space-y-5 self-start">
                {showToc ? <BlogToc items={toc} /> : null}
                <BlogCtaBox
                  compact
                  title="¿Tienes un proyecto?"
                  description="Cuéntame qué quieres construir."
                  primaryLabel="Solicitar cotización →"
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
