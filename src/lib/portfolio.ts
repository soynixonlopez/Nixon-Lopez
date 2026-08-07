import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { FEATURED_PROJECTS, type FeaturedProject } from '@/lib/case-studies'
import { createServiceRoleClient } from '@/lib/supabase/service'

export const PORTFOLIO_IMAGE = {
  width: 1600,
  height: 1000,
  aspectLabel: '16:10',
  maxUploadBytes: 8 * 1024 * 1024,
  webpQuality: 80,
  bucket: 'portfolio',
} as const

export const PORTFOLIO_CATEGORY_TONES = ['blue', 'green', 'purple', 'orange', 'pink'] as const
export type PortfolioCategoryTone = (typeof PORTFOLIO_CATEGORY_TONES)[number]

export type PortfolioProjectRow = {
  id: string
  created_at: string
  updated_at: string
  slug: string
  company: string
  category: string
  category_tone: PortfolioCategoryTone
  description: string
  demo_url: string
  image_url: string
  image_path: string | null
  sort_order: number
  is_published: boolean
  show_on_home: boolean
}

export function slugifyPortfolio(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function rowToFeaturedProject(row: PortfolioProjectRow): FeaturedProject {
  return {
    slug: row.slug,
    company: row.company,
    category: row.category,
    categoryTone: row.category_tone,
    description: row.description,
    demoUrl: row.demo_url,
    image: row.image_url,
  }
}

/** Cliente sin cookies (apto para cache de Next). */
function createPublicSupabase() {
  const service = createServiceRoleClient()
  if (service) return service

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function fetchHomePortfolioProjects(): Promise<FeaturedProject[]> {
  try {
    const supabase = createPublicSupabase()
    if (!supabase) return FEATURED_PROJECTS

    const { data, error } = await supabase
      .from('portfolio_projects')
      .select(
        'id, slug, company, category, category_tone, description, demo_url, image_url, sort_order, is_published, show_on_home, created_at',
      )
      .eq('is_published', true)
      .eq('show_on_home', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error || !data?.length) return FEATURED_PROJECTS

    return data.map((row) => rowToFeaturedProject(row as PortfolioProjectRow))
  } catch {
    return FEATURED_PROJECTS
  }
}

/** Proyectos del carrusel Home (cache 2 min) o fallback estático. */
export async function getHomePortfolioProjects(): Promise<FeaturedProject[]> {
  try {
    return await unstable_cache(fetchHomePortfolioProjects, ['home-portfolio-projects'], {
      revalidate: 120,
      tags: ['portfolio-projects'],
    })()
  } catch {
    return FEATURED_PROJECTS
  }
}

export function parsePortfolioPayload(body: unknown) {
  if (!body || typeof body !== 'object') {
    return { ok: false as const, error: 'Cuerpo inválido', status: 400 }
  }

  const b = body as Record<string, unknown>
  const company = typeof b.company === 'string' ? b.company.trim() : ''
  const category = typeof b.category === 'string' ? b.category.trim() : ''
  const description = typeof b.description === 'string' ? b.description.trim() : ''
  const demoUrl = typeof b.demo_url === 'string' ? b.demo_url.trim() : ''
  const imageUrl = typeof b.image_url === 'string' ? b.image_url.trim() : ''
  const imagePath =
    typeof b.image_path === 'string' && b.image_path.trim() ? b.image_path.trim() : null
  const slugRaw = typeof b.slug === 'string' ? b.slug.trim() : ''
  const slug = slugifyPortfolio(slugRaw || company)
  const toneRaw = typeof b.category_tone === 'string' ? b.category_tone : 'blue'
  const categoryTone = PORTFOLIO_CATEGORY_TONES.includes(toneRaw as PortfolioCategoryTone)
    ? (toneRaw as PortfolioCategoryTone)
    : null

  if (!company) return { ok: false as const, error: 'El nombre del proyecto es obligatorio', status: 400 }
  if (!category) return { ok: false as const, error: 'La categoría es obligatoria', status: 400 }
  if (!description) return { ok: false as const, error: 'La descripción es obligatoria', status: 400 }
  if (!demoUrl) return { ok: false as const, error: 'La URL del demo es obligatoria', status: 400 }
  if (!imageUrl) return { ok: false as const, error: 'La imagen es obligatoria', status: 400 }
  if (!slug) return { ok: false as const, error: 'No se pudo generar el slug', status: 400 }
  if (!categoryTone) return { ok: false as const, error: 'Tono de categoría inválido', status: 400 }

  try {
    // Valida URL absoluta
    // eslint-disable-next-line no-new
    new URL(demoUrl)
  } catch {
    return { ok: false as const, error: 'La URL del demo no es válida', status: 400 }
  }

  const sortOrder =
    typeof b.sort_order === 'number' && Number.isFinite(b.sort_order)
      ? Math.round(b.sort_order)
      : typeof b.sort_order === 'string' && b.sort_order.trim() !== ''
        ? Number.parseInt(b.sort_order, 10) || 0
        : 0

  return {
    ok: true as const,
    data: {
      slug,
      company,
      category,
      category_tone: categoryTone,
      description,
      demo_url: demoUrl,
      image_url: imageUrl,
      image_path: imagePath,
      sort_order: sortOrder,
      is_published: b.is_published !== false,
      show_on_home: b.show_on_home !== false,
    },
  }
}
