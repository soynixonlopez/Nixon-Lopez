import { ContractCreateForm } from '@/components/admin/ContractCreateForm'
import { AdminSupabaseSetupNotice } from '@/components/admin/AdminSupabaseSetupNotice'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/public-config'

export default async function NuevoContratoPage({
  searchParams,
}: {
  searchParams: Promise<{ quoteId?: string }>
}) {
  const { quoteId } = await searchParams

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-xl space-y-6 px-4 sm:px-0">
        <h1 className="text-center text-2xl font-bold text-slate-900">Nuevo contrato</h1>
        <AdminSupabaseSetupNotice />
      </div>
    )
  }

  let quotes: unknown[] = []
  let loadError: string | null = null

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('quotes')
      .select(
        'id, client_first_name, client_last_name, client_email, service_label, service_id, total_amount, raw_payload'
      )
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) loadError = error.message
    else quotes = data ?? []
  } catch (e) {
    loadError = e instanceof Error ? e.message : 'No se pudo conectar con Supabase.'
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 px-4 sm:px-0">
      <h1 className="text-center text-2xl font-bold text-slate-900">Nuevo contrato</h1>
      {loadError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Error al cargar cotizaciones: {loadError}
        </p>
      ) : null}
      <ContractCreateForm quotes={quotes as never[]} prefillQuoteId={quoteId} />
    </div>
  )
}
