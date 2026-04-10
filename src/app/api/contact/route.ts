import { NextRequest, NextResponse } from 'next/server'
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
    const { nombre, apellido, correo, tipoServicio, descripcion } = await request.json()

    if (!nombre || !apellido || !correo || !tipoServicio || !descripcion) {
      return NextResponse.json({ error: 'Todos los campos son requeridos.' }, { status: 400 })
    }

    const MAX = 8000
    if (
      String(nombre).length > 200 ||
      String(apellido).length > 200 ||
      String(tipoServicio).length > 200 ||
      String(descripcion).length > MAX
    ) {
      return NextResponse.json({ error: 'Uno o más campos exceden la longitud permitida.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 })
    }

    const n = escapeHtml(String(nombre))
    const a = escapeHtml(String(apellido))
    const c = escapeHtml(String(correo))
    const t = escapeHtml(String(tipoServicio))
    const d = escapeHtml(String(descripcion))

    const subject = `Nuevo contacto web - ${nombre} ${apellido}`
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
      replyTo: correo,
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
