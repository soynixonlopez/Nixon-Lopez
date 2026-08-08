import { NextRequest, NextResponse } from 'next/server'
import { readJsonBody } from '@/lib/api-guards'
import { sendContactEmail, sendEmailWithAttachments } from '@/lib/mailer'
import { createServiceRoleClient } from '@/lib/supabase/service'
import {
  checkRateLimit,
  getClientIp,
  getPublicRateLimitWindowMs,
  getQuoteLimit,
} from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/utils'
import { generateContractPdfBuffer } from '@/lib/pdf/generateContractPdf'
import { generateQuoteSummaryPdfBuffer, type QuoteSummaryLine } from '@/lib/pdf/generateQuoteSummaryPdf'
import {
  buildQuoteClientConfirmationContent,
  buildSyntheticContractRecordForQuotePdf,
} from '@/lib/quote-client-confirmation-email'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { buildClientDocumentFilename } from '@/lib/document-filename'
import { extractQuoteServiceSnapshots } from '@/lib/quote-pricing'

function parseQuoteLines(body: Record<string, unknown>): QuoteSummaryLine[] {
  const raw = body.breakdown
  if (!raw || typeof raw !== 'object' || raw === null) return []
  const lines = (raw as { lines?: unknown }).lines
  if (!Array.isArray(lines)) return []
  const out: QuoteSummaryLine[] = []
  for (const item of lines) {
    if (!item || typeof item !== 'object') continue
    const label = typeof (item as { label?: unknown }).label === 'string' ? (item as { label: string }).label : ''
    const amountRaw = (item as { amount?: unknown }).amount
    const amount = typeof amountRaw === 'number' && Number.isFinite(amountRaw) ? amountRaw : 0
    if (label || amount) out.push({ label: label || 'Ítem', amount })
  }
  return out
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const windowMs = getPublicRateLimitWindowMs()
  const limited = checkRateLimit(`quote:${ip}`, getQuoteLimit(), windowMs)
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
    const parsed = await readJsonBody<Record<string, unknown>>(request, 256 * 1024)
    if (!parsed.ok) return parsed.response
    const body = parsed.body
    const nombre = String(body.nombre ?? '')
    const apellido = String(body.apellido ?? '')
    const correo = String(body.correo ?? '').trim()
    const empresa = typeof body.empresa === 'string' ? body.empresa.trim() : ''
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
    const monthly = body.monthly === true
    const selectedServices = extractQuoteServiceSnapshots(body)

    if (!nombre || !apellido || !correo || !servicio || !total) {
      return NextResponse.json({ error: 'Faltan datos requeridos para la cotización.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 })
    }

    const supabaseAdmin = createServiceRoleClient()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Servicio no disponible. Intenta más tarde.' },
        { status: 503 }
      )
    }

    const pages = cantidadPaginas ? parseInt(String(cantidadPaginas), 10) : null
    const incluyeStr = String(incluyeDominioHostingCorreo ?? '')
    const includesDomainOrEmailInBudget =
      incluyeStr.includes('Sí') ||
      incluyeStr.includes('presupuesto') ||
      selectedServices.some((service) => service.hasDomain === 'no' || service.hasProfessionalEmail === 'no')
    const pasarelaStr = String(pasarelaPagos ?? '')
    const includesPasarela =
      pasarelaStr.startsWith('Sí') ||
      pasarelaStr.includes('add-on') ||
      pasarelaStr.includes('Servicio pasarela') ||
      selectedServices.some(
        (service) =>
          service.serviceId === 'pasarela' ||
          service.lines.some((line) => line.label.toLowerCase().includes('pasarela'))
      )

    const totalAmount = typeof totalNumeric === 'number' && Number.isFinite(totalNumeric) ? totalNumeric : null

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('quotes')
      .insert({
        source: 'website',
        status: 'new',
        client_first_name: nombre,
        client_last_name: apellido,
        client_email: correo,
        company: empresa || null,
        client_phone:
          typeof body.whatsapp === 'string' && body.whatsapp.trim() ? body.whatsapp.trim() : null,
        service_id: selectedServices.length > 1 ? 'multiple' : typeof tipoServicio === 'string' ? tipoServicio : null,
        service_label: servicio || null,
        quantity_pages: selectedServices.length === 1 && Number.isFinite(pages) ? pages : null,
        includes_domain_hosting_email: includesDomainOrEmailInBudget,
        payment_gateway_included: includesPasarela,
        total_amount: totalAmount,
        subtotal: totalAmount,
        comments: typeof comentarios === 'string' ? comentarios : null,
        raw_payload: body,
        email_notified_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (insertError || !inserted) {
      console.error('Supabase quotes insert:', insertError?.message)
      return NextResponse.json({ error: 'No se pudo registrar la cotización. Intenta de nuevo.' }, { status: 500 })
    }

    const quoteId = (inserted as { id: string }).id
    const quoteLines = parseQuoteLines(body)

    const n = escapeHtml(nombre)
    const a = escapeHtml(apellido)
    const co = escapeHtml(correo)
    const sv = escapeHtml(servicio)
    const tot = escapeHtml(total)
    const incl = escapeHtml(String(incluyeDominioHostingCorreo ?? ''))
    const pas = escapeHtml(String(pasarelaPagos ?? ''))
    const com =
      typeof comentarios === 'string' && comentarios
        ? escapeHtml(comentarios)
        : ''
    const obsI =
      typeof observacionImagenes === 'string' && observacionImagenes
        ? escapeHtml(observacionImagenes)
        : ''
    const obsH =
      typeof observacionHostingDb === 'string' && observacionHostingDb
        ? escapeHtml(observacionHostingDb)
        : ''

    const subject = `Cotización aceptada - ${nombre} ${apellido}`
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
        <h2 style="margin-bottom: 12px;">Cotización aceptada</h2>
        <p><strong>Cliente:</strong> ${n} ${a}</p>
        <p><strong>Correo:</strong> ${co}</p>
        <p><strong>Servicio:</strong> ${sv}</p>
        ${cantidadPaginas ? `<p><strong>Cantidad de páginas:</strong> ${escapeHtml(String(cantidadPaginas))}</p>` : ''}
        <p><strong>Incluye dominio/hosting/correo:</strong> ${incl}</p>
        <p><strong>Pasarela de pagos:</strong> ${pas}</p>
        <p><strong>Total:</strong> ${tot}</p>
        <p><strong>Ref. interna:</strong> ${escapeHtml(quoteId.slice(0, 8).toUpperCase())}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        ${com ? `<hr style="margin: 16px 0;" /><p style="white-space: pre-wrap;"><strong>Comentarios:</strong><br/>${com}</p>` : ''}
        ${obsI ? `<p><strong>Observación (imágenes):</strong> ${obsI}</p>` : ''}
        ${obsH ? `<p><strong>Observación (hosting/DB):</strong> ${obsH}</p>` : ''}
      </div>
    `

    await sendContactEmail({
      subject,
      html,
      replyTo: correo,
    })

    let clientEmailSent = false
    try {
      const synthetic = buildSyntheticContractRecordForQuotePdf({
        quoteId,
        nombre,
        apellido,
        correo,
        servicio,
        tipoServicio: typeof tipoServicio === 'string' ? tipoServicio : null,
        totalNumeric: typeof totalNumeric === 'number' && Number.isFinite(totalNumeric) ? totalNumeric : 0,
        selectedServices,
      })

      const [quotePdf, contractPdf] = await Promise.all([
        generateQuoteSummaryPdfBuffer({
          quoteId,
          clientFirstName: nombre.trim(),
          clientLastName: apellido.trim(),
          clientEmail: correo.trim(),
          serviceLabel: servicio,
          createdAtIso: new Date().toISOString(),
          lines: quoteLines,
          services: selectedServices.map((service) => ({
            label: service.label,
            total: service.total,
            offerPoints: service.offerPoints,
          })),
          total: typeof totalNumeric === 'number' && Number.isFinite(totalNumeric) ? totalNumeric : 0,
          monthly,
        }),
        generateContractPdfBuffer(synthetic),
      ])

      const ref = quoteId.slice(0, 8).toUpperCase()
      const clientFullName = `${nombre.trim()} ${apellido.trim()}`.trim()
      const clientPayload = buildQuoteClientConfirmationContent({
        nombre,
        apellido,
        correo,
        servicio,
        totalDisplay: total,
        cantidadPaginas: cantidadPaginas ? String(cantidadPaginas) : undefined,
        incluyeDominioHostingCorreo: String(incluyeDominioHostingCorreo ?? ''),
        pasarelaPagos: String(pasarelaPagos ?? ''),
        comentarios: typeof comentarios === 'string' && comentarios.trim() ? comentarios.trim() : undefined,
        quoteId,
        monthly,
      })

      const noPdfBcc = process.env.QUOTE_CLIENT_PDF_NO_BCC === 'true' || process.env.QUOTE_CLIENT_PDF_NO_BCC === '1'
      const explicitBcc = process.env.QUOTE_CLIENT_PDF_BCC?.trim()
      const bccQuotePdf = noPdfBcc
        ? undefined
        : explicitBcc || process.env.CONTACT_EMAIL_TO || 'info@nixonlopez.com'

      await sendEmailWithAttachments({
        to: correo,
        subject: clientPayload.subject,
        html: clientPayload.html,
        text: clientPayload.text,
        replyTo: INVOICE_BRANDING.email,
        bcc: bccQuotePdf,
        messageIdPrefix: `quote.${quoteId}`,
        attachments: [
          {
            filename: buildClientDocumentFilename({
              kind: 'Cotizacion',
              clientName: clientFullName,
              company: empresa || null,
              ref,
            }),
            content: Buffer.from(quotePdf),
          },
          {
            filename: buildClientDocumentFilename({
              kind: 'Contrato',
              clientName: clientFullName,
              company: empresa || null,
              ref: `borrador-${ref}`,
            }),
            content: Buffer.from(contractPdf),
          },
        ],
      })
      clientEmailSent = true
    } catch (clientMailErr) {
      console.error('Correo al cliente (cotización/contrato):', clientMailErr)
    }

    return NextResponse.json({ ok: true, clientEmailSent }, { status: 200 })
  } catch (error) {
    console.error('Error enviando cotización:', error)
    return NextResponse.json(
      { error: 'No se pudo enviar la cotización. Revisa la configuración SMTP.' },
      { status: 500 },
    )
  }
}
