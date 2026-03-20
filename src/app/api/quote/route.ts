import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nombre,
      apellido,
      correo,
      servicio,
      cantidadPaginas,
      incluyeDominioHostingCorreo,
      pasarelaPagos,
      total,
      comentarios,
      observacionImagenes,
      observacionHostingDb,
    } = body

    if (!nombre || !apellido || !correo || !servicio || !total) {
      return NextResponse.json({ error: 'Faltan datos requeridos para la cotización.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 })
    }

    const subject = `Cotización aceptada - ${nombre} ${apellido}`
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
        <h2 style="margin-bottom: 12px;">Cotización aceptada</h2>
        <p><strong>Cliente:</strong> ${nombre} ${apellido}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Servicio:</strong> ${servicio}</p>
        ${cantidadPaginas ? `<p><strong>Cantidad de páginas:</strong> ${cantidadPaginas}</p>` : ''}
        <p><strong>Incluye dominio/hosting/correo:</strong> ${incluyeDominioHostingCorreo}</p>
        <p><strong>Pasarela de pagos:</strong> ${pasarelaPagos}</p>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        ${comentarios ? `<hr style="margin: 16px 0;" /><p style="white-space: pre-wrap;"><strong>Comentarios:</strong><br/>${comentarios}</p>` : ''}
        ${observacionImagenes ? `<p><strong>Observación (imágenes):</strong> ${observacionImagenes}</p>` : ''}
        ${observacionHostingDb ? `<p><strong>Observación (hosting/DB):</strong> ${observacionHostingDb}</p>` : ''}
      </div>
    `

    await sendContactEmail({
      subject,
      html,
      replyTo: correo,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Error enviando cotización:', error)
    return NextResponse.json(
      { error: 'No se pudo enviar la cotización. Revisa la configuración SMTP.' },
      { status: 500 },
    )
  }
}
