'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { ContractStatus, ServiceContractRecord } from '@/lib/types/contract'

const statusOptions: { value: ContractStatus; label: string }[] = [
  { value: 'draft', label: 'Borrador' },
  { value: 'sent', label: 'Enviado' },
  { value: 'signed', label: 'Firmado' },
  { value: 'cancelled', label: 'Cancelado' },
]

export function ContractEditForm({ contract }: { contract: ServiceContractRecord }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clientName, setClientName] = useState(contract.client_name)
  const [clientEmail, setClientEmail] = useState(contract.client_email ?? '')
  const [clientTaxId, setClientTaxId] = useState(contract.client_tax_id ?? '')
  const [clientAddress, setClientAddress] = useState(contract.client_address ?? '')
  const [city, setCity] = useState(contract.city ?? '')
  const [serviceLabel, setServiceLabel] = useState(contract.service_label)
  const [totalAmount, setTotalAmount] = useState(String(contract.total_amount ?? 0))
  const [customNotes, setCustomNotes] = useState(contract.custom_notes ?? '')
  const [status, setStatus] = useState<ContractStatus>(contract.status)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const amount = Number.parseFloat(totalAmount.replace(',', '.'))
    if (Number.isNaN(amount) || amount < 0) {
      setLoading(false)
      alert('Importe total no válido')
      return
    }
    const { error } = await supabase
      .from('service_contracts')
      .update({
        client_name: clientName.trim(),
        client_email: clientEmail.trim() || null,
        client_tax_id: clientTaxId.trim() || null,
        client_address: clientAddress.trim() || null,
        city: city.trim() || null,
        service_label: serviceLabel.trim() || 'Servicio tecnológico',
        total_amount: amount,
        custom_notes: customNotes.trim() || null,
        status,
      })
      .eq('id', contract.id)
    setLoading(false)
    if (error) {
      alert(error.message)
      return
    }
    router.push(`/admin/contratos/${contract.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <p className="text-sm text-slate-500">
        Contrato <span className="font-mono text-slate-300">{contract.contract_number}</span>
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs text-slate-400">Nombre del cliente</span>
          <input
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Correo</span>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs text-slate-400">Cédula / RUC</span>
          <input
            value={clientTaxId}
            onChange={(e) => setClientTaxId(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Ciudad de firma</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-slate-400">Domicilio / residencia</span>
        <textarea
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
        />
      </label>
      <label className="block">
        <span className="text-xs text-slate-400">Descripción del servicio</span>
        <input
          value={serviceLabel}
          onChange={(e) => setServiceLabel(e.target.value)}
          className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
        />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs text-slate-400">Total (USD)</span>
          <input
            inputMode="decimal"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white tabular-nums"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Estado</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ContractStatus)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-slate-400">Observaciones adicionales</span>
        <textarea
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-50"
        >
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
