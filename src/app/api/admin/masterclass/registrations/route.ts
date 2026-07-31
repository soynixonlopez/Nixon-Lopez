import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth-api'
import { getMasterclassEventBySlug, MASTERCLASS_EVENT } from '@/lib/masterclass'
import { parseMasterclassRegisterBody } from '@/lib/masterclass-register'
import { buildMasterclassConfirmationContent } from '@/lib/masterclass-confirmation-email'
import { sendEmail } from '@/lib/mailer'

export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = parseMasterclassRegisterBody(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  }

  const eventSlug =
    typeof body?.event_slug === 'string' && body.event_slug.trim() ?
      body.event_slug.trim()
    : MASTERCLASS_EVENT.slug
  const event = getMasterclassEventBySlug(eventSlug)
  const sendConfirmation = body?.send_confirmation !== false
  const { nombre, email, whatsapp } = parsed.data
  const nowIso = new Date().toISOString()

  const { data: inserted, error } = await auth.supabase
    .from('masterclass_registrations')
    .insert({
      full_name: nombre,
      email,
      whatsapp,
      event_slug: event.slug,
      event_name: event.name,
      status: 'registered',
      source: 'admin_manual',
      email_notified_at: nowIso,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Ya existe un registro con ese correo para este evento.' },
        { status: 409 },
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (sendConfirmation) {
    try {
      const { html, subject } = buildMasterclassConfirmationContent({ nombre })
      await sendEmail({ to: email, subject, html })
      await auth.supabase
        .from('masterclass_registrations')
        .update({ confirmation_sent_at: nowIso })
        .eq('id', inserted.id)
    } catch (e) {
      console.error('masterclass manual confirmation email', e)
      return NextResponse.json({
        ok: true,
        id: inserted.id,
        warning: 'Registro creado, pero no se pudo enviar el correo de confirmación.',
      })
    }
  }

  return NextResponse.json({ ok: true, id: inserted.id })
}
