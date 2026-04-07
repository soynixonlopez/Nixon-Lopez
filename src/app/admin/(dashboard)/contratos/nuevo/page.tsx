import { ContractCreateForm } from '@/components/admin/ContractCreateForm'
import { createClient } from '@/lib/supabase/server'

export default async function NuevoContratoPage({
  searchParams,
}: {
  searchParams: Promise<{ quoteId?: string }>
}) {
  const { quoteId } = await searchParams
  const supabase = await createClient()
  const { data: quotes } = await supabase
    .from('quotes')
    .select(
      'id, client_first_name, client_last_name, client_email, service_label, service_id, total_amount'
    )
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Nuevo contrato</h1>
      <ContractCreateForm quotes={(quotes ?? []) as never[]} prefillQuoteId={quoteId} />
    </div>
  )
}
