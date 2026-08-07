import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAdminApi } from '@/lib/admin-auth-api'
import { parsePortfolioPayload } from '@/lib/portfolio'

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data, error } = await auth.supabase
    .from('portfolio_projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ projects: data ?? [] })
}

export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = parsePortfolioPayload(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  }

  const { data, error } = await auth.supabase
    .from('portfolio_projects')
    .insert(parsed.data)
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Ya existe un proyecto con ese slug. Usa otro nombre o slug.' },
        { status: 409 },
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidateTag('portfolio-projects', 'max')
  revalidatePath('/')
  revalidatePath('/proyectos')
  return NextResponse.json({ ok: true, project: data })
}
