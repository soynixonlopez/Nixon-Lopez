import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { InvoiceListActions } from '@/components/admin/InvoiceListActions'

export default async function FacturasPage() {
  const supabase = await createClient()
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('id, invoice_number, invoice_kind, invoice_status, client_name, total_amount, amount_paid, created_at, is_abono')
    .order('created_at', { ascending: false })

  const kindLabel = (k: string) => (k === 'prefactura' ? 'Prefactura' : 'Final')

  const list = invoices ?? []

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Facturas</h1>
          <p className="text-slate-400 text-sm mt-1">Prefacturas con abono o facturas finales.</p>
        </div>
        <Link
          href="/admin/facturas/nueva"
          className="inline-flex justify-center px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-light"
        >
          Nueva factura
        </Link>
      </div>
      {error && <p className="text-red-600 text-sm">{error.message}</p>}

      <div className="md:hidden space-y-3">
        {list.map((inv) => (
          <article
            key={inv.id}
            className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-2 min-w-0"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-sm text-slate-900 break-all">{inv.invoice_number}</p>
                <p className="text-slate-700 text-sm mt-1">{inv.client_name}</p>
              </div>
              <InvoiceListActions id={inv.id} invoiceNumber={inv.invoice_number} />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
              <span>{kindLabel(inv.invoice_kind)}</span>
              {inv.is_abono && <span className="text-amber-400/90">(abono)</span>}
              <span>{inv.invoice_status}</span>
              <span>{new Date(inv.created_at).toLocaleDateString('es')}</span>
            </div>
            <div className="flex justify-between text-sm tabular-nums pt-1 border-t border-slate-200">
              <span className="text-slate-400">Total</span>
              <span className="text-slate-700">${Number(inv.total_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm tabular-nums">
              <span className="text-slate-400">Pagado</span>
              <span className="text-slate-600">${Number(inv.amount_paid ?? 0).toFixed(2)}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block admin-table-scroll overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Número</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Pagado</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="w-12 max-w-[3rem] px-1 py-3 text-center">
                <span className="sr-only">Opciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {list.map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-slate-100 transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-900">{inv.invoice_number}</td>
                <td className="px-4 py-3 text-slate-600">
                  {kindLabel(inv.invoice_kind)}
                  {inv.is_abono && (
                    <span className="ml-1 text-xs text-amber-400/90">(abono)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-700">{inv.client_name}</td>
                <td className="px-4 py-3 tabular-nums text-slate-700">
                  ${Number(inv.total_amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-600">
                  ${Number(inv.amount_paid ?? 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-slate-400">{inv.invoice_status}</td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                  {new Date(inv.created_at).toLocaleDateString('es')}
                </td>
                <td className="px-2 py-2 text-center align-middle">
                  <InvoiceListActions id={inv.id} invoiceNumber={inv.invoice_number} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!list.length && !error && (
        <p className="text-slate-500 text-sm">No hay facturas todavía.</p>
      )}
    </div>
  )
}
