import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BlogIndexClient } from '@/components/blog/BlogIndexClient'
import { getPublishedBlogPosts } from '@/lib/blog'
import { getPublishedCategories } from '@/lib/blog-related'
import { buildPageMetadata } from '@/lib/seo'
import { blogPageBg } from '@/components/blog/blog-ui'

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
      <main className={blogPageBg}>
        <section className="container-padding mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-10">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Recursos</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Ideas para hacer crecer tu presencia digital
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Consejos, estrategias y experiencias sobre desarrollo web, tecnología y negocios
            digitales.
          </p>
        </section>

        <section className="container-padding mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          {posts.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
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
