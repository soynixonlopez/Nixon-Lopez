import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlogContent } from '@/components/blog/BlogContent'
import {
  formatBlogDate,
  isSameCalendarDay,
  type BlogPostRow,
} from '@/lib/blog'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Vista previa de artículo',
  robots: { index: false, follow: false, nocache: true },
}

type Props = { params: Promise<{ id: string }> }

export default async function AdminBlogPreviewPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()

  const post = data as BlogPostRow
  const showUpdated =
    post.published_at &&
    post.updated_at &&
    !isSameCalendarDay(post.published_at, post.updated_at)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Vista previa (noindex). Estado: <strong>{post.status}</strong>.{' '}
        <Link href={`/admin/blog/${post.id}/editar`} className="underline">
          Volver al editor
        </Link>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">{post.category}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          {post.author_name}
          {post.published_at ? ` · ${formatBlogDate(post.published_at)}` : ' · Sin publicar'}
          {showUpdated ? ` · Actualizado ${formatBlogDate(post.updated_at)}` : null}
        </p>
        {post.featured_image_url ? (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={post.featured_image_url}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        ) : null}
        <div className="mt-8">
          <BlogContent html={post.content} />
        </div>
      </article>
    </div>
  )
}
