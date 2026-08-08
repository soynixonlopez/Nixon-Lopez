import Link from 'next/link'
import { PanelsTopLeft, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { adminUi } from '@/lib/admin-ui'
import { LandingsBoard } from '@/components/admin/LandingsBoard'
import {
  normalizeLandingContent,
  normalizeLandingPayment,
  type LandingPageRow,
} from '@/lib/landing-pages'

export default async function LandingsAdminPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .order('updated_at', { ascending: false })

  const landings: LandingPageRow[] = (data ?? []).map((row) => ({
    ...row,
    price_amount: Number(row.price_amount ?? 0),
    content: normalizeLandingContent(row.content),
    payment: normalizeLandingPayment(row.payment),
  }))

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-center sm:text-left">
          <h1
            className={`${adminUi.pageTitle} flex items-center justify-center gap-2 sm:justify-start`}
          >
            <PanelsTopLeft className="h-8 w-8 text-brand" aria-hidden />
            Landings
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500 sm:mx-0">
            Editor completo: textos, imágenes, precio del servicio y checkout (Hotmart, Paguelo
            Fácil, Cubo, Yappy o transferencia). La página pública se genera sola en{' '}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">/l/tu-slug</code>.
          </p>
        </div>
        <Link
          href="/admin/landings/nueva"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Nueva landing
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No se pudo cargar <code className="font-mono">landing_pages</code>: {error.message}.
          Ejecuta la migración{' '}
          <code className="font-mono">20260807210000_landing_pages.sql</code> en Supabase.
        </div>
      )}

      <LandingsBoard landings={landings} />
    </div>
  )
}
