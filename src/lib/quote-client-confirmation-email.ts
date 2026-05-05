import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { SITE_URL } from '@/lib/site-config'
import { buildWhatsAppContractHandoffUrl } from '@/lib/site-contact'
import { escapeHtml } from '@/lib/utils'
import type { ServiceContractRecord } from '@/lib/types/contract'

export function buildSyntheticContractRecordForQuotePdf(params: {
  quoteId: string
  nombre: string
  apellido: string
  correo: string
  servicio: string
  tipoServicio: string | null
  totalNumeric: number
}): ServiceContractRecord {
  const now = new Date().toISOString()
  return {
    id: params.quoteId,
    created_at: now,
    updated_at: now,
    contract_number: `WEB-${params.quoteId.slice(0, 8).toUpperCase()}`,
    status: 'draft',
    quote_id: params.quoteId,
    client_name: `${params.nombre.trim()} ${params.apellido.trim()}`.trim(),
    client_email: params.correo.trim(),
    client_tax_id: null,
    client_address: null,
    city: null,
    service_type: params.tipoServicio,
    service_label: params.servicio,
    total_amount: Number.isFinite(params.totalNumeric) ? params.totalNumeric : 0,
    currency: 'USD',
    signed_date: null,
    custom_notes:
      'Borrador generado desde tu cotización en línea. Completa cédula o RUC y domicilio donde aplique, imprime, firma y envía el PDF por WhatsApp siguiendo el enlace del correo.',
    terms_payload: null,
  }
}

export type QuoteClientEmailPayload = {
  nombre: string
  apellido: string
  correo: string
  servicio: string
  totalDisplay: string
  cantidadPaginas?: string
  incluyeDominioHostingCorreo: string
  pasarelaPagos: string
  comentarios?: string
  quoteId: string
  monthly?: boolean
}

export function buildQuoteClientConfirmationContent(p: QuoteClientEmailPayload) {
  const first = escapeHtml(p.nombre.trim())
  const quoteRef = escapeHtml(p.quoteId.slice(0, 8).toUpperCase())
  const fullName = `${p.nombre.trim()} ${p.apellido.trim()}`
  const waUrl = buildWhatsAppContractHandoffUrl({
    clientFullName: fullName,
    quoteRef: p.quoteId.slice(0, 8).toUpperCase(),
  })
  const waUrlEsc = escapeHtml(waUrl)
  const preheader = `Tu cotización ${p.quoteId.slice(0, 8).toUpperCase()}, contrato en adjunto y siguiente paso por WhatsApp.`
  const brand = escapeHtml(INVOICE_BRANDING.publicName)
  const site = escapeHtml(SITE_URL)
  const addr = escapeHtml(
    `${INVOICE_BRANDING.addressLine1}, ${INVOICE_BRANDING.addressLine2}, ${INVOICE_BRANDING.country}`
  )
  const privacyUrl = `${SITE_URL}/politica-de-privacidad`

  const rows: string[] = [
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Servicio</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#334155;text-align:right;">${escapeHtml(p.servicio)}</td></tr>`,
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Total</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:16px;font-weight:700;color:${INVOICE_BRANDING.accentHex};text-align:right;">${escapeHtml(p.totalDisplay)}</td></tr>`,
  ]
  if (p.cantidadPaginas) {
    rows.unshift(
      `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Páginas</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#334155;text-align:right;">${escapeHtml(p.cantidadPaginas)}</td></tr>`
    )
  }
  if (p.comentarios) {
    rows.push(
      `<tr><td colspan="2" style="padding:12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#475569;">${escapeHtml(p.comentarios)}</td></tr>`
    )
  }

  const transactionalNote = `Recibes este mensaje porque solicitaste una cotización en ${site}. Es un correo transaccional relacionado con tu solicitud (no newsletters).`

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tu cotización y contrato — ${brand}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg, ${INVOICE_BRANDING.accentHex} 0%, #0f172a 100%);padding:28px 24px;">
              <p style="margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;">${brand}</p>
              <p style="margin:8px 0 0;font-family:system-ui,-apple-system,sans-serif;font-size:13px;color:rgba(255,255,255,0.88);">Cotización confirmada · Ref. ${quoteRef}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px;font-family:system-ui,-apple-system,sans-serif;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.55;color:#0f172a;">Hola <strong>${first}</strong>,</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#334155;">Gracias por confiar en nosotros. Adjunto vas a encontrar <strong>dos archivos PDF</strong>:</p>
              <ul style="margin:0 0 20px;padding-left:20px;font-size:14px;line-height:1.6;color:#334155;">
                <li style="margin-bottom:8px;"><strong>Resumen de tu cotización</strong> — detalle y montos.</li>
                <li><strong>Contrato de prestación de servicios (borrador)</strong> — léelo con calma, complétalo donde corresponda y firmalo.</li>
              </ul>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:#334155;"><strong>Siguiente paso:</strong> lee el contrato, imprímelo, complétalo y fírmalo. Luego envíanos el PDF por WhatsApp a Nixon López pulsando el botón siguiente (se abrirá WhatsApp con un mensaje listo para enviar).</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px;" align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-radius:8px;background-color:#25D366;">
                    <a href="${waUrlEsc}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 28px;font-family:system-ui,-apple-system,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">Enviar contrato por WhatsApp</a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;font-size:12px;line-height:1.45;color:#64748b;font-family:system-ui,-apple-system,sans-serif;">Si el botón no funciona, copia y pega este enlace en el navegador:<br /><span style="word-break:break-all;color:#475569;">${waUrlEsc}</span></p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px;font-family:system-ui,-apple-system,sans-serif;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Resumen</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                ${rows.join('')}
                <tr><td style="padding:8px 12px;font-size:12px;color:#64748b;" colspan="2">Dominio/hosting/correo: ${escapeHtml(p.incluyeDominioHostingCorreo)}</td></tr>
                <tr><td style="padding:8px 12px;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;" colspan="2">Pasarela de pagos: ${escapeHtml(p.pasarelaPagos)}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 28px;font-family:system-ui,-apple-system,sans-serif;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;">${escapeHtml(transactionalNote)} Si no realizaste esta solicitud, puedes ignorar este mensaje.</p>
              <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#94a3b8;"><a href="${escapeHtml(privacyUrl)}" style="color:#64748b;">Política de privacidad</a> · <a href="${site}" style="color:#64748b;">${site}</a></p>
              <p style="margin:16px 0 0;font-size:11px;line-height:1.45;color:#94a3b8;">${brand} · RUC ${escapeHtml(INVOICE_BRANDING.ruc)}<br />${addr}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `${INVOICE_BRANDING.publicName} — Cotización Ref. ${p.quoteId.slice(0, 8).toUpperCase()}`,
    '',
    `Hola ${p.nombre},`,
    '',
    'Gracias por tu solicitud. Adjuntamos en PDF el resumen de tu cotización y el borrador del contrato de prestación de servicios.',
    '',
    'Siguiente paso: lee el contrato, complétalo y fírmalo; luego envía el PDF por WhatsApp usando este enlace:',
    waUrl,
    '',
    `Resumen: ${p.servicio} — Total: ${p.totalDisplay}`,
    p.cantidadPaginas ? `Páginas: ${p.cantidadPaginas}` : '',
    `Dominio/hosting/correo: ${p.incluyeDominioHostingCorreo}`,
    `Pasarela: ${p.pasarelaPagos}`,
    '',
    transactionalNote,
    '',
    `Política de privacidad: ${privacyUrl}`,
    `${INVOICE_BRANDING.publicName} · ${INVOICE_BRANDING.email} · ${INVOICE_BRANDING.ruc}`,
    `${INVOICE_BRANDING.addressLine1}, ${INVOICE_BRANDING.country}`,
  ]
    .filter(Boolean)
    .join('\n')

  const subject = `Tu cotización y contrato · Ref. ${p.quoteId.slice(0, 8).toUpperCase()} — ${INVOICE_BRANDING.publicName}`

  return { html, text, subject, whatsappUrl: waUrl }
}
