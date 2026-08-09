import Link from 'next/link'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { getRecentBlogPosts } from '@/lib/blog'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'

export async function BlogPreviewSection() {
  const posts = await getRecentBlogPosts(3)
  if (!posts.length) return null

  return (
    <section className="relative bg-white py-16 sm:py-24 dark:bg-slate-950">
      <div className="container-padding mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Blog</SectionLabel>
          <SectionTitle>Últimos artículos</SectionTitle>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Ideas prácticas sobre desarrollo web, SEO y crecimiento digital.
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
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 transition hover:border-brand/30 hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            Ver todos los artículos
          </Link>
        </div>
      </div>
    </section>
  )
}
