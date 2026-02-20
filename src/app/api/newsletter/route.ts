import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Inicializar Resend solo si hay API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validar email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Enviar email a tu correo con la nueva suscripción
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Newsletter <onboarding@resend.dev>', // Cambia esto cuando configures tu dominio
          to: 'soynixonlopez@gmail.com',
          subject: 'Nueva suscripción al newsletter',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #333;">Nueva Suscripción al Newsletter</h2>
              <p style="color: #666; font-size: 16px;">
                Alguien se ha suscrito a tu newsletter:
              </p>
              <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 18px; font-weight: bold; color: #333;">
                ${email}
              </p>
              <p style="color: #999; font-size: 14px; margin-top: 20px;">
                Fecha: ${new Date().toLocaleString('es-ES')}
              </p>
            </div>
          `,
        })
        console.log('Email enviado exitosamente a soynixonlopez@gmail.com')
      } catch (emailError) {
        console.error('Error al enviar email:', emailError)
        // Continuar aunque falle el envío del email
      }
    } else {
      console.warn('RESEND_API_KEY no configurada. El email no se enviará, solo se guardará en logs.')
    }

    // También logueamos el email en la consola
    console.log('Nueva suscripción al newsletter:', email)

    return NextResponse.json(
      { message: 'Suscripción exitosa', email },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al procesar suscripción:', error)
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    )
  }
}
