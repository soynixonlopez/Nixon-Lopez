import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InvoicePrintView } from '@/components/invoice/InvoicePrintView'
import { InvoiceDetailToolbar } from '@/components/admin/InvoiceDetailToolbar'
import type { InvoiceLineRow, InvoiceRecord } from '@/lib/types/invoice'

export default async function FacturaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
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

  if (error || !data) {
    notFound()
  }

  const invoice = data as unknown as InvoiceRecord & {
    invoice_line_items: InvoiceLineRow[]
  }
  const lines = [...(invoice.invoice_line_items ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  return (
    <div className="max-w-[220mm] mx-auto">
      <InvoiceDetailToolbar
        invoiceId={invoice.id}
        invoiceNumber={invoice.invoice_number}
        clientEmail={invoice.client_email}
        clientName={invoice.client_name}
      />
      <InvoicePrintView invoice={invoice} lines={lines} />
    </div>
  )
}
