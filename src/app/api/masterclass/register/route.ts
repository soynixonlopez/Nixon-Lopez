import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, sendEmail } from '@/lib/mailer'
import { MASTERCLASS_EVENT } from '@/lib/masterclass'
import {
  checkRateLimit,
  getClientIp,
  getContactLimit,
  getPublicRateLimitWindowMs,
} from '@/lib/rate-limit'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { escapeHtml } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const windowMs = getPublicRateLimitWindowMs()
  const limited = checkRateLimit(`masterclass:${ip}`, getContactLimit(), windowMs)
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
    const { nombre, email, whatsapp } = await request.json()

    if (!nombre || !email || !whatsapp) {
      return NextResponse.json({ error: 'Todos los campos son requeridos.' }, { status: 400 })
    }

    if (String(nombre).length > 200 || String(whatsapp).length > 40) {
      return NextResponse.json({ error: 'Uno o más campos exceden la longitud permitida.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(email))) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 })
    }

    const supabaseAdmin = createServiceRoleClient()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Servicio no disponible. Intenta más tarde.' },
        { status: 503 },
      )
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const nowIso = new Date().toISOString()

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('masterclass_registrations')
      .insert({
        full_name: String(nombre).trim(),
        email: normalizedEmail,
        whatsapp: String(whatsapp).trim(),
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

    const n = escapeHtml(String(nombre))
    const e = escapeHtml(normalizedEmail)
    const w = escapeHtml(String(whatsapp))

    if (!alreadyRegistered) {
      const subject = `Nuevo registro Masterclass — ${nombre}`
      const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
        <h2 style="margin-bottom: 12px;">Nuevo registro — Masterclass IA</h2>
        <p><strong>Evento:</strong> ${escapeHtml(MASTERCLASS_EVENT.name)}</p>
        <p><strong>Fecha:</strong> ${escapeHtml(MASTERCLASS_EVENT.dateLabel)} · ${escapeHtml(MASTERCLASS_EVENT.timeLabel)}</p>
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

    const confirmHtml = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #111827; max-width: 560px;">
        <h2 style="color: #1e3a5f;">¡Tu cupo está reservado, ${n}!</h2>
        <p>Gracias por registrarte en la masterclass gratuita.</p>
        <p><strong>${escapeHtml(MASTERCLASS_EVENT.name)}</strong></p>
        <ul style="padding-left: 20px;">
          <li>📅 ${escapeHtml(MASTERCLASS_EVENT.dateLabel)}</li>
          <li>⏰ ${escapeHtml(MASTERCLASS_EVENT.timeLabel)}</li>
          <li>💻 ${escapeHtml(MASTERCLASS_EVENT.modality)}</li>
        </ul>
        <p>Te enviaremos el enlace de acceso antes del evento. ¡Nos vemos en vivo!</p>
        <p style="margin-top: 24px; color: #64748b; font-size: 14px;">— Nixon López</p>
      </div>
    `

    if (!alreadyRegistered) {
      await sendEmail({
        subject: 'Confirmación — Masterclass gratuita con IA',
        html: confirmHtml,
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
