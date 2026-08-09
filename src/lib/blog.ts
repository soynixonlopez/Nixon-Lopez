import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { BLOG_CATEGORIES, BLOG_IMAGE } from '@/lib/blog-constants'
import { sanitizeBlogHtml } from '@/lib/blog-sanitize'
import {
  isAllowedBlogImageSrc,
  isBlogPostId,
  sanitizeBlogStoragePath,
} from '@/lib/blog-security'
import { SITE_URL } from '@/lib/site-config'

export { BLOG_CATEGORIES, BLOG_IMAGE } from '@/lib/blog-constants'
export {
  isAllowedBlogImageSrc,
  isBlogPostId,
  sanitizeBlogStoragePath,
} from '@/lib/blog-security'

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]
export type BlogStatus = 'draft' | 'published'

export type BlogPostRow = {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  previous_slugs: string[]
  excerpt: string
  content: string
  featured_image_url: string | null
  featured_image_path: string | null
  featured_image_alt: string
  status: BlogStatus
  published_at: string | null
  author_name: string
  category: string
  tags: string[]
  seo_title: string | null
  seo_description: string | null
}

export function slugifyBlog(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

export function blogPostPath(slug: string) {
  return `/blog/${slug}`
}

export function blogPostUrl(slug: string) {
  return `${SITE_URL}${blogPostPath(slug)}`
}

/** Lecturas públicas con anon key (RLS). Nunca service role aquí. */
function createPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

const SELECT_PUBLIC =
  'id, created_at, updated_at, title, slug, previous_slugs, excerpt, content, featured_image_url, featured_image_path, featured_image_alt, status, published_at, author_name, category, tags, seo_title, seo_description'

async function fetchPublishedPosts(limit?: number): Promise<BlogPostRow[]> {
  try {
    const supabase = createPublicSupabase()
    if (!supabase) return []
    let query = supabase
      .from('blog_posts')
      .select(SELECT_PUBLIC)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error || !data) return []
    return data.map(normalizeRow)
  } catch {
    return []
  }
}

function normalizeRow(row: Record<string, unknown>): BlogPostRow {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    title: String(row.title ?? ''),
    slug: String(row.slug ?? ''),
    previous_slugs: Array.isArray(row.previous_slugs)
      ? row.previous_slugs.filter((s): s is string => typeof s === 'string')
      : [],
    excerpt: String(row.excerpt ?? ''),
    content: String(row.content ?? ''),
    featured_image_url:
      typeof row.featured_image_url === 'string' ? row.featured_image_url : null,
    featured_image_path:
      typeof row.featured_image_path === 'string' ? row.featured_image_path : null,
    featured_image_alt: String(row.featured_image_alt ?? ''),
    status: row.status === 'published' ? 'published' : 'draft',
    published_at: typeof row.published_at === 'string' ? row.published_at : null,
    author_name: String(row.author_name ?? 'Nixon López'),
    category: String(row.category ?? 'Desarrollo Web'),
    tags: Array.isArray(row.tags)
      ? row.tags.filter((t): t is string => typeof t === 'string')
      : [],
    seo_title: typeof row.seo_title === 'string' ? row.seo_title : null,
    seo_description: typeof row.seo_description === 'string' ? row.seo_description : null,
  }
}

export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  try {
    return await unstable_cache(fetchPublishedPosts, ['blog-posts-all'], {
      revalidate: 120,
      tags: ['blog-posts'],
    })()
  } catch {
    return fetchPublishedPosts()
  }
}

export async function getRecentBlogPosts(limit = 3): Promise<BlogPostRow[]> {
  try {
    return await unstable_cache(
      () => fetchPublishedPosts(limit),
      [`blog-posts-recent-${limit}`],
      { revalidate: 120, tags: ['blog-posts'] },
    )()
  } catch {
    return fetchPublishedPosts(limit)
  }
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<{ post: BlogPostRow | null; redirectTo: string | null }> {
  try {
    const supabase = createPublicSupabase()
    if (!supabase) return { post: null, redirectTo: null }

    const { data: direct } = await supabase
      .from('blog_posts')
      .select(SELECT_PUBLIC)
      .eq('status', 'published')
      .eq('slug', slug)
      .maybeSingle()

    if (direct) return { post: normalizeRow(direct), redirectTo: null }

    const { data: byPrevious } = await supabase
      .from('blog_posts')
      .select(SELECT_PUBLIC)
      .eq('status', 'published')
      .contains('previous_slugs', [slug])
      .maybeSingle()

    if (byPrevious) {
      const post = normalizeRow(byPrevious)
      return { post: null, redirectTo: post.slug }
    }

    return { post: null, redirectTo: null }
  } catch {
    return { post: null, redirectTo: null }
  }
}

export async function getPublishedBlogPostsForSitemap(): Promise<
  Array<{ slug: string; lastModified: string }>
> {
  const posts = await getPublishedBlogPosts()
  return posts.map((p) => ({
    slug: p.slug,
    lastModified: p.updated_at || p.published_at || p.created_at,
  }))
}

/** Extrae paths del bucket blog desde HTML + featured path. */
export function collectBlogStoragePaths(
  content: string,
  featuredPath?: string | null,
): string[] {
  const paths = new Set<string>()
  const add = (raw: string) => {
    const safe = sanitizeBlogStoragePath(raw)
    if (safe) paths.add(safe)
  }
  if (featuredPath?.trim()) add(featuredPath.trim())

  const re = /src=["']([^"']+)["']/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(content))) {
    const src = match[1]
    if (!src || !isAllowedBlogImageSrc(src)) continue
    const marker = `/storage/v1/object/public/${BLOG_IMAGE.bucket}/`
    const idx = src.indexOf(marker)
    if (idx >= 0) {
      add(decodeURIComponent(src.slice(idx + marker.length).split('?')[0] || ''))
    }
  }
  return Array.from(paths)
}

export type BlogWritePayload = {
  title: string
  slug: string
  previous_slugs: string[]
  excerpt: string
  content: string
  featured_image_url: string | null
  featured_image_path: string | null
  featured_image_alt: string
  status: BlogStatus
  published_at: string | null
  author_name: string
  category: string
  tags: string[]
  seo_title: string | null
  seo_description: string | null
}

type ParseBlogOptions = {
  existing?: Pick<BlogPostRow, 'slug' | 'previous_slugs' | 'published_at' | 'status'>
}

/** Validación server-side del payload de artículo. */
export function parseBlogPayload(
  body: unknown,
  opts: ParseBlogOptions = {},
): { ok: true; data: BlogWritePayload } | { ok: false; error: string; status: number } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Cuerpo inválido', status: 400 }
  }
  const b = body as Record<string, unknown>
  const title = typeof b.title === 'string' ? b.title.trim() : ''
  const slug = slugifyBlog(typeof b.slug === 'string' ? b.slug : title)
  const excerpt = typeof b.excerpt === 'string' ? b.excerpt.trim().slice(0, 400) : ''
  const contentRaw = typeof b.content === 'string' ? b.content : ''
  const status: BlogStatus = b.status === 'published' ? 'published' : 'draft'
  const featured_image_url =
    typeof b.featured_image_url === 'string' && b.featured_image_url.trim()
      ? b.featured_image_url.trim()
      : null
  const featured_image_path =
    typeof b.featured_image_path === 'string' && b.featured_image_path.trim()
      ? sanitizeBlogStoragePath(b.featured_image_path.trim())
      : null
  const featured_image_alt =
    typeof b.featured_image_alt === 'string' ? b.featured_image_alt.trim().slice(0, 200) : ''
  const author_name =
    typeof b.author_name === 'string' && b.author_name.trim()
      ? b.author_name.trim().slice(0, 80)
      : 'Nixon López'
  const categoryRaw = typeof b.category === 'string' ? b.category.trim() : BLOG_CATEGORIES[0]
  const category = (BLOG_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? categoryRaw
    : BLOG_CATEGORIES[0]
  const tags = Array.isArray(b.tags)
    ? b.tags
        .filter((t): t is string => typeof t === 'string')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 12)
    : typeof b.tags === 'string'
      ? parseTagsInput(b.tags)
      : []
  const seo_title =
    typeof b.seo_title === 'string' && b.seo_title.trim()
      ? b.seo_title.trim().slice(0, 120)
      : null
  const seo_description =
    typeof b.seo_description === 'string' && b.seo_description.trim()
      ? b.seo_description.trim().slice(0, 320)
      : null

  if (!title) return { ok: false, error: 'El título es obligatorio', status: 400 }
  if (!slug) return { ok: false, error: 'El slug no es válido', status: 400 }
  if (title.length > 200) return { ok: false, error: 'Título demasiado largo', status: 400 }

  if (featured_image_url && !isAllowedBlogImageSrc(featured_image_url)) {
    return { ok: false, error: 'URL de imagen destacada no permitida', status: 400 }
  }

  const content = sanitizeBlogHtml(contentRaw)

  if (status === 'published') {
    if (!excerpt) return { ok: false, error: 'El extracto es obligatorio para publicar', status: 400 }
    if (!content || content === '<p></p>') {
      return { ok: false, error: 'El contenido es obligatorio para publicar', status: 400 }
    }
    if (!featured_image_url) {
      return { ok: false, error: 'La imagen destacada es obligatoria para publicar', status: 400 }
    }
    if (!featured_image_alt) {
      return { ok: false, error: 'El alt de la imagen destacada es obligatorio para publicar', status: 400 }
    }
  }

  const existing = opts.existing
  const previous_slugs =
    existing && existing.slug && existing.slug !== slug
      ? Array.from(new Set([...(existing.previous_slugs ?? []), existing.slug]))
      : Array.isArray(b.previous_slugs)
        ? b.previous_slugs.filter((s): s is string => typeof s === 'string' && Boolean(slugifyBlog(s)))
        : (existing?.previous_slugs ?? [])

  const published_at =
    status === 'published'
      ? existing?.published_at ||
        (typeof b.published_at === 'string' && b.published_at ? b.published_at : new Date().toISOString())
      : existing?.published_at ?? null

  return {
    ok: true,
    data: {
      title,
      slug,
      previous_slugs,
      excerpt,
      content,
      featured_image_url,
      featured_image_path,
      featured_image_alt,
      status,
      published_at,
      author_name,
      category,
      tags,
      seo_title,
      seo_description,
    },
  }
}


export function parseTagsInput(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12)
}

export function formatBlogDate(iso: string | null | undefined, locale = 'es-PA') {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}

export function isSameCalendarDay(a: string | null, b: string | null) {
  if (!a || !b) return true
  return a.slice(0, 10) === b.slice(0, 10)
}
