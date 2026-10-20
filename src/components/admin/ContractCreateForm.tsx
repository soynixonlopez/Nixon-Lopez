'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { parseClientExtraFromPayload } from '@/lib/admin-configurator-quote'
import {
  assessQuoteForContract,
  deriveContractTermsFromQuote,
  enrichQuotePayloadForContract,
  quotePayloadHasMarketing,
  quotePayloadHasWeb,
} from '@/lib/contract-terms-from-quote'
import { extractQuoteServiceSnapshots } from '@/lib/quote-pricing'
import {
  WEB_INSTALLMENT_PLANS,
  buildWebInstallmentTerms,
  type WebInstallmentPlanId,
} from '@/lib/contract-web-installments'
import { parseConfiguratorFromPayload } from '@/lib/admin-configurator-quote'
import { normalizeCommercialSnapshotForContractDisplay } from '@/lib/service-catalog'
import type { CommercialSnapshot } from '@/lib/service-catalog'

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
  const [webInstallmentPlan, setWebInstallmentPlan] = useState<WebInstallmentPlanId>('half-half')

  const quoteAssessment = useMemo(() => {
    if (!selected?.raw_payload) return null
    return assessQuoteForContract(selected.raw_payload, quoteMeta(selected))
  }, [selected])

  const enrichedPayload = useMemo(() => {
    if (!selected?.raw_payload) return null
    return enrichQuotePayloadForContract(selected.raw_payload, quoteMeta(selected))
  }, [selected])

  const hasMarketing = Boolean(enrichedPayload && quotePayloadHasMarketing(enrichedPayload))
  const hasWeb = Boolean(quoteAssessment && quoteAssessment.displayWebOnce > 0)

  const webInstallmentSummary = useMemo(() => {
    const total = quoteAssessment?.displayWebOnce ?? 0
    if (total <= 0) return ''
    const inst = buildWebInstallmentTerms(total, webInstallmentPlan, 'desarrollo web')
    if (webInstallmentPlan === 'single') {
      return ` Web: $${total.toFixed(2)} (pago único).`
    }
    if (webInstallmentPlan === 'three-thirds') {
      const first = inst.advanceNote.match(/USD \$[\d.]+/)?.[0] ?? ''
      return ` Web: $${total.toFixed(2)} (3 cuotas; 1.ª ${first}).`
    }
    const half = (total / 2).toFixed(2)
    return ` Web: $${total.toFixed(2)} (anticipo 50%: $${half}).`
  }, [quoteAssessment?.displayWebOnce, webInstallmentPlan])

  const applyTermsFromQuote = useCallback((quote: QuoteOpt, installmentPlan: WebInstallmentPlanId) => {
      setTermsError('')
      const meta = quoteMeta(quote)
      const enriched = enrichQuotePayloadForContract(quote.raw_payload, meta)
      const derived = deriveContractTermsFromQuote(enriched ?? quote.raw_payload, meta, {
        webInstallmentPlan: installmentPlan,
      })
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
    setWebInstallmentPlan('half-half')
    const extra = parseClientExtraFromPayload(selected.raw_payload)
    if (extra.client_ruc) setClientTaxId(extra.client_ruc)
    if (extra.client_address) setClientAddress(extra.client_address)
    if (extra.client_city) setCity(extra.client_city)
    applyTermsFromQuote(selected, 'half-half')
    // Solo al cambiar de cotización; no depender de applyTermsFromQuote para no resetear cuotas.
  }, [selected?.id, applyTermsFromQuote])

  useEffect(() => {
    if (!selected || !hasWeb || editTerms) return
    const meta = quoteMeta(selected)
    const enriched = enrichQuotePayloadForContract(selected.raw_payload, meta)
    const derived = deriveContractTermsFromQuote(enriched ?? selected.raw_payload, meta, {
      webInstallmentPlan,
    })
    if (!derived) return
    setAdvanceNote(derived.advanceNote)
    setBalanceNote(derived.balanceNote)
    setPaymentSchedule(derived.paymentSchedule)
  }, [webInstallmentPlan, selected, hasWeb, editTerms])

  function resolveTermsForSubmit(quote: QuoteOpt) {
    const enriched = enrichQuotePayloadForContract(quote.raw_payload)
    const derived = deriveContractTermsFromQuote(enriched ?? quote.raw_payload, quoteMeta(quote), {
      webInstallmentPlan,
    })
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
    const assessment = assessQuoteForContract(selected.raw_payload, quoteMeta(selected))
    if (assessment.incomplete || !assessment.aligned) {
      alert(
        assessment.warnings.join('\n') ||
          'Esta cotización está incompleta. Complétala o elige otra antes de crear el contrato.',
      )
      return
    }
    const terms = resolveTermsForSubmit(selected)
    if (!terms) {
      alert(termsError || 'No se pudieron generar los términos del contrato desde la cotización.')
      return
    }
    const rawForFlags = enrichedPayload ?? selected.raw_payload
    const hasWeb = quotePayloadHasWeb(rawForFlags)
    const marketing = quotePayloadHasMarketing(rawForFlags)
    const rounds = Number(terms.revisionRounds)
    const sharedOk =
      terms.paymentMethod.trim() &&
      terms.paymentSchedule.trim() &&
      terms.termNote.trim() &&
      terms.renewalNote.trim() &&
      terms.terminationNote.trim()
    const webOk =
      !hasWeb ||
      (Number.isFinite(rounds) &&
        rounds >= 0 &&
        terms.advanceNote.trim() &&
        terms.balanceNote.trim() &&
        terms.startDate.trim() &&
        terms.deliveryDate.trim())
    const mktOk =
      !marketing ||
      (terms.marketingStartDate.trim() &&
        terms.marketingFirstPayment.trim() &&
        (!hasWeb ? terms.advanceNote.trim() : true))
    if (!sharedOk || !webOk || !mktOk) {
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
    const meta = quoteMeta(selected)
    const enriched = enrichQuotePayloadForContract(selected.raw_payload, meta) ?? selected.raw_payload
    const cfg = parseConfiguratorFromPayload(enriched ?? selected.raw_payload)
    const forceInfraBundle = Boolean(hasWeb && cfg?.hasDomain === 'no' && cfg?.hasHosting === 'no')
    const commercialBase = (assessment.aligned ?? null) as CommercialSnapshot | null
    const commercialSnapshot = commercialBase
      ? normalizeCommercialSnapshotForContractDisplay(
          {
            ...commercialBase,
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
            webInstallmentPlan: hasWeb ? webInstallmentPlan : undefined,
          },
          { forceInfraBundle },
        )
      : null
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
      total_amount:
        assessment.displayInitialFees > 0 ? assessment.displayInitialFees : (selected.total_amount ?? 0),
      currency: 'USD',
      custom_notes: terms.customNotes || null,
      terms_payload:
        enriched && typeof enriched === 'object' && !Array.isArray(enriched)
          ? {
              ...enriched,
              commercial: commercialSnapshot ?? {
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
                webInstallmentPlan: hasWeb ? webInstallmentPlan : undefined,
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

  const termsReady = Boolean(paymentSchedule && !termsError && quoteAssessment && !quoteAssessment.incomplete)

  function formatQuoteMoney(q: QuoteOpt) {
    const a = assessQuoteForContract(q.raw_payload, quoteMeta(q))
    if (!a.aligned || a.incomplete) {
      return q.total_amount != null ? `$${Number(q.total_amount).toFixed(2)} (revisar)` : 'incompleta'
    }
    if (a.displayWebOnce > 0 && a.displayMonthly > 0) {
      return `web $${a.displayWebOnce.toFixed(2)} + $${a.displayMonthly.toFixed(2)}/mes`
    }
    if (a.displayMonthly > 0) return `$${a.displayMonthly.toFixed(2)}/mes`
    return `$${a.displayWebOnce.toFixed(2)}`
  }

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
              {q.client_first_name} {q.client_last_name} — {q.service_label || 'Servicio'} ({formatQuoteMoney(q)})
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
      ) : quoteAssessment?.incomplete ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">Cotización incompleta para contrato</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {quoteAssessment.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <p className="mt-2 text-amber-900/90">
            No se creará un contrato con plantilla legacy. Corrige la cotización en el panel.
          </p>
        </div>
      ) : termsReady ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Pagos, plazos y cláusulas se completan solos desde la cotización. El trabajo inicia al firmar el contrato.
          {webInstallmentSummary}
          {quoteAssessment?.displayMonthly ? (
            <> Honorarios: ${quoteAssessment.displayMonthly.toFixed(2)}/mes.</>
          ) : null}
        </p>
      ) : null}
      {hasWeb && !quoteAssessment?.incomplete ? (
        <label className="relative z-20 block pb-1">
          <span className="text-xs text-slate-400">Cuotas del desarrollo web</span>
          <select
            value={webInstallmentPlan}
            onChange={(e) => {
              setWebInstallmentPlan(e.target.value as WebInstallmentPlanId)
              setEditTerms(false)
            }}
            className="relative z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          >
            {WEB_INSTALLMENT_PLANS.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            {WEB_INSTALLMENT_PLANS.find((p) => p.id === webInstallmentPlan)?.description}
          </p>
        </label>
      ) : null}

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

      <div className="relative z-0 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
        {!termsError ? (
          <button
            type="button"
            onClick={() => setEditTerms((value) => !value)}
            className="text-left text-sm text-slate-500 underline-offset-2 hover:text-brand hover:underline"
          >
            {editTerms ? 'Ocultar términos avanzados' : 'Ajustar términos (opcional)'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => selected && applyTermsFromQuote(selected, webInstallmentPlan)}
            className="text-left text-sm font-medium text-brand hover:underline"
          >
            Reintentar desde cotización
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !selected || Boolean(quoteAssessment?.incomplete)}
          className="ml-auto shrink-0 px-6 py-3 rounded-xl bg-brand text-white font-medium disabled:opacity-50"
        >
          {loading ? 'Creando…' : 'Crear contrato'}
        </button>
      </div>
    </form>
  )
}
