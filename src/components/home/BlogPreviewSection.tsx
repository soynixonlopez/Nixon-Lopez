import Link from 'next/link'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { getRecentBlogPosts } from '@/lib/blog'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'

export async function BlogPreviewSection() {
  const posts = await getRecentBlogPosts(3)
  if (!posts.length) return null

  return (
    <section
      id="recursos"
      className="relative isolate overflow-hidden bg-slate-50 py-16 sm:py-24 dark:bg-slate-900/40"
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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
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
