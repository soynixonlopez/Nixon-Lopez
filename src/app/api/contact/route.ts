import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  try {
    const { nombre, apellido, correo, tipoServicio, descripcion } = await request.json()

    if (!nombre || !apellido || !correo || !tipoServicio || !descripcion) {
      return NextResponse.json({ error: 'Todos los campos son requeridos.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 })
    }

    const subject = `Nuevo contacto web - ${nombre} ${apellido}`
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
        <h2 style="margin-bottom: 12px;">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Servicio:</strong> ${tipoServicio}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        <hr style="margin: 16px 0;" />
        <p style="white-space: pre-wrap;"><strong>Descripción:</strong><br/>${descripcion}</p>
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
