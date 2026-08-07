import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAdminApi } from '@/lib/admin-auth-api'
import { parsePortfolioPayload, PORTFOLIO_IMAGE } from '@/lib/portfolio'
import { createServiceRoleClient } from '@/lib/supabase/service'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: Ctx) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  const body = await request.json().catch(() => null)
  const parsed = parsePortfolioPayload(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  }

  const { data: previous } = await auth.supabase
    .from('portfolio_projects')
    .select('image_path')
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await auth.supabase
    .from('portfolio_projects')
    .update(parsed.data)
    .eq('id', id)
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

  const oldPath = previous?.image_path as string | null | undefined
  const newPath = parsed.data.image_path
  if (oldPath && newPath && oldPath !== newPath) {
    const service = createServiceRoleClient()
    if (service) {
      await service.storage.from(PORTFOLIO_IMAGE.bucket).remove([oldPath])
    }
  }

  revalidateTag('portfolio-projects', 'max')
  revalidatePath('/')
  revalidatePath('/proyectos')
  return NextResponse.json({ ok: true, project: data })
}

export async function DELETE(_request: Request, context: Ctx) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  const { data: row, error: fetchError } = await auth.supabase
    .from('portfolio_projects')
    .select('image_path')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  const { error } = await auth.supabase.from('portfolio_projects').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (row?.image_path) {
    const service = createServiceRoleClient()
    if (service) {
      await service.storage.from(PORTFOLIO_IMAGE.bucket).remove([row.image_path as string])
    }
  }

  revalidateTag('portfolio-projects', 'max')
  revalidatePath('/')
  revalidatePath('/proyectos')
  return NextResponse.json({ ok: true })
}
