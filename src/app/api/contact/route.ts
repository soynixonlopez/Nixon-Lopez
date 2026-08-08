import { NextRequest, NextResponse } from 'next/server'
import { readJsonBody } from '@/lib/api-guards'
import { sendContactEmail } from '@/lib/mailer'
import {
  checkRateLimit,
  getClientIp,
  getContactLimit,
  getPublicRateLimitWindowMs,
} from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const windowMs = getPublicRateLimitWindowMs()
  const limited = checkRateLimit(`contact:${ip}`, getContactLimit(), windowMs)
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limited.retryAfterSec) },
      }
    )
  }

  try {
    const parsed = await readJsonBody<{
      nombre?: unknown
      apellido?: unknown
      correo?: unknown
      tipoServicio?: unknown
      descripcion?: unknown
    }>(request)
    if (!parsed.ok) return parsed.response
    const { nombre, apellido, correo, tipoServicio, descripcion } = parsed.body

    const nombreStr = typeof nombre === 'string' ? nombre.trim() : ''
    const apellidoStr = typeof apellido === 'string' ? apellido.trim() : ''
    const correoStr = typeof correo === 'string' ? correo.trim() : ''
    const tipoStr = typeof tipoServicio === 'string' ? tipoServicio.trim() : ''
    const descripcionStr = typeof descripcion === 'string' ? descripcion.trim() : ''

    if (!nombreStr || !apellidoStr || !correoStr || !tipoStr || !descripcionStr) {
      return NextResponse.json({ error: 'Todos los campos son requeridos.' }, { status: 400 })
    }

    const MAX = 8000
    if (
      nombreStr.length > 200 ||
      apellidoStr.length > 200 ||
      tipoStr.length > 200 ||
      descripcionStr.length > MAX
    ) {
      return NextResponse.json({ error: 'Uno o más campos exceden la longitud permitida.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correoStr)) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 })
    }

    const n = escapeHtml(nombreStr)
    const a = escapeHtml(apellidoStr)
    const c = escapeHtml(correoStr)
    const t = escapeHtml(tipoStr)
    const d = escapeHtml(descripcionStr)

    const subject = `Nuevo contacto web - ${nombreStr} ${apellidoStr}`
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
        <h2 style="margin-bottom: 12px;">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${n} ${a}</p>
        <p><strong>Correo:</strong> ${c}</p>
        <p><strong>Servicio:</strong> ${t}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        <hr style="margin: 16px 0;" />
        <p style="white-space: pre-wrap;"><strong>Descripción:</strong><br/>${d}</p>
      </div>
    `

    await sendContactEmail({
      subject,
      html,
      replyTo: correoStr,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Error enviando contacto:', error)
    return NextResponse.json(
      { error: 'No se pudo enviar el mensaje. Revisa la configuración SMTP.' },
      { status: 500 },
    )
  }
}
