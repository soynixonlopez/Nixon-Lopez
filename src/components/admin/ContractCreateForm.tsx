'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { parseClientExtraFromPayload } from '@/lib/admin-configurator-quote'
import { extractQuoteServiceSnapshots } from '@/lib/quote-pricing'

type QuoteOpt = {
  id: string
  client_first_name: string
  client_last_name: string
  client_email: string
  service_label: string | null
  service_id: string | null
  total_amount: number | null
  raw_payload?: unknown
}

export function ContractCreateForm({
  quotes,
  prefillQuoteId,
}: {
  quotes: QuoteOpt[]
  prefillQuoteId?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [quoteId, setQuoteId] = useState(prefillQuoteId ?? quotes[0]?.id ?? '')
  const selected = useMemo(() => quotes.find((q) => q.id === quoteId), [quotes, quoteId])
  const [clientTaxId, setClientTaxId] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [city, setCity] = useState('Panama')
  const [customNotes, setCustomNotes] = useState('')

  useEffect(() => {
    if (!selected?.raw_payload) return
    const extra = parseClientExtraFromPayload(selected.raw_payload)
    if (extra.client_ruc) setClientTaxId(extra.client_ruc)
    if (extra.client_address) setClientAddress(extra.client_address)
    if (extra.client_city) setCity(extra.client_city)
  }, [selected])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    const supabase = createClient()
    const { data: numberData, error: numErr } = await supabase.rpc('next_contract_number')
    if (numErr || !numberData) {
      setLoading(false)
      alert(numErr?.message ?? 'No se pudo generar número de contrato')
      return
    }
    const clientName = `${selected.client_first_name} ${selected.client_last_name}`.trim()
    const payload = {
      contract_number: numberData as string,
      quote_id: selected.id,
      client_name: clientName,
      client_email: selected.client_email || null,
      client_tax_id: clientTaxId || null,
      client_address: clientAddress || null,
      city: city || null,
      service_type: selected.service_id,
      service_label: selected.service_label || 'Servicio tecnológico',
      total_amount: selected.total_amount ?? 0,
      currency: 'USD',
      custom_notes: customNotes || null,
      terms_payload:
        selected.raw_payload && typeof selected.raw_payload === 'object' && !Array.isArray(selected.raw_payload)
          ? {
              ...(selected.raw_payload as Record<string, unknown>),
              selected_services:
                extractQuoteServiceSnapshots(selected.raw_payload).length > 0
                  ? extractQuoteServiceSnapshots(selected.raw_payload)
                  : (selected.raw_payload as { selected_services?: unknown }).selected_services,
            }
          : null,
    }
    const { data, error } = await supabase.from('service_contracts').insert(payload).select('id').single()
    if (error || !data) {
      setLoading(false)
      alert(error?.message ?? 'No se pudo crear el contrato')
      return
    }

    // Proyecto de seguimiento (Iniciado) vinculado a la cotización/contrato
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('quote_id', selected.id)
      .maybeSingle()

    if (!existingProject) {
      await supabase.from('projects').insert({
        quote_id: selected.id,
        title: `Proyecto: ${clientName}`,
        client_name: clientName,
        client_email: selected.client_email || null,
        status: 'pending',
        description: selected.service_label || 'Servicio tecnológico',
      })
    }

    setLoading(false)
    router.push(`/admin/contratos/${(data as { id: string }).id}`)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <label className="block">
        <span className="text-xs text-slate-400">Cotización base</span>
        <select
          value={quoteId}
          onChange={(e) => setQuoteId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          required
        >
          {quotes.map((q) => (
            <option key={q.id} value={q.id}>
              {q.client_first_name} {q.client_last_name} — {q.service_label || 'Servicio'} (${Number(q.total_amount || 0).toFixed(2)})
            </option>
          ))}
        </select>
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label>
          <span className="text-xs text-slate-400">Cédula / RUC cliente</span>
          <input
            value={clientTaxId}
            onChange={(e) => setClientTaxId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Ciudad de firma</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-slate-400">Dirección cliente</span>
        <textarea
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
        />
      </label>
      <label className="block">
        <span className="text-xs text-slate-400">Observaciones adicionales</span>
        <textarea
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
        />
      </label>
      <button
        type="submit"
        disabled={loading || !selected}
        className="px-6 py-3 rounded-xl bg-brand text-white font-medium disabled:opacity-50"
      >
        {loading ? 'Creando…' : 'Crear contrato'}
      </button>
    </form>
  )
}
