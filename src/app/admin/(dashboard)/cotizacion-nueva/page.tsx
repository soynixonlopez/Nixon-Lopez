'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import {
  computeAdminQuoteCatalogTotals,
  computeManualQuoteTotals,
  FEE_NO_DOMAIN_USD,
  FEE_NO_PROFESSIONAL_EMAIL_USD,
  getQuoteAddonIfMissing,
  getService,
  MAX_INCLUDED_PAGES,
  PRICE_WORDPRESS_DOMAIN_USD,
  PRICE_WORDPRESS_HOSTING_FIRST_YEAR_USD,
  QUOTE_SERVICES,
  serviceTypeLabel,
} from '@/lib/quote-pricing'

const CATALOG_OTHER = 'other'

function resolveTotals(form: {
  service_type: string
  service_label: string
  total_amount: string
  quantity_pages: string
  has_domain: '' | 'si' | 'no'
  has_professional_email: '' | 'si' | 'no'
}) {
  const catalog = form.service_type && form.service_type !== CATALOG_OTHER ? getService(form.service_type) : undefined
  const baseTrim = form.total_amount.trim()
  const baseAmount = baseTrim === '' ? NaN : parseFloat(form.total_amount)
  if (catalog) {
    const pages = form.quantity_pages ? parseInt(form.quantity_pages, 10) : MAX_INCLUDED_PAGES
    const baseOverride = baseTrim !== '' && Number.isFinite(baseAmount) ? baseAmount : null
    const catTotals = computeAdminQuoteCatalogTotals({
      serviceId: form.service_type,
      cantidadPaginas: Number.isFinite(pages) ? pages : MAX_INCLUDED_PAGES,
      tieneDominio: form.has_domain,
      tieneCorreo: form.has_professional_email,
      incluirPasarelaAddon: false,
      baseOverrideUsd: baseOverride,
    })
    if (catTotals) return { ...catTotals, mode: 'catalog' as const, catalog }
  }
  const manualBase = Number.isFinite(baseAmount) ? Math.max(0, baseAmount) : 0
  return {
    ...computeManualQuoteTotals({
      baseAmount: manualBase,
      hasDomain: form.has_domain,
      hasProfessionalEmail: form.has_professional_email,
    }),
    mode: 'manual' as const,
    catalog: undefined,
  }
}

export default function NuevaCotizacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    client_first_name: '',
    client_last_name: '',
    client_email: '',
    client_phone: '',
    company: '',
    service_label: '',
    service_type: '',
    has_domain: '' as '' | 'si' | 'no',
    has_professional_email: '' as '' | 'si' | 'no',
    has_hosting: '' as '' | 'si' | 'no',
    quantity_pages: '',
    total_amount: '',
    comments: '',
    internal_notes: '',
    status: 'new',
  })

  const steps = [
    { id: 1, title: 'Datos del cliente' },
    { id: 2, title: 'Servicio y alcance' },
    { id: 3, title: 'Detalles finales' },
    { id: 4, title: 'Revisión' },
  ]

  const catalogSvc = useMemo(
    () => (form.service_type && form.service_type !== CATALOG_OTHER ? getService(form.service_type) : undefined),
    [form.service_type],
  )

  const needsDomainBlock = Boolean(catalogSvc?.needsDomainEmail)
  const needsPagesField = Boolean(catalogSvc?.needsPages)
  const quoteAddOns = getQuoteAddonIfMissing(catalogSvc)

  const isOther = form.service_type === CATALOG_OTHER

  const domainOk = isOther
    ? Boolean(form.has_domain) && Boolean(form.has_professional_email)
    : !needsDomainBlock || (Boolean(form.has_domain) && Boolean(form.has_professional_email))

  const pagesOk =
    !needsPagesField ||
    (form.quantity_pages !== '' &&
      Number(form.quantity_pages) >= 1 &&
      Number(form.quantity_pages) <= 50)

  const canGoNextStep =
    (step === 1 &&
      form.client_first_name.trim() &&
      form.client_last_name.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)) ||
    (step === 2 && Boolean(form.service_type) && form.service_label.trim() && domainOk && pagesOk) ||
    step === 3

  const stepProgress = ((step - 1) / (steps.length - 1)) * 100

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { lines, subtotal, extrasTotal, total, mode, catalog } = resolveTotals(form)
    const baseAmountStored =
      mode === 'catalog' && lines[0]
        ? lines[0].amount
        : form.total_amount.trim() === ''
          ? 0
          : parseFloat(form.total_amount)
    const { data, error } = await supabase
      .from('quotes')
      .insert({
        source: 'admin_manual',
        status: form.status as 'new',
        client_first_name: form.client_first_name,
        client_last_name: form.client_last_name,
        client_email: form.client_email,
        client_phone: form.client_phone || null,
        company: form.company || null,
        service_id: form.service_type || null,
        service_label: form.service_label || null,
        quantity_pages: form.quantity_pages ? parseInt(form.quantity_pages, 10) : null,
        total_amount: total,
        subtotal,
        extras_total: extrasTotal,
        comments: form.comments || null,
        internal_notes: form.internal_notes || null,
        raw_payload: {
          manual: true,
          catalog: mode === 'catalog',
          monthly: catalog?.monthly ?? false,
          service_type: form.service_type || null,
          has_domain: form.has_domain || null,
          has_professional_email: form.has_professional_email || null,
          has_hosting: form.has_hosting || null,
          base_amount: Number.isFinite(baseAmountStored) ? baseAmountStored : 0,
          breakdown: { lines },
        },
      })
      .select('id')
      .single()
    setLoading(false)
    if (error) {
      alert(error.message)
      return
    }
    router.push(`/admin/cotizaciones/${(data as { id: string }).id}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Nueva cotización</h1>
            <p className="text-sm text-slate-400">Flujo guiado por pasos para crear una cotización manual.</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300" style={{ width: `${stepProgress}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((s) => (
              <div key={s.id} className={`text-xs sm:text-sm rounded-lg px-3 py-2 border ${step >= s.id ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-200' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                <span className="font-semibold">Paso {s.id}:</span> {s.title}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Datos del cliente</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label>
                  <span className="text-xs text-slate-400">Nombre *</span>
                  <input
                    required
                    value={form.client_first_name}
                    onChange={(e) => setForm((f) => ({ ...f, client_first_name: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </label>
                <label>
                  <span className="text-xs text-slate-400">Apellido *</span>
                  <input
                    required
                    value={form.client_last_name}
                    onChange={(e) => setForm((f) => ({ ...f, client_last_name: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-slate-400">Correo *</span>
                <input
                  type="email"
                  required
                  value={form.client_email}
                  onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <label>
                  <span className="text-xs text-slate-400">Teléfono</span>
                  <input
                    value={form.client_phone}
                    onChange={(e) => setForm((f) => ({ ...f, client_phone: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </label>
                <label>
                  <span className="text-xs text-slate-400">Empresa</span>
                  <input
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Servicio del catálogo y alcance</h2>
              <label className="block">
                <span className="text-xs text-slate-400">Servicio (mismo listado que la cotización web) *</span>
                <select
                  value={form.service_type}
                  onChange={(e) => {
                    const v = e.target.value
                    setForm((f) => {
                      if (!v) {
                        return {
                          ...f,
                          service_type: '',
                          service_label: '',
                          total_amount: '',
                          quantity_pages: '',
                        }
                      }
                      if (v === CATALOG_OTHER) {
                        return {
                          ...f,
                          service_type: CATALOG_OTHER,
                          service_label: '',
                          total_amount: '',
                          quantity_pages: '',
                          has_domain: '',
                          has_professional_email: '',
                        }
                      }
                      const s = getService(v)
                      if (!s) return { ...f, service_type: v }
                      return {
                        ...f,
                        service_type: v,
                        service_label: s.label,
                        total_amount: String(s.price),
                        quantity_pages: s.needsPages ? String(Math.max(1, MAX_INCLUDED_PAGES)) : '',
                        has_domain: '',
                        has_professional_email: '',
                      }
                    })
                  }}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  required
                >
                  <option value="">Selecciona un servicio</option>
                  {QUOTE_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} — ${s.price}
                      {s.monthly ? '/mes' : ''}
                    </option>
                  ))}
                  <option value={CATALOG_OTHER}>Otro — precio y descripción manual</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs text-slate-400">Servicio / descripción *</span>
                <input
                  required
                  value={form.service_label}
                  onChange={(e) => setForm((f) => ({ ...f, service_label: e.target.value }))}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </label>

              {isOther ? (
                <p className="text-xs text-slate-500 rounded-lg border border-slate-700/80 bg-slate-950/40 px-3 py-2 leading-relaxed">
                  Modo manual: si el cliente <strong className="text-slate-300">no tiene dominio</strong>, se suman{' '}
                  <strong className="text-indigo-300">${FEE_NO_DOMAIN_USD} USD</strong>. Si{' '}
                  <strong className="text-slate-300">no tiene correo profesional</strong>, se suman{' '}
                  <strong className="text-indigo-300">${FEE_NO_PROFESSIONAL_EMAIL_USD} USD</strong>. El campo “Hosting” es
                  solo informativo y no cambia el total.
                </p>
              ) : catalogSvc?.wordpressDomainHosting ? (
                <p className="text-xs text-slate-500 rounded-lg border border-slate-700/80 bg-slate-950/40 px-3 py-2 leading-relaxed">
                  <strong className="text-slate-300">WordPress</strong> (tarifas en presupuesto): dominio{' '}
                  <strong className="text-indigo-300">${PRICE_WORDPRESS_DOMAIN_USD} USD</strong> si no lo tiene; hosting{' '}
                  <strong className="text-indigo-300">${PRICE_WORDPRESS_HOSTING_FIRST_YEAR_USD} USD</strong> el{' '}
                  <strong className="text-slate-300">primer año</strong> si no tiene hosting listo.
                </p>
              ) : catalogSvc?.needsDomainEmail ? (
                <p className="text-xs text-slate-500 rounded-lg border border-slate-700/80 bg-slate-950/40 px-3 py-2 leading-relaxed">
                  Sin dominio: <strong className="text-indigo-300">+${FEE_NO_DOMAIN_USD} USD</strong>. Sin correo
                  profesional: <strong className="text-indigo-300">+${FEE_NO_PROFESSIONAL_EMAIL_USD} USD</strong>. Misma
                  lógica que en la web pública.
                </p>
              ) : form.service_type ? (
                <p className="text-xs text-slate-500 rounded-lg border border-slate-700/80 bg-slate-950/40 px-3 py-2 leading-relaxed">
                  Este servicio no añade cargos automáticos de dominio/correo en el desglose.
                </p>
              ) : null}

              {(isOther || needsDomainBlock) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <span className="text-xs text-slate-400 block">¿Tiene dominio? *</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {(['si', 'no'] as const).map((value) => (
                        <button
                          type="button"
                          key={value}
                          onClick={() => setForm((f) => ({ ...f, has_domain: value }))}
                          className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm shrink-0 ${form.has_domain === value ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-slate-700 text-slate-300'}`}
                        >
                          {value === 'si' ? 'Sí' : `No (+$${quoteAddOns.domainUsd})`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-slate-400 block">
                      {catalogSvc?.wordpressDomainHosting
                        ? '¿Tiene hosting para el sitio? *'
                        : '¿Tiene correo profesional? *'}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {(['si', 'no'] as const).map((value) => (
                        <button
                          type="button"
                          key={value}
                          onClick={() => setForm((f) => ({ ...f, has_professional_email: value }))}
                          className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm shrink-0 ${form.has_professional_email === value ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-slate-700 text-slate-300'}`}
                        >
                          {value === 'si' ? 'Sí' : `No (+$${quoteAddOns.secondUsd})`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {isOther && (
                <div className="min-w-0">
                  <span className="text-xs text-slate-400 block">¿Tiene hosting? (informativo)</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(['si', 'no'] as const).map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setForm((f) => ({ ...f, has_hosting: value }))}
                        className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm shrink-0 ${form.has_hosting === value ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-slate-700 text-slate-300'}`}
                      >
                        {value === 'si' ? 'Sí' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(needsPagesField || isOther) && (
                  <label className="min-w-0">
                    <span className="text-xs text-slate-400">
                      {needsPagesField ? 'Cantidad de páginas *' : 'Cantidad de páginas (opcional)'}
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={form.quantity_pages}
                      onChange={(e) => setForm((f) => ({ ...f, quantity_pages: e.target.value }))}
                      className="mt-1 w-full min-w-0 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                    />
                  </label>
                )}
                <label className={`min-w-0 ${needsPagesField || isOther ? '' : 'sm:col-span-2'}`}>
                  <span className="text-xs text-slate-400">Precio base del servicio (USD)</span>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={form.total_amount}
                    onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
                    className="mt-1 w-full min-w-0 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                  <span className="mt-1 block text-[11px] text-slate-500">
                    {catalogSvc
                      ? 'Puedes ajustar el importe; dominio/hosting o correo se calculan aparte según el servicio.'
                      : 'Sin incluir dominio ni correo en modo manual; esos cargos se suman al total.'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Detalles y seguimiento</h2>
              <label className="block">
                <span className="text-xs text-slate-400">Comentarios para el cliente</span>
                <textarea
                  value={form.comments}
                  onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
                  rows={4}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-400">Notas internas</span>
                <textarea
                  value={form.internal_notes}
                  onChange={(e) => setForm((f) => ({ ...f, internal_notes: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-400">Estado inicial</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                >
                  <option value="new">Nueva</option>
                  <option value="sent">Enviada</option>
                  <option value="won">Ganada</option>
                  <option value="lost">Perdida</option>
                </select>
              </label>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Revisión final</h2>
              {(() => {
                const { lines, subtotal, extrasTotal, total, mode, catalog } = resolveTotals(form)
                const revCatalog =
                  form.service_type && form.service_type !== CATALOG_OTHER ? getService(form.service_type) : undefined
                const revAddOns = getQuoteAddonIfMissing(revCatalog)
                const domainNoFee = revAddOns.domainUsd
                const secondNoFee = revAddOns.secondUsd
                return (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:p-4 space-y-3 text-sm overflow-x-auto">
                    <p className="text-slate-200 break-words">
                      <span className="text-slate-400">Cliente:</span> {form.client_first_name} {form.client_last_name}
                    </p>
                    <p className="text-slate-200 break-all">
                      <span className="text-slate-400">Correo:</span> {form.client_email}
                    </p>
                    <p className="text-slate-200 break-words">
                      <span className="text-slate-400">Teléfono:</span> {form.client_phone || '-'}
                    </p>
                    <p className="text-slate-200 break-words">
                      <span className="text-slate-400">Empresa:</span> {form.company || '-'}
                    </p>
                    <p className="text-slate-200 break-words">
                      <span className="text-slate-400">Servicio (catálogo):</span>{' '}
                      {serviceTypeLabel(form.service_type) || '-'}
                    </p>
                    <p className="text-slate-200 break-words">
                      <span className="text-slate-400">Descripción:</span> {form.service_label || '-'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Cálculo: {mode === 'catalog' ? 'Catálogo web (precios alineados)' : 'Manual (dominio $15 + correo $10)'}
                    </p>
                    {(form.service_type === CATALOG_OTHER || revCatalog?.needsDomainEmail) && (
                      <>
                        <p className="text-slate-200">
                          <span className="text-slate-400">Dominio (cliente):</span>{' '}
                          {form.has_domain ? (form.has_domain === 'si' ? 'Sí' : `No (+$${domainNoFee})`) : '-'}
                        </p>
                        <p className="text-slate-200">
                          <span className="text-slate-400">
                            {revCatalog?.wordpressDomainHosting ? 'Hosting (1.er año):' : 'Correo profesional:'}
                          </span>{' '}
                          {form.has_professional_email
                            ? form.has_professional_email === 'si'
                              ? 'Sí'
                              : `No (+$${secondNoFee})`
                            : '-'}
                        </p>
                      </>
                    )}
                    {form.service_type === CATALOG_OTHER && (
                      <p className="text-slate-200">
                        <span className="text-slate-400">Hosting (nota):</span>{' '}
                        {form.has_hosting ? (form.has_hosting === 'si' ? 'Sí' : 'No') : '-'}
                      </p>
                    )}
                    <p className="text-slate-200">
                      <span className="text-slate-400">Páginas:</span> {form.quantity_pages || '-'}
                    </p>
                    <div className="border-t border-slate-800 pt-3 mt-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Desglose</p>
                      <ul className="space-y-1 text-slate-200">
                        {lines.length === 0 ? (
                          <li className="text-slate-500">Sin partidas (precio base 0 y sin extras)</li>
                        ) : (
                          lines.map((l, i) => (
                            <li key={i} className="flex flex-wrap justify-between gap-2">
                              <span className="break-words min-w-0">{l.label}</span>
                              <span className="tabular-nums shrink-0">${l.amount.toFixed(2)}</span>
                            </li>
                          ))
                        )}
                      </ul>
                      <p className="mt-2 text-slate-400 text-xs">
                        Subtotal base: ${subtotal.toFixed(2)} · Extras: ${extrasTotal.toFixed(2)}
                      </p>
                      <p className="mt-2 text-lg font-bold text-white">
                        Total USD: ${total.toFixed(2)}
                        {catalog?.monthly ? '/mes' : ''}
                      </p>
                    </div>
                    <p className="text-slate-200">
                      <span className="text-slate-400">Estado:</span> {form.status}
                    </p>
                  </div>
                )
              })()}
            </div>
          )}

          <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1 || loading}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-50 w-full sm:w-auto"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              Anterior
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                disabled={!canGoNextStep || loading}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 w-full sm:w-auto"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-50 w-full sm:w-auto"
              >
                <Check className="w-4 h-4 shrink-0" />
                {loading ? 'Guardando…' : 'Crear cotización'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
