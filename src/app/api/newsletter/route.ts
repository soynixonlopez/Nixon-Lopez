import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mailer'
import {
  checkRateLimit,
  getClientIp,
  getNewsletterLimit,
  getPublicRateLimitWindowMs,
} from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const windowMs = getPublicRateLimitWindowMs()
  const limited = checkRateLimit(`newsletter:${ip}`, getNewsletterLimit(), windowMs)
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
    const { email } = await request.json()
    const raw = typeof email === 'string' ? email.trim() : ''

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!raw || !emailRegex.test(raw) || raw.length > 254) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const safe = escapeHtml(raw)

    await sendEmail({
      subject: 'Nueva suscripción al newsletter - Nixon López',
      to: process.env.NEWSLETTER_EMAIL_TO || process.env.CONTACT_EMAIL_TO || 'info@nixonlopez.com',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
          <h2 style="margin-bottom: 12px;">Nueva Suscripción al Newsletter</h2>
          <p>Alguien se ha suscrito al newsletter:</p>
          <p style="background-color: #f3f4f6; padding: 12px; border-radius: 8px; font-size: 16px;">
            <strong>${safe}</strong>
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 18px;">
            Fecha: ${new Date().toLocaleString('es-ES')}
          </p>
        </div>
      `,
      replyTo: raw,
    })

    return NextResponse.json({ message: 'Suscripción exitosa' }, { status: 200 })
  } catch (error) {
    console.error('Error al procesar suscripción de newsletter:', error)
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    )
  }
}
