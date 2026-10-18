import { CommercialSettingsForm } from '@/components/admin/CommercialSettingsForm'
import { DEFAULT_COMMERCIAL_OFFER, parseCommercialOffer } from '@/lib/commercial-settings'
import { createClient } from '@/lib/supabase/server'

export default async function ComercialSettingsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('commercial_settings').select('*').eq('id', 1).maybeSingle()
  const initial = data ? parseCommercialOffer(data) : DEFAULT_COMMERCIAL_OFFER

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Condiciones comerciales</h1>
        <p className="mt-2 text-sm text-slate-500">
          Historias y presupuesto publicitario recomendado. Cambiar estos valores no modifica cotizaciones ni contratos ya guardados.
        </p>
      </div>
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          No se pudo leer la configuración ({error.message}). Aplica la migración
          `20261017190000_commercial_settings.sql` en Supabase. Mientras tanto, las historias no tienen precio y el
          presupuesto recomendado sigue en ${DEFAULT_COMMERCIAL_OFFER.recommendedAdBudgetUsd}.
        </p>
      ) : null}
      <CommercialSettingsForm initial={initial} />
    </div>
  )
}
