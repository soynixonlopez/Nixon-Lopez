import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ContractListActions } from '@/components/admin/ContractListActions'

const statusLabel: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviado',
  signed: 'Firmado',
  cancelled: 'Cancelado',
}

export default async function ContratosPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('service_contracts')
    .select('id, contract_number, status, client_name, client_email, service_label, total_amount, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contratos de servicios</h1>
          <p className="text-slate-400 text-sm mt-1">
            Contratos profesionales listos para imprimir en PDF y enviar por correo.
          </p>
        </div>
        <Link
          href="/admin/contratos/nuevo"
          className="inline-flex justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500"
        >
          Nuevo contrato
        </Link>
      </div>
      {error && <p className="text-red-400 text-sm">{error.message}</p>}
      <div className="admin-table-scroll overflow-x-auto rounded-xl border border-slate-800/90 bg-slate-950/20">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-slate-800 bg-slate-900/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Contrato</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3 w-[72px] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {(data ?? []).map((c) => (
              <tr key={c.id} className="hover:bg-slate-900/40">
                <td className="px-4 py-3 font-mono text-xs text-white">
                  <Link href={`/admin/contratos/${c.id}`} className="hover:underline">
                    {c.contract_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-200">{c.client_name}</td>
                <td className="px-4 py-3 text-slate-300">{c.service_label}</td>
                <td className="px-4 py-3 text-slate-200 tabular-nums">${Number(c.total_amount || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-400">{statusLabel[c.status] ?? c.status}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(c.created_at).toLocaleDateString('es')}</td>
                <td className="px-4 py-3">
                  <ContractListActions
                    id={c.id}
                    contractNumber={c.contract_number}
                    clientName={c.client_name}
                    clientEmail={c.client_email}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
