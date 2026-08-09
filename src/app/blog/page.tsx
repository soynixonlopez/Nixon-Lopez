import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { getPublishedBlogPosts } from '@/lib/blog'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 120

export const metadata: Metadata = buildPageMetadata({
  title: 'Blog de desarrollo web y SEO en Panamá',
  description:
    'Artículos de Nixon López sobre desarrollo web, SEO, tecnología y negocios digitales en Panamá.',
  path: '/blog',
})

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-[calc(4.5rem+env(safe-area-inset-top,0px))] dark:bg-slate-950">
        <section className="border-b border-slate-100 dark:border-slate-800">
          <div className="container-padding mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Blog</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Ideas para hacer crecer tu negocio online
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
              Guías prácticas de desarrollo web, SEO y tecnología aplicadas a negocios en Panamá.
            </p>
          </div>
        </section>

        <section className="container-padding mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {posts.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Pronto publicaremos los primeros artículos.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
