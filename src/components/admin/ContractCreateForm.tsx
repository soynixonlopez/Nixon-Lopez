'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { parseClientExtraFromPayload } from '@/lib/admin-configurator-quote'
import {
  deriveContractTermsFromQuote,
  enrichQuotePayloadForContract,
  quotePayloadHasMarketing,
} from '@/lib/contract-terms-from-quote'
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

function quoteMeta(selected: QuoteOpt) {
  return {
    totalAmount: selected.total_amount,
    serviceId: selected.service_id,
    serviceLabel: selected.service_label,
  }
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
  const [editTerms, setEditTerms] = useState(false)
  const selected = useMemo(() => quotes.find((q) => q.id === quoteId), [quotes, quoteId])
  const [clientTaxId, setClientTaxId] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [city, setCity] = useState('Panama')
  const [customNotes, setCustomNotes] = useState('')
  const [revisionRounds, setRevisionRounds] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [advanceNote, setAdvanceNote] = useState('')
  const [balanceNote, setBalanceNote] = useState('')
  const [paymentSchedule, setPaymentSchedule] = useState('')
  const [startDate, setStartDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [termNote, setTermNote] = useState('')
  const [renewalNote, setRenewalNote] = useState('')
  const [terminationNote, setTerminationNote] = useState('')
  const [marketingStartDate, setMarketingStartDate] = useState('')
  const [marketingFirstPayment, setMarketingFirstPayment] = useState('')
  const [termsError, setTermsError] = useState('')

  const enrichedPayload = useMemo(() => {
    if (!selected?.raw_payload) return null
    return enrichQuotePayloadForContract(selected.raw_payload)
  }, [selected])

  const hasMarketing = Boolean(enrichedPayload && quotePayloadHasMarketing(enrichedPayload))

  const applyTermsFromQuote = useCallback(
    (quote: QuoteOpt) => {
      setTermsError('')
      const enriched = enrichQuotePayloadForContract(quote.raw_payload)
      const derived = deriveContractTermsFromQuote(enriched ?? quote.raw_payload, quoteMeta(quote))
      if (!derived) {
        setTermsError(
          'No se pudieron calcular los términos desde esta cotización. Revisa que tenga servicios y montos guardados.',
        )
        return
      }
      setRevisionRounds(derived.revisionRounds)
      setPaymentMethod(derived.paymentMethod)
      setAdvanceNote(derived.advanceNote)
      setBalanceNote(derived.balanceNote)
      setPaymentSchedule(derived.paymentSchedule)
      setStartDate(derived.startDate)
      setDeliveryDate(derived.deliveryDate)
      setTermNote(derived.termNote)
      setRenewalNote(derived.renewalNote)
      setTerminationNote(derived.terminationNote)
      setCustomNotes(derived.customNotes)
      if (quotePayloadHasMarketing(enriched ?? quote.raw_payload)) {
        setMarketingStartDate(derived.marketingStartDate)
        setMarketingFirstPayment(derived.marketingFirstPayment)
      } else {
        setMarketingStartDate('')
        setMarketingFirstPayment('')
      }
    },
    [],
  )

  useEffect(() => {
    if (!selected) return
    const extra = parseClientExtraFromPayload(selected.raw_payload)
    if (extra.client_ruc) setClientTaxId(extra.client_ruc)
    if (extra.client_address) setClientAddress(extra.client_address)
    if (extra.client_city) setCity(extra.client_city)
    applyTermsFromQuote(selected)
  }, [selected, applyTermsFromQuote])

  function resolveTermsForSubmit(quote: QuoteOpt) {
    const enriched = enrichQuotePayloadForContract(quote.raw_payload)
    const derived = deriveContractTermsFromQuote(enriched ?? quote.raw_payload, quoteMeta(quote))
    if (!derived) return null
    if (editTerms) {
      return {
        revisionRounds: revisionRounds.trim() || derived.revisionRounds,
        paymentMethod: paymentMethod.trim() || derived.paymentMethod,
        advanceNote: advanceNote.trim() || derived.advanceNote,
        balanceNote: balanceNote.trim() || derived.balanceNote,
        paymentSchedule: paymentSchedule.trim() || derived.paymentSchedule,
        startDate: startDate.trim() || derived.startDate,
        deliveryDate: deliveryDate.trim() || derived.deliveryDate,
        termNote: termNote.trim() || derived.termNote,
        renewalNote: renewalNote.trim() || derived.renewalNote,
        terminationNote: terminationNote.trim() || derived.terminationNote,
        marketingStartDate: marketingStartDate.trim() || derived.marketingStartDate,
        marketingFirstPayment: marketingFirstPayment.trim() || derived.marketingFirstPayment,
        customNotes: customNotes.trim() || derived.customNotes,
      }
    }
    return derived
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    const terms = resolveTermsForSubmit(selected)
    if (!terms) {
      alert(termsError || 'No se pudieron generar los términos del contrato desde la cotización.')
      return
    }
    const rounds = Number(terms.revisionRounds)
    const marketing = Boolean(enrichedPayload && quotePayloadHasMarketing(enrichedPayload))
    if (
      !Number.isFinite(rounds) ||
      rounds < 0 ||
      !terms.paymentMethod.trim() ||
      !terms.advanceNote.trim() ||
      !terms.balanceNote.trim() ||
      !terms.paymentSchedule.trim() ||
      !terms.startDate.trim() ||
      !terms.deliveryDate.trim() ||
      !terms.termNote.trim() ||
      !terms.renewalNote.trim() ||
      !terms.terminationNote.trim() ||
      (marketing && (!terms.marketingStartDate.trim() || !terms.marketingFirstPayment.trim()))
    ) {
      alert('Los términos no se completaron. Usa «Regenerar desde cotización» o revisa la cotización base.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data: numberData, error: numErr } = await supabase.rpc('next_contract_number')
    if (numErr || !numberData) {
      setLoading(false)
      alert(numErr?.message ?? 'No se pudo generar número de contrato')
      return
    }
    const clientName = `${selected.client_first_name} ${selected.client_last_name}`.trim()
    const enriched = enrichQuotePayloadForContract(selected.raw_payload) ?? selected.raw_payload
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
      custom_notes: terms.customNotes || null,
      terms_payload:
        enriched && typeof enriched === 'object' && !Array.isArray(enriched)
          ? {
              ...enriched,
              commercial: {
                ...((enriched as { commercial?: Record<string, unknown> }).commercial ?? {}),
                revisionRounds: rounds,
                paymentMethod: terms.paymentMethod.trim(),
                advanceNote: terms.advanceNote.trim(),
                balanceNote: terms.balanceNote.trim(),
                paymentSchedule: terms.paymentSchedule.trim(),
                startDate: terms.startDate.trim(),
                deliveryDate: terms.deliveryDate.trim(),
                termNote: terms.termNote.trim(),
                renewalNote: terms.renewalNote.trim(),
                terminationNote: terms.terminationNote.trim(),
                marketingStartDate: terms.marketingStartDate.trim(),
                marketingFirstPayment: terms.marketingFirstPayment.trim(),
              },
              selected_services:
                extractQuoteServiceSnapshots(enriched).length > 0
                  ? extractQuoteServiceSnapshots(enriched)
                  : (enriched as { selected_services?: unknown }).selected_services,
            }
          : null,
    }
    const { data, error } = await supabase.from('service_contracts').insert(payload).select('id').single()
    if (error || !data) {
      setLoading(false)
      alert(error?.message ?? 'No se pudo crear el contrato')
      return
    }

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

  const termsReady = Boolean(paymentSchedule && !termsError)

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-xl space-y-6">
      <label className="block">
        <span className="text-xs text-slate-400">Cotización base</span>
        <select
          value={quoteId}
          onChange={(e) => {
            setQuoteId(e.target.value)
            setEditTerms(false)
          }}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          required
        >
          {quotes.map((q) => (
            <option key={q.id} value={q.id}>
              {q.client_first_name} {q.client_last_name} — {q.service_label || 'Servicio'} ($
              {Number(q.total_amount || 0).toFixed(2)})
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

      {termsError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{termsError}</p>
      ) : termsReady ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Pagos, plazos y cláusulas se completan solos desde la cotización. El trabajo inicia al firmar el contrato.
        </p>
      ) : null}
      {!termsError ? (
        <button
          type="button"
          onClick={() => setEditTerms((value) => !value)}
          className="text-sm text-slate-500 underline-offset-2 hover:text-brand hover:underline"
        >
          {editTerms ? 'Ocultar términos avanzados' : 'Ajustar términos (opcional)'}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => selected && applyTermsFromQuote(selected)}
          className="text-sm font-medium text-brand hover:underline"
        >
          Reintentar desde cotización
        </button>
      )}

      {editTerms ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <label>
            <span className="text-xs text-slate-400">Rondas de revisión</span>
            <input
              value={revisionRounds}
              onChange={(e) => setRevisionRounds(e.target.value)}
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Forma de pago</span>
            <input
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Anticipo acordado</span>
            <textarea
              value={advanceNote}
              onChange={(e) => setAdvanceNote(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Saldo acordado</span>
            <textarea
              value={balanceNote}
              onChange={(e) => setBalanceNote(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs text-slate-400">Calendario de pagos</span>
            <textarea
              value={paymentSchedule}
              onChange={(e) => setPaymentSchedule(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Fecha de inicio</span>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Plazo de entrega</span>
            <input
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          {hasMarketing ? (
            <>
              <label>
                <span className="text-xs text-slate-400">Inicio del marketing</span>
                <input
                  value={marketingStartDate}
                  onChange={(e) => setMarketingStartDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
                />
              </label>
              <label>
                <span className="text-xs text-slate-400">Primer pago mensual</span>
                <input
                  value={marketingFirstPayment}
                  onChange={(e) => setMarketingFirstPayment(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
                />
              </label>
            </>
          ) : null}
          <label>
            <span className="text-xs text-slate-400">Vigencia</span>
            <input
              value={termNote}
              onChange={(e) => setTermNote(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Renovación</span>
            <input
              value={renewalNote}
              onChange={(e) => setRenewalNote(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs text-slate-400">Terminación</span>
            <input
              value={terminationNote}
              onChange={(e) => setTerminationNote(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs text-slate-400">Observaciones adicionales</span>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
        </div>
      ) : null}

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
