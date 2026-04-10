import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/admin-constants'
import { generateInvoicePdfBuffer } from '@/lib/pdf/generateInvoicePdf'
import { sendEmailWithAttachments } from '@/lib/mailer'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { escapeHtml } from '@/lib/utils'
import type { InvoiceLineRow, InvoiceRecord } from '@/lib/types/invoice'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const message =
    typeof body.message === 'string' ? body.message.trim() : ''
  const toOverride = typeof body.to === 'string' ? body.to.trim() : ''

  const { data: row, error } = await supabase
    .from('invoices')
    .select(
      `
      *,
      invoice_line_items (
        id,
        sort_order,
        description,
        quantity,
        unit_price,
        line_total
      )
    `
    )
    .eq('id', id)
    .single()

  if (error || !row) {
    return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })
  }

  const invoice = row as unknown as InvoiceRecord & {
    invoice_line_items: InvoiceLineRow[]
  }
  const lines = [...(invoice.invoice_line_items ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  const target = toOverride || invoice.client_email
  if (!target) {
    return NextResponse.json(
      { error: 'Indica un correo o guarda el correo del cliente en la factura.' },
      { status: 400 }
    )
  }

  let pdfBuffer: Uint8Array
  try {
    pdfBuffer = await generateInvoicePdfBuffer(invoice, lines)
  } catch (e) {
    console.error('generateInvoicePdfBuffer', e)
    return NextResponse.json({ error: 'No se pudo generar el PDF' }, { status: 500 })
  }

  const safeMsg = message
    ? `<p style="margin:16px 0;white-space:pre-wrap;font-size:14px;color:#1e293b;">${escapeHtml(
        message
      )}</p>`
    : ''

  const html = `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;">
    <p style="font-size:15px;margin:0 0 8px;">Estimado/a <strong>${escapeHtml(
      invoice.client_name
    )}</strong>,</p>
    ${safeMsg}
    <p style="font-size:14px;color:#475569;margin:16px 0;">
      Adjuntamos el documento <strong>${escapeHtml(invoice.invoice_number)}</strong> emitido por
      <strong>${INVOICE_BRANDING.publicName}</strong> (${INVOICE_BRANDING.ruc}).
    </p>
    <p style="font-size:13px;color:#64748b;margin-top:24px;">
      ${INVOICE_BRANDING.email} · ${INVOICE_BRANDING.website}
    </p>
  </div>`

  try {
    await sendEmailWithAttachments({
      to: target,
      subject: `${invoice.invoice_number} — ${INVOICE_BRANDING.publicName}`,
      html,
      replyTo: ADMIN_EMAIL,
      attachments: [
        {
          filename: `${invoice.invoice_number.replace(/[^\w.-]+/g, '_')}.pdf`,
          content: Buffer.from(pdfBuffer),
        },
      ],
    })
  } catch (e) {
    console.error('sendEmailWithAttachments', e)
    return NextResponse.json(
      { error: 'No se pudo enviar el correo. Revisa SMTP en .env.local.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
