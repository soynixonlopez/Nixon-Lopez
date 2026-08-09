import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAdminApi } from '@/lib/admin-auth-api'
import {
  BLOG_IMAGE,
  collectBlogStoragePaths,
  isBlogPostId,
  parseBlogPayload,
  type BlogPostRow,
} from '@/lib/blog'
import { createServiceRoleClient } from '@/lib/supabase/service'

type Ctx = { params: Promise<{ id: string }> }

function revalidateBlog(slug?: string | null) {
  revalidateTag('blog-posts', 'max')
  revalidatePath('/blog')
  revalidatePath('/')
  revalidatePath('/sitemap.xml')
  if (slug) revalidatePath(`/blog/${slug}`)
}

export async function PATCH(request: Request, context: Ctx) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await context.params
  if (!isBlogPostId(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const { data: existing, error: existingError } = await auth.supabase
    .from('blog_posts')
    .select('id, slug, previous_slugs, published_at, status')
    .eq('id', id)
    .maybeSingle()

  if (existingError || !existing) {
    return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 })
  }

  const body = await request.json().catch(() => null)

  // Status-only patch from board
  if (
    body &&
    typeof body === 'object' &&
    'status' in body &&
    Object.keys(body as object).every((k) => ['status'].includes(k))
  ) {
    const status = (body as { status: string }).status === 'published' ? 'published' : 'draft'
    if (status === 'published') {
      const { data: full } = await auth.supabase.from('blog_posts').select('*').eq('id', id).single()
      const parsed = parseBlogPayload(
        { ...(full as BlogPostRow), status: 'published' },
        {
          existing: {
            slug: existing.slug,
            previous_slugs: existing.previous_slugs ?? [],
            published_at: existing.published_at,
            status: existing.status,
          },
        },
      )
      if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: parsed.status })
      }
    }

    const payload: Record<string, unknown> = { status }
    if (status === 'published' && !existing.published_at) {
      payload.published_at = new Date().toISOString()
    }

    const { data, error } = await auth.supabase
      .from('blog_posts')
      .update(payload)
      .eq('id', id)
      .select('id, slug, status, published_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidateBlog(data.slug)
    return NextResponse.json({ ok: true, post: data })
  }

  const parsed = parseBlogPayload(body, {
    existing: {
      slug: existing.slug,
      previous_slugs: Array.isArray(existing.previous_slugs) ? existing.previous_slugs : [],
      published_at: existing.published_at,
      status: existing.status === 'published' ? 'published' : 'draft',
    },
  })
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  }

  const { data, error } = await auth.supabase
    .from('blog_posts')
    .update(parsed.data)
    .eq('id', id)
    .select('id, slug, status, published_at')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Ese slug ya existe. Elige otro.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidateBlog(data.slug)
  if (existing.slug !== data.slug) revalidatePath(`/blog/${existing.slug}`)

  return NextResponse.json({ ok: true, post: data })
}

/** Elimina artículo + archivos del bucket blog asociados. */
export async function DELETE(_request: Request, context: Ctx) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await context.params
  if (!isBlogPostId(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const { data: post, error } = await auth.supabase
    .from('blog_posts')
    .select('id, slug, content, featured_image_path')
    .eq('id', id)
    .maybeSingle()

  if (error || !post) {
    return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 })
  }

  const paths = collectBlogStoragePaths(
    String(post.content ?? ''),
    typeof post.featured_image_path === 'string' ? post.featured_image_path : null,
  )

  const { error: deleteError } = await auth.supabase.from('blog_posts').delete().eq('id', id)
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  if (paths.length) {
    const service = createServiceRoleClient()
    const storage = service ?? auth.supabase
    await storage.storage.from(BLOG_IMAGE.bucket).remove(paths)
  }

  revalidateBlog(typeof post.slug === 'string' ? post.slug : null)
  return NextResponse.json({ ok: true })
}
