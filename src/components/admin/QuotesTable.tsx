'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { QuoteListActions } from '@/components/admin/QuoteListActions'

type Quote = {
  id: string
  created_at: string
  status: string
  client_first_name: string
  client_last_name: string
  client_email: string
  service_label: string | null
  total_amount: number | null
}

const statusLabels: Record<string, string> = {
  new: 'Nueva',
  reviewing: 'En revisión',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  converted_to_project: '→ Proyecto',
  archived: 'Archivada',
}

export function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const router = useRouter()

  async function setStatus(id: string, status: string) {
    const supabase = createClient()
    await supabase.from('quotes').update({ status }).eq('id', id)
    router.refresh()
  }

  if (!quotes.length) {
    return <p className="text-slate-400">No hay cotizaciones aún.</p>
  }

  return (
    <>
      {/* Móvil: tarjetas apiladas, sin scroll horizontal */}
      <div className="md:hidden space-y-3">
        {quotes.map((q) => (
          <article
            key={q.id}
            className="rounded-xl border border-slate-800/90 bg-slate-950/40 p-4 space-y-3 min-w-0"
          >
            <div className="flex items-start justify-between gap-2 min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium truncate">
                  {q.client_first_name} {q.client_last_name}
                </p>
                <p className="text-xs text-slate-500 break-all">{q.client_email}</p>
              </div>
              <QuoteListActions
                id={q.id}
                label={`${q.client_first_name} ${q.client_last_name}`.trim()}
              />
            </div>
            <p className="text-xs text-slate-500">
              {new Date(q.created_at).toLocaleString('es')}
            </p>
            <p className="text-sm text-slate-300 line-clamp-2">{q.service_label ?? '—'}</p>
            <div className="flex flex-wrap items-center gap-2 gap-y-2">
              <span className="tabular-nums text-slate-200 font-medium shrink-0">
                {q.total_amount != null ? `$${Number(q.total_amount).toFixed(2)}` : '—'}
              </span>
              <select
                value={q.status}
                onChange={(e) => setStatus(q.id, e.target.value)}
                className="w-[min(100%,12.5rem)] shrink-0 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs print:hidden"
              >
                {Object.keys(statusLabels).map((k) => (
                  <option key={k} value={k}>
                    {statusLabels[k]}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>

      {/* Tablet/desktop: tabla */}
      <div className="hidden md:block admin-table-scroll overflow-x-auto rounded-xl border border-slate-800/90 bg-slate-950/20">
        <table className="w-full min-w-[760px] text-sm text-left">
          <thead className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="w-12 px-1 py-3 text-center">
                <span className="sr-only">Opciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                  {new Date(q.created_at).toLocaleString('es')}
                </td>
                <td className="px-4 py-3 text-white">
                  {q.client_first_name} {q.client_last_name}
                  <div className="text-xs text-slate-500">{q.client_email}</div>
                </td>
                <td className="px-4 py-3 text-slate-300 max-w-[220px] truncate">{q.service_label ?? '—'}</td>
                <td className="px-4 py-3 tabular-nums text-slate-200">
                  {q.total_amount != null ? `$${Number(q.total_amount).toFixed(2)}` : '—'}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={q.status}
                    onChange={(e) => setStatus(q.id, e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs max-w-[150px] print:hidden"
                  >
                    {Object.keys(statusLabels).map((k) => (
                      <option key={k} value={k}>
                        {statusLabels[k]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2 text-center align-middle">
                  <QuoteListActions
                    id={q.id}
                    label={`${q.client_first_name} ${q.client_last_name}`.trim()}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
