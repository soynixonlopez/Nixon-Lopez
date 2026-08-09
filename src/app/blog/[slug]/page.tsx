import type { Metadata } from 'next'
import Image from 'next/image'
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
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { BlogToc } from '@/components/blog/BlogToc'
import {
  blogPostPath,
  formatBlogDate,
  getPublishedBlogPostBySlug,
  getPublishedBlogPosts,
  isSameCalendarDay,
} from '@/lib/blog'
import {
  getAdjacentBlogPosts,
  getPublishedCategories,
  getRelatedBlogPosts,
} from '@/lib/blog-related'
import { estimateReadingMinutes, formatReadingTime } from '@/lib/blog-reading'
import { enrichBlogHeadings, shouldShowToc } from '@/lib/blog-toc'
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
  const categories = getPublishedCategories(allPosts)
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
      <main className="min-h-screen bg-white pt-[calc(4.5rem+env(safe-area-inset-top,0px))] dark:bg-slate-950">
        <div className="container-padding mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <BlogBreadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.category, href: '/blog' },
              { label: post.title },
            ]}
          />

          <header className="mx-auto mt-8 max-w-[720px] lg:mx-0 lg:max-w-[720px]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              {post.category}
            </p>
            <h1 className="mt-3 text-[2rem] font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.15] dark:text-white">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                {post.excerpt}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {post.author_name}
              </span>
              <span aria-hidden>·</span>
              <time dateTime={post.published_at || post.created_at}>
                Publicado {formatBlogDate(post.published_at || post.created_at)}
              </time>
              {showUpdated ? (
                <>
                  <span aria-hidden>·</span>
                  <time dateTime={post.updated_at}>
                    Actualizado {formatBlogDate(post.updated_at)}
                  </time>
                </>
              ) : null}
              <span aria-hidden>·</span>
              <span>{formatReadingTime(minutes)}</span>
            </div>
          </header>

          {post.featured_image_url ? (
            <div className="relative mx-auto mt-8 aspect-[16/9] max-w-[720px] overflow-hidden rounded-2xl bg-slate-100 lg:mx-0 dark:bg-slate-900">
              <Image
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          ) : null}

          {showToc ? (
            <div className="mx-auto mt-8 max-w-[720px] lg:hidden">
              <BlogToc items={toc} collapsible />
            </div>
          ) : null}

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,720px)_300px] lg:items-start lg:justify-between lg:gap-12">
            <article className="min-w-0 max-w-[720px]">
              <BlogContent html={contentHtml} />

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

              <div className="mt-12">
                <BlogCtaBox
                  secondaryHref="/proyectos"
                  secondaryLabel="Ver proyectos"
                />
              </div>

              <div className="mt-10">
                <BlogAuthorCard name={post.author_name} />
              </div>

              <BlogPrevNext previous={previous} next={next} />
              <BlogRelatedPosts posts={related} />
            </article>

            <div className="min-w-0">
              <BlogSidebar
                recentPosts={allPosts}
                categories={categories}
                currentSlug={post.slug}
                toc={showToc ? toc : undefined}
                showSearch={false}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
