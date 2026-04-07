import { createClient } from '@/lib/supabase/server'
import { QuotesTable } from '@/components/admin/QuotesTable'
import Link from 'next/link'
import { Plus } from 'lucide-react'

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
      <Link
        href="/admin/cotizacion-nueva"
        aria-label="Crear cotización"
        className="fixed bottom-6 right-6 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-2xl shadow-indigo-900/40 transition-transform hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  )
}
