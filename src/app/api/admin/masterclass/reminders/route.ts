import { NextResponse } from 'next/server'
import { ADMIN_EMAIL } from '@/lib/admin-constants'
import { requireAdminApi } from '@/lib/admin-auth-api'
import { getMasterclassEventBySlug } from '@/lib/masterclass'
import { buildMasterclassReminderContent } from '@/lib/masterclass-reminder-email'
import { sendEmail } from '@/lib/mailer'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const registrationIds = Array.isArray(body.registration_ids) ?
    body.registration_ids.filter((id: unknown) => typeof id === 'string')
  : []
  const customMessage = typeof body.custom_message === 'string' ? body.custom_message : ''
  const skipCancelled = body.skip_cancelled !== false

  let query = auth.supabase
    .from('masterclass_registrations')
    .select('id, full_name, email, event_slug, status')

  if (registrationIds.length) {
    query = query.in('id', registrationIds)
  } else if (typeof body.event_slug === 'string' && body.event_slug.trim()) {
    query = query.eq('event_slug', body.event_slug.trim())
    if (Array.isArray(body.statuses) && body.statuses.length) {
      query = query.in('status', body.statuses)
    }
  } else {
    return NextResponse.json(
      { error: 'Indica registration_ids o event_slug.' },
      { status: 400 },
    )
  }

  const { data: rows, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const targets = (rows ?? []).filter((r) => !skipCancelled || r.status !== 'cancelled')
  if (!targets.length) {
    return NextResponse.json({ error: 'No hay registros para enviar.' }, { status: 400 })
  }

  let sent = 0
  const failures: { email: string; error: string }[] = []
  const nowIso = new Date().toISOString()

  for (const row of targets) {
    const event = getMasterclassEventBySlug(row.event_slug)
    const { html, subject } = buildMasterclassReminderContent({
      nombre: row.full_name,
      event,
      customMessage,
    })

    try {
      await sendEmail({ to: row.email, subject, html, replyTo: ADMIN_EMAIL })
      await auth.supabase
        .from('masterclass_registrations')
        .update({ reminder_sent_at: nowIso, updated_at: nowIso })
        .eq('id', row.id)
      sent += 1
    } catch (e) {
      failures.push({
        email: row.email,
        error: e instanceof Error ? e.message : 'Error al enviar',
      })
    }

    await sleep(350)
  }

  return NextResponse.json({
    ok: true,
    sent,
    failed: failures.length,
    failures: failures.slice(0, 5),
  })
}
