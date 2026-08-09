import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlogEditorClient } from '@/components/admin/BlogEditorClient'
import type { BlogPostRow } from '@/lib/blog'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export default async function AdminBlogEditPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()
  return <BlogEditorClient post={data as BlogPostRow} />
}
