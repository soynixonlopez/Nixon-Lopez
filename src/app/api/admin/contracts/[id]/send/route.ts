import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/admin-constants'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { generateContractPdfBuffer } from '@/lib/pdf/generateContractPdf'
import { sendEmailWithAttachments } from '@/lib/mailer'
import { escapeHtml } from '@/lib/utils'
import type { ServiceContractRecord } from '@/lib/types/contract'

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
  const to = typeof body.to === 'string' ? body.to.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  const { data, error } = await supabase.from('service_contracts').select('*').eq('id', id).single()
  if (error || !data) {
    return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 })
  }
  const contract = data as ServiceContractRecord
  const target = to || contract.client_email
  if (!target) return NextResponse.json({ error: 'Falta correo del cliente' }, { status: 400 })

  let pdfBuffer: Uint8Array
  try {
    pdfBuffer = await generateContractPdfBuffer(contract)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'No se pudo generar el PDF del contrato' }, { status: 500 })
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;">
      <p style="font-size:15px;margin:0 0 8px;">Estimado/a <strong>${escapeHtml(contract.client_name)}</strong>,</p>
      <p style="font-size:14px;color:#475569;margin:16px 0;">
        Adjuntamos su contrato de servicios <strong>${escapeHtml(contract.contract_number)}</strong>.
      </p>
      ${
        message
          ? `<p style="margin:16px 0;white-space:pre-wrap;font-size:14px;color:#1e293b;">${escapeHtml(message)}</p>`
          : ''
      }
      <p style="font-size:13px;color:#64748b;margin-top:24px;">
        ${INVOICE_BRANDING.email} · ${INVOICE_BRANDING.website}
      </p>
    </div>`

  try {
    await sendEmailWithAttachments({
      to: target,
      subject: `${contract.contract_number} — Contrato de servicios`,
      html,
      replyTo: ADMIN_EMAIL,
      attachments: [
        {
          filename: `${contract.contract_number.replace(/[^\w.-]+/g, '_')}.pdf`,
          content: Buffer.from(pdfBuffer),
        },
      ],
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'No se pudo enviar el correo' }, { status: 500 })
  }

  await supabase.from('service_contracts').update({ status: 'sent' }).eq('id', id)
  return NextResponse.json({ ok: true })
}
