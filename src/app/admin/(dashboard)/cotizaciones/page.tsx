import { createClient } from '@/lib/supabase/server'
import { QuotesTable } from '@/components/admin/QuotesTable'

export default async function CotizacionesPage() {
  const supabase = await createClient()
  const { data: quotes, error } = await supabase
    .from('quotes')
    .select(
      'id, created_at, status, client_first_name, client_last_name, client_email, service_label, total_amount'
    )
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Cotizaciones</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl mx-auto sm:mx-0">
          Solicitudes del sitio web y cotizaciones manuales. Usa el menú ⋮ para ver, imprimir PDF o editar.
        </p>
      </div>
      {error && (
        <p className="text-red-400 text-sm">
          Error al cargar: {error.message}. Verifica variables NEXT_PUBLIC_SUPABASE_* y la migración SQL.
        </p>
      )}
      <QuotesTable quotes={(quotes ?? []) as never[]} />
    </div>
  )
}
