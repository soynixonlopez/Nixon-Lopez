import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InvoiceEditForm } from '@/components/admin/InvoiceEditForm'
import type { InvoiceLineRow, InvoiceRecord } from '@/lib/types/invoice'

export default async function EditarFacturaPage({
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Editar factura</h1>
      <InvoiceEditForm invoice={invoice} lines={invoice.invoice_line_items ?? []} />
    </div>
  )
}
