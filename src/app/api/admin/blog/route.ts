import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAdminApi } from '@/lib/admin-auth-api'
import { parseBlogPayload } from '@/lib/blog'

export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = parseBlogPayload(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  }

  const { data, error } = await auth.supabase
    .from('blog_posts')
    .insert(parsed.data)
    .select('id, slug, status')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Ese slug ya existe. Elige otro.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidateTag('blog-posts', 'max')
  revalidatePath('/blog')
  revalidatePath('/')
  revalidatePath('/sitemap.xml')
  if (data?.slug) revalidatePath(`/blog/${data.slug}`)

  return NextResponse.json({ ok: true, id: data.id, slug: data.slug, status: data.status })
}
