import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/mailer'
import { createServiceRoleClient } from '@/lib/supabase/service'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const nombre = String(body.nombre ?? '')
    const apellido = String(body.apellido ?? '')
    const correo = String(body.correo ?? '')
    const tipoServicio = body.tipoServicio
    const servicio = String(body.servicio ?? '')
    const cantidadPaginas = body.cantidadPaginas
    const incluyeDominioHostingCorreo = body.incluyeDominioHostingCorreo
    const pasarelaPagos = body.pasarelaPagos
    const total = String(body.total ?? '')
    const totalNumeric = body.totalNumeric
    const comentarios = body.comentarios
    const observacionImagenes = body.observacionImagenes
    const observacionHostingDb = body.observacionHostingDb
    const tieneDominio = body.tieneDominio
    const tieneCorreo = body.tieneCorreo

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

    const supabaseAdmin = createServiceRoleClient()
    if (supabaseAdmin) {
      try {
        const pages = cantidadPaginas ? parseInt(String(cantidadPaginas), 10) : null
        const incluyeStr = String(incluyeDominioHostingCorreo ?? '')
        const includesDomainOrEmailInBudget =
          incluyeStr.includes('Sí') ||
          incluyeStr.includes('presupuesto') ||
          tieneDominio === 'no' ||
          tieneCorreo === 'no'
        const pasarelaStr = String(pasarelaPagos ?? '')
        const includesPasarela =
          pasarelaStr.startsWith('Sí') ||
          pasarelaStr.includes('add-on') ||
          pasarelaStr.includes('Servicio pasarela')
        const { error: dbError } = await supabaseAdmin.from('quotes').insert({
          source: 'website',
          status: 'new',
          client_first_name: nombre,
          client_last_name: apellido,
          client_email: correo,
          service_id: typeof tipoServicio === 'string' ? tipoServicio : null,
          service_label: servicio || null,
          quantity_pages: Number.isFinite(pages) ? pages : null,
          includes_domain_hosting_email: includesDomainOrEmailInBudget,
          payment_gateway_included: includesPasarela,
          total_amount: typeof totalNumeric === 'number' ? totalNumeric : null,
          subtotal: typeof totalNumeric === 'number' ? totalNumeric : null,
          comments: typeof comentarios === 'string' ? comentarios : null,
          raw_payload: body,
          email_notified_at: new Date().toISOString(),
        })
        if (dbError) {
          console.error('Supabase quotes insert:', dbError.message)
        }
      } catch (dbErr) {
        console.error('Supabase quotes insert (excepción):', dbErr)
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Error enviando cotización:', error)
    return NextResponse.json(
      { error: 'No se pudo enviar la cotización. Revisa la configuración SMTP.' },
      { status: 500 },
    )
  }
}
