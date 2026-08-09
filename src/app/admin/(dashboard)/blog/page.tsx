import { createClient } from '@/lib/supabase/server'
import { BlogBoard } from '@/components/admin/BlogBoard'
import type { BlogPostRow } from '@/lib/blog'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select(
      'id, created_at, updated_at, title, slug, previous_slugs, excerpt, content, featured_image_url, featured_image_path, featured_image_alt, status, published_at, author_name, category, tags, seo_title, seo_description',
    )
    .order('updated_at', { ascending: false })

  const posts = (data ?? []) as BlogPostRow[]

  return <BlogBoard posts={posts} />
}
