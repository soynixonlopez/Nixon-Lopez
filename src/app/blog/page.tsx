import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BlogIndexClient } from '@/components/blog/BlogIndexClient'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { getPublishedBlogPosts } from '@/lib/blog'
import { getPublishedCategories } from '@/lib/blog-related'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 120

export const metadata: Metadata = buildPageMetadata({
  title: 'Blog de desarrollo web y SEO en Panamá',
  description:
    'Ideas, estrategias y experiencias sobre desarrollo web, tecnología y negocios digitales en Panamá.',
  path: '/blog',
})

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts()
  const categories = getPublishedCategories(posts)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-[calc(4.5rem+env(safe-area-inset-top,0px))] dark:bg-slate-950">
        <section className="relative isolate overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
            aria-hidden
          />
          <div className="container-padding relative mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
            <SectionLabel>Recursos</SectionLabel>
            <h1 className="mx-auto mt-2 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15] dark:text-white">
              Ideas para hacer crecer tu presencia digital
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              Consejos, estrategias y experiencias sobre desarrollo web, tecnología y negocios
              digitales.
            </p>
          </div>
        </section>

        <section className="container-padding mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          {posts.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Pronto publicaremos los primeros artículos.
            </p>
          ) : (
            <BlogIndexClient posts={posts} categories={categories} />
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
