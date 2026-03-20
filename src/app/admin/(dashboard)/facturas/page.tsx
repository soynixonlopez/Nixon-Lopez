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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Facturas</h1>
          <p className="text-slate-400 text-sm mt-1">Prefacturas con abono o facturas finales.</p>
        </div>
        <Link
          href="/admin/facturas/nueva"
          className="inline-flex justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500"
        >
          Nueva factura
        </Link>
      </div>
      {error && <p className="text-red-400 text-sm">{error.message}</p>}
      <div className="admin-table-scroll overflow-x-auto rounded-xl border border-slate-800/90 bg-slate-950/20">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-slate-800 bg-slate-900/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
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
          <tbody className="divide-y divide-slate-800">
            {(invoices ?? []).map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-slate-800/60 transition-colors hover:bg-slate-900/40"
              >
                <td className="px-4 py-3 font-mono text-xs text-white">{inv.invoice_number}</td>
                <td className="px-4 py-3 text-slate-300">
                  {kindLabel(inv.invoice_kind)}
                  {inv.is_abono && (
                    <span className="ml-1 text-xs text-amber-400/90">(abono)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-200">{inv.client_name}</td>
                <td className="px-4 py-3 tabular-nums text-slate-200">
                  ${Number(inv.total_amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-300">
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
      {!invoices?.length && !error && (
        <p className="text-slate-500 text-sm">No hay facturas todavía.</p>
      )}
    </div>
  )
}
