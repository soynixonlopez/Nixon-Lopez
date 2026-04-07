import { InvoiceCreateForm } from '@/components/admin/InvoiceCreateForm'
import { createClient } from '@/lib/supabase/server'

export default async function NuevaFacturaPage({
  searchParams,
}: {
  searchParams: Promise<{ quoteId?: string }>
}) {
  const { quoteId } = await searchParams
  let prefillQuote: Record<string, unknown> | null = null

  if (quoteId) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('quotes')
      .select(
        'id, client_first_name, client_last_name, client_email, client_phone, service_label, total_amount, converted_project_id'
      )
      .eq('id', quoteId)
      .single()
    prefillQuote = data as Record<string, unknown> | null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Nueva factura / prefactura</h1>
      <InvoiceCreateForm prefillQuote={prefillQuote as never} />
    </div>
  )
}
