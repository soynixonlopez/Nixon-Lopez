import { NextRequest, NextResponse } from 'next/server'
import { readJsonBody } from '@/lib/api-guards'
import { sendContactEmail, sendEmail } from '@/lib/mailer'
import { buildMasterclassConfirmationContent } from '@/lib/masterclass-confirmation-email'
import { isJsonRequest, parseMasterclassRegisterBody } from '@/lib/masterclass-register'
import { MASTERCLASS_EVENT } from '@/lib/masterclass'
import {
  checkRateLimit,
  getClientIp,
  getMasterclassLimit,
  getPublicRateLimitWindowMs,
} from '@/lib/rate-limit'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { escapeHtml } from '@/lib/utils'

export async function POST(request: NextRequest) {
  if (!isJsonRequest(request)) {
    return NextResponse.json({ error: 'Content-Type debe ser application/json.' }, { status: 415 })
  }

  const ip = getClientIp(request)
  const windowMs = getPublicRateLimitWindowMs()
  const limited = checkRateLimit(`masterclass:${ip}`, getMasterclassLimit(), windowMs)
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limited.retryAfterSec) },
      },
    )
  }

  try {
    const raw = await readJsonBody<Record<string, unknown>>(request, 32 * 1024)
    if (!raw.ok) return raw.response
    const parsed = parseMasterclassRegisterBody(raw.body)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status })
    }

    const { nombre, email, whatsapp } = parsed.data

    const supabaseAdmin = createServiceRoleClient()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Servicio no disponible. Intenta más tarde.' },
        { status: 503 },
      )
    }

    const normalizedEmail = email
    const nowIso = new Date().toISOString()

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('masterclass_registrations')
      .insert({
        full_name: nombre,
        email: normalizedEmail,
        whatsapp,
        event_slug: MASTERCLASS_EVENT.slug,
        event_name: MASTERCLASS_EVENT.name,
        status: 'registered',
        source: 'website',
        email_notified_at: nowIso,
      })
      .select('id')
      .single()

    let alreadyRegistered = false

    if (insertError) {
      if (insertError.code === '23505') {
        alreadyRegistered = true
      } else {
        console.error('Supabase masterclass insert:', insertError.message)
        return NextResponse.json(
          { error: 'No se pudo completar el registro. Intenta de nuevo en unos minutos.' },
          { status: 500 },
        )
      }
    }

    const n = escapeHtml(nombre)
    const e = escapeHtml(normalizedEmail)
    const w = escapeHtml(whatsapp)

    if (!alreadyRegistered) {
      const subject = `Nuevo registro Masterclass — ${nombre}`
      const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
        <h2 style="margin-bottom: 12px;">Nuevo registro — Masterclass IA</h2>
        <p><strong>Evento:</strong> ${escapeHtml(MASTERCLASS_EVENT.name)}</p>
        <p><strong>Fecha:</strong> ${escapeHtml(MASTERCLASS_EVENT.dateLabel)} · ${escapeHtml(MASTERCLASS_EVENT.timeLabel)} (${escapeHtml(MASTERCLASS_EVENT.timezoneLabel)})</p>
        <p><strong>WhatsApp:</strong> <a href="${escapeHtml(MASTERCLASS_EVENT.whatsappCommunityUrl)}">${escapeHtml(MASTERCLASS_EVENT.whatsappCommunityUrl)}</a></p>
        <p><strong>Google Meet:</strong> <a href="${escapeHtml(MASTERCLASS_EVENT.googleMeetUrl)}">${escapeHtml(MASTERCLASS_EVENT.googleMeetUrl)}</a></p>
        <hr style="margin: 16px 0;" />
        <p><strong>Nombre:</strong> ${n}</p>
        <p><strong>Correo:</strong> ${e}</p>
        <p><strong>WhatsApp:</strong> ${w}</p>
        <p><strong>Registrado:</strong> ${new Date().toLocaleString('es-ES')}</p>
        ${inserted?.id ? `<p><strong>Ref.:</strong> ${escapeHtml(String(inserted.id).slice(0, 8).toUpperCase())}</p>` : ''}
      </div>
    `

      await sendContactEmail({
        subject,
        html,
        replyTo: normalizedEmail,
      })
    }

    const confirmContent = buildMasterclassConfirmationContent({ nombre })

    if (!alreadyRegistered) {
      await sendEmail({
        subject: confirmContent.subject,
        html: confirmContent.html,
        to: normalizedEmail,
      })

      if (inserted?.id) {
        await supabaseAdmin
          .from('masterclass_registrations')
          .update({ confirmation_sent_at: new Date().toISOString() })
          .eq('id', inserted.id)
      }
    }

    return NextResponse.json({ ok: true, alreadyRegistered }, { status: 200 })
  } catch (error) {
    console.error('Error registro masterclass:', error)
    return NextResponse.json(
      { error: 'No se pudo completar el registro. Intenta de nuevo en unos minutos.' },
      { status: 500 },
    )
  }
}
