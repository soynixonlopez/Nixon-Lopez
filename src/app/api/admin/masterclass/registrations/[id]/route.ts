import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth-api'
import {
  MASTERCLASS_REGISTRATION_STATUSES,
  type MasterclassRegistrationStatus,
} from '@/lib/masterclass'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await context.params
  const body = await request.json().catch(() => ({}))
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (typeof body.full_name === 'string') {
    const full_name = body.full_name.trim()
    if (!full_name) {
      return NextResponse.json({ error: 'El nombre es requerido.' }, { status: 400 })
    }
    patch.full_name = full_name
  }

  if (typeof body.email === 'string') {
    const email = body.email.trim().toLowerCase()
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 })
    }
    patch.email = email
  }

  if (typeof body.whatsapp === 'string') {
    const whatsapp = body.whatsapp.trim()
    if (!whatsapp) {
      return NextResponse.json({ error: 'WhatsApp es requerido.' }, { status: 400 })
    }
    patch.whatsapp = whatsapp
  }

  if (typeof body.status === 'string') {
    if (!(body.status in MASTERCLASS_REGISTRATION_STATUSES)) {
      return NextResponse.json({ error: 'Estado inválido.' }, { status: 400 })
    }
    patch.status = body.status as MasterclassRegistrationStatus
  }

  if (typeof body.internal_notes === 'string') {
    patch.internal_notes = body.internal_notes.trim() || null
  }

  if (Object.keys(patch).length === 1) {
    return NextResponse.json({ error: 'Nada que actualizar.' }, { status: 400 })
  }

  const { error } = await auth.supabase
    .from('masterclass_registrations')
    .update(patch)
    .eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Ya existe otro registro con ese correo para este evento.' },
        { status: 409 },
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await context.params
  const { error } = await auth.supabase.from('masterclass_registrations').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
