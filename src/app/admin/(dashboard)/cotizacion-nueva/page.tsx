'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check, ChevronLeft, ChevronRight, Plus, Sparkles, Trash2 } from 'lucide-react'
import { CATALOG_OTHER, createAdminQuoteDraft, resolveAdminQuoteBundle, type AdminQuoteServiceDraft } from '@/lib/admin-quote-services'
import { formatQuoteProjectSummary, getQuoteAddonIfMissing, getService, QUOTE_SERVICES } from '@/lib/quote-pricing'

export default function NuevaCotizacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [pendingServiceType, setPendingServiceType] = useState('')
  const [services, setServices] = useState<AdminQuoteServiceDraft[]>([])
  const [form, setForm] = useState({
    client_first_name: '',
    client_last_name: '',
    client_email: '',
    client_phone: '',
    company: '',
    comments: '',
    internal_notes: '',
    status: 'new',
  })

  const steps = [
    { id: 1, title: 'Datos del cliente' },
    { id: 2, title: 'Servicios y alcance' },
    { id: 3, title: 'Detalles finales' },
    { id: 4, title: 'Revisión' },
  ]

  const bundle = useMemo(() => resolveAdminQuoteBundle(services), [services])

  const servicesValid =
    services.length > 0 &&
    !bundle.mixedBilling &&
    services.every((service) => {
      if (!service.service_label.trim()) return false
      const catalog = service.service_type && service.service_type !== CATALOG_OTHER ? getService(service.service_type) : undefined
      if (catalog?.needsPages) {
        const pages = Number(service.quantity_pages)
        if (!Number.isFinite(pages) || pages < 1 || pages > 50) return false
      }
      if ((catalog?.needsDomainEmail ?? false) || service.service_type === CATALOG_OTHER) {
        if (!service.has_domain || !service.has_professional_email) return false
      }
      return true
    })

  const canGoNextStep =
    (step === 1 &&
      form.client_first_name.trim() &&
      form.client_last_name.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)) ||
    (step === 2 && servicesValid) ||
    step === 3

  const stepProgress = ((step - 1) / (steps.length - 1)) * 100

  const updateService = (key: string, patch: Partial<AdminQuoteServiceDraft>) => {
    setServices((current) => current.map((service) => (service.key === key ? { ...service, ...patch } : service)))
  }

  const addService = () => {
    if (!pendingServiceType) return
    setServices((current) => [...current, createAdminQuoteDraft(pendingServiceType)])
    setPendingServiceType('')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const first = services[0]

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
        service_id: services.length === 1 ? first?.service_type || null : 'multiple',
        service_label: bundle.serviceLabelSummary || null,
        quantity_pages:
          services.length === 1 && first?.quantity_pages ? Number.parseInt(first.quantity_pages, 10) : null,
        total_amount: bundle.total,
        subtotal: bundle.subtotal,
        extras_total: bundle.extrasTotal,
        comments: form.comments || null,
        internal_notes: form.internal_notes || null,
        raw_payload: {
          manual: true,
          catalog: services.every((service) => service.service_type !== CATALOG_OTHER),
          monthly: bundle.monthly,
          service_type: services.length === 1 ? first?.service_type || null : 'multiple',
          has_domain: services.length === 1 ? first?.has_domain || null : null,
          has_professional_email: services.length === 1 ? first?.has_professional_email || null : null,
          has_hosting: services.length === 1 ? first?.has_hosting || null : null,
          base_amount:
            services.length === 1 && first?.base_amount.trim() !== ''
              ? Number.parseFloat(first.base_amount)
              : 0,
          selected_services: bundle.services,
          breakdown: { lines: bundle.lines },
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
            <p className="text-sm text-slate-400">Ahora puedes agregar varios servicios en una sola cotización.</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((item) => (
              <div
                key={item.id}
                className={`text-xs sm:text-sm rounded-lg px-3 py-2 border ${
                  step >= item.id
                    ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-200'
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                <span className="font-semibold">Paso {item.id}:</span> {item.title}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Datos del cliente</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label>
                  <span className="text-xs text-slate-400">Nombre *</span>
                  <input
                    required
                    value={form.client_first_name}
                    onChange={(e) => setForm((current) => ({ ...current, client_first_name: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </label>
                <label>
                  <span className="text-xs text-slate-400">Apellido *</span>
                  <input
                    required
                    value={form.client_last_name}
                    onChange={(e) => setForm((current) => ({ ...current, client_last_name: e.target.value }))}
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
                  onChange={(e) => setForm((current) => ({ ...current, client_email: e.target.value }))}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <label>
                  <span className="text-xs text-slate-400">Teléfono</span>
                  <input
                    value={form.client_phone}
                    onChange={(e) => setForm((current) => ({ ...current, client_phone: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </label>
                <label>
                  <span className="text-xs text-slate-400">Empresa</span>
                  <input
                    value={form.company}
                    onChange={(e) => setForm((current) => ({ ...current, company: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Servicios del paquete</h2>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
                <label className="block">
                  <span className="text-xs text-slate-400">Agregar servicio</span>
                  <div className="mt-1 flex flex-col sm:flex-row gap-3">
                    <select
                      value={pendingServiceType}
                      onChange={(e) => setPendingServiceType(e.target.value)}
                      className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                    >
                      <option value="">Selecciona un servicio</option>
                      {QUOTE_SERVICES.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.label} — ${service.price}
                          {service.monthly ? '/mes' : ''}
                        </option>
                      ))}
                      <option value={CATALOG_OTHER}>Otro — precio y descripción manual</option>
                    </select>
                    <button
                      type="button"
                      onClick={addService}
                      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-indigo-600 text-white"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar
                    </button>
                  </div>
                </label>
                {bundle.mixedBilling ? (
                  <p className="text-sm rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-100">
                    No combines servicios mensuales con servicios de pago único en la misma cotización.
                  </p>
                ) : null}
              </div>

              {services.length === 0 ? (
                <p className="text-sm text-slate-500">Aún no has agregado servicios.</p>
              ) : (
                services.map((service, index) => {
                  const resolved = bundle.items[index]
                  const catalog =
                    service.service_type && service.service_type !== CATALOG_OTHER ? getService(service.service_type) : undefined
                  const addOns = getQuoteAddonIfMissing(catalog)
                  const isOther = service.service_type === CATALOG_OTHER

                  return (
                    <div key={service.key} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Servicio {index + 1}: {service.service_label || 'Sin descripción'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Total parcial: ${resolved.total.toFixed(2)}
                            {resolved.snapshot.monthly ? '/mes' : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setServices((current) => current.filter((item) => item.key !== service.key))}
                          className="inline-flex items-center justify-center gap-2 min-h-[40px] px-3 py-2 rounded-lg border border-red-900/60 text-red-300 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Quitar
                        </button>
                      </div>

                      <label className="block">
                        <span className="text-xs text-slate-400">Servicio / descripción *</span>
                        <input
                          value={service.service_label}
                          onChange={(e) => updateService(service.key, { service_label: e.target.value })}
                          className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                        />
                      </label>

                      {catalog ? (
                        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Qué incluye</p>
                          <ul className="mt-2 space-y-1 text-sm text-slate-300 list-disc pl-5">
                            {catalog.offerPoints.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 rounded-lg border border-slate-700/80 bg-slate-950/40 px-3 py-2 leading-relaxed">
                          Servicio manual: puedes definir nombre y precio base libremente.
                        </p>
                      )}

                      {(catalog?.needsDomainEmail || isOther) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs text-slate-400 block">¿Tiene dominio? *</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {(['si', 'no'] as const).map((value) => (
                                <button
                                  type="button"
                                  key={value}
                                  onClick={() => updateService(service.key, { has_domain: value })}
                                  className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm ${
                                    service.has_domain === value
                                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                                      : 'border-slate-700 text-slate-300'
                                  }`}
                                >
                                  {value === 'si' ? 'Sí' : `No (+$${addOns.domainUsd})`}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block">
                              {catalog?.wordpressDomainHosting ? '¿Tiene hosting? *' : '¿Correo profesional? *'}
                            </span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {(['si', 'no'] as const).map((value) => (
                                <button
                                  type="button"
                                  key={value}
                                  onClick={() => updateService(service.key, { has_professional_email: value })}
                                  className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm ${
                                    service.has_professional_email === value
                                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                                      : 'border-slate-700 text-slate-300'
                                  }`}
                                >
                                  {value === 'si' ? 'Sí' : `No (+$${addOns.secondUsd})`}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {isOther ? (
                        <div>
                          <span className="text-xs text-slate-400 block">¿Tiene hosting? (informativo)</span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {(['si', 'no'] as const).map((value) => (
                              <button
                                type="button"
                                key={value}
                                onClick={() => updateService(service.key, { has_hosting: value })}
                                className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm ${
                                  service.has_hosting === value
                                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                                    : 'border-slate-700 text-slate-300'
                                }`}
                              >
                                {value === 'si' ? 'Sí' : 'No'}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {catalog?.needsPages || isOther ? (
                          <label>
                            <span className="text-xs text-slate-400">
                              {catalog?.needsPages ? 'Cantidad de páginas *' : 'Cantidad de páginas (opcional)'}
                            </span>
                            <input
                              type="number"
                              min={1}
                              max={50}
                              value={service.quantity_pages}
                              onChange={(e) => updateService(service.key, { quantity_pages: e.target.value })}
                              className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                            />
                          </label>
                        ) : null}
                        <label className={catalog?.needsPages || isOther ? '' : 'sm:col-span-2'}>
                          <span className="text-xs text-slate-400">Precio base del servicio (USD)</span>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={service.base_amount}
                            onChange={(e) => updateService(service.key, { base_amount: e.target.value })}
                            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                          />
                        </label>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Detalles y seguimiento</h2>
              <label className="block">
                <span className="text-xs text-slate-400">Comentarios para el cliente</span>
                <textarea
                  value={form.comments}
                  onChange={(e) => setForm((current) => ({ ...current, comments: e.target.value }))}
                  rows={4}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-400">Notas internas</span>
                <textarea
                  value={form.internal_notes}
                  onChange={(e) => setForm((current) => ({ ...current, internal_notes: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-400">Estado inicial</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                >
                  <option value="new">Nueva</option>
                  <option value="sent">Enviada</option>
                  <option value="won">Ganada</option>
                  <option value="lost">Perdida</option>
                </select>
              </label>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Revisión final</h2>
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
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    {formatQuoteProjectSummary({
                      company: form.company,
                      clientName: `${form.client_first_name} ${form.client_last_name}`.trim(),
                    })}
                  </p>
                  {bundle.services.map((service, index) => (
                    <div key={`${service.serviceId}-${index}`} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <p className="font-semibold text-white">{service.label}</p>
                        <p className="font-semibold text-indigo-300">
                          ${service.total.toFixed(2)}
                          {bundle.monthly ? '/mes' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-800 pt-3 mt-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Desglose</p>
                  <ul className="space-y-1 text-slate-200">
                    {bundle.lines.length === 0 ? (
                      <li className="text-slate-500">Sin partidas</li>
                    ) : (
                      bundle.lines.map((line, index) => (
                        <li key={`${line.label}-${index}`} className="flex flex-wrap justify-between gap-2">
                          <span className="break-words min-w-0">{line.label}</span>
                          <span className="tabular-nums shrink-0">${line.amount.toFixed(2)}</span>
                        </li>
                      ))
                    )}
                  </ul>
                  <p className="mt-2 text-slate-400 text-xs">
                    Subtotal base: ${bundle.subtotal.toFixed(2)} · Extras: ${bundle.extrasTotal.toFixed(2)}
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    Total USD: ${bundle.total.toFixed(2)}
                    {bundle.monthly ? '/mes' : ''}
                  </p>
                </div>
                <div className="border-t border-slate-800 pt-3 mt-2 space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Lo que incluye cada servicio
                  </p>
                  {bundle.services.map((service, index) => (
                    <div key={`${service.serviceId}-includes-${index}`} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                      <p className="font-semibold text-white">{service.label}</p>
                      {service.offerPoints.length > 0 ? (
                        <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300">
                          {service.offerPoints.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-slate-400">Alcance sujeto a la cotización aprobada.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              disabled={step === 1 || loading}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-50 w-full sm:w-auto"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              Anterior
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(4, current + 1))}
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
