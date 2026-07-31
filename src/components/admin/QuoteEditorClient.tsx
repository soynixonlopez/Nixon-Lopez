'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FolderPlus, Plus, Trash2 } from 'lucide-react'
import { CATALOG_OTHER, buildAdminQuoteDraftsFromExisting, createAdminQuoteDraft, resolveAdminQuoteBundle, type AdminQuoteServiceDraft } from '@/lib/admin-quote-services'
import { getQuoteAddonIfMissing, getService, QUOTE_SERVICES } from '@/lib/quote-pricing'

type Quote = Record<string, unknown> & {
  id: string
  status: string
  client_first_name: string
  client_last_name: string
  client_email: string
  client_phone: string | null
  company: string | null
  service_label: string | null
  service_id: string | null
  quantity_pages: number | null
  total_amount: number | null
  internal_notes: string | null
  comments: string | null
  raw_payload: unknown
}

const statuses = [
  'new',
  'reviewing',
  'accepted',
  'rejected',
  'converted_to_project',
  'archived',
] as const

function mergeRawPayload(existing: unknown, patch: Record<string, unknown>): Record<string, unknown> {
  const base =
    existing && typeof existing === 'object' && !Array.isArray(existing)
      ? { ...(existing as Record<string, unknown>) }
      : {}
  return { ...base, ...patch }
}

export function QuoteEditorClient({ quote }: { quote: Quote }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [pendingServiceType, setPendingServiceType] = useState('')
  const [services, setServices] = useState<AdminQuoteServiceDraft[]>(
    buildAdminQuoteDraftsFromExisting({
      service_id: quote.service_id,
      service_label: quote.service_label,
      quantity_pages: quote.quantity_pages,
      total_amount: quote.total_amount,
      raw_payload: quote.raw_payload,
    })
  )
  const [form, setForm] = useState({
    status: quote.status,
    client_first_name: quote.client_first_name,
    client_last_name: quote.client_last_name,
    client_email: quote.client_email,
    client_phone: quote.client_phone ?? '',
    company: quote.company ?? '',
    internal_notes: quote.internal_notes ?? '',
    comments: quote.comments ?? '',
  })

  const bundle = useMemo(() => resolveAdminQuoteBundle(services), [services])

  const updateService = (key: string, patch: Partial<AdminQuoteServiceDraft>) => {
    setServices((current) => current.map((service) => (service.key === key ? { ...service, ...patch } : service)))
  }

  const addService = () => {
    if (!pendingServiceType) return
    setServices((current) => [...current, createAdminQuoteDraft(pendingServiceType)])
    setPendingServiceType('')
  }

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const first = services[0]
    const raw_payload = mergeRawPayload(quote.raw_payload, {
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
    })

    const { error } = await supabase
      .from('quotes')
      .update({
        status: form.status,
        client_first_name: form.client_first_name,
        client_last_name: form.client_last_name,
        client_email: form.client_email,
        client_phone: form.client_phone || null,
        company: form.company || null,
        service_id: services.length === 1 ? first?.service_type || null : 'multiple',
        service_label: bundle.serviceLabelSummary || null,
        quantity_pages:
          services.length === 1 && first?.quantity_pages ? Number.parseInt(first.quantity_pages, 10) : null,
        subtotal: bundle.subtotal,
        extras_total: bundle.extrasTotal,
        total_amount: bundle.total,
        internal_notes: form.internal_notes || null,
        comments: form.comments || null,
        raw_payload,
      })
      .eq('id', quote.id)

    setSaving(false)
    if (error) {
      alert(error.message)
      return
    }
    router.refresh()
  }

  async function convertToProject() {
    if (!confirm('¿Crear proyecto vinculado y marcar cotización como convertida?')) return
    setSaving(true)
    const supabase = createClient()
    const title = `Proyecto: ${form.client_first_name} ${form.client_last_name}`
    const { data: project, error: e1 } = await supabase
      .from('projects')
      .insert({
        quote_id: quote.id,
        title,
        client_name: `${form.client_first_name} ${form.client_last_name}`,
        client_email: form.client_email,
        client_phone: form.client_phone || null,
        status: 'pending',
        description: bundle.serviceLabelSummary || null,
      })
      .select('id')
      .single()
    if (e1 || !project) {
      setSaving(false)
      alert(e1?.message ?? 'Error creando proyecto')
      return
    }
    const { error: e2 } = await supabase
      .from('quotes')
      .update({
        status: 'converted_to_project',
        converted_project_id: (project as { id: string }).id,
      })
      .eq('id', quote.id)
    setSaving(false)
    if (e2) {
      alert(e2.message)
      return
    }
    router.push('/admin/proyectos')
    router.refresh()
  }

  return (
    <div className="w-full max-w-3xl min-w-0 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Editar cotización</h1>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-3 sm:p-4 space-y-2 text-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total calculado</p>
        {bundle.mixedBilling ? (
          <p className="text-amber-200 text-sm">
            No combines servicios mensuales con servicios de pago único en la misma cotización.
          </p>
        ) : null}
        <ul className="space-y-1 text-slate-700">
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
        <p className="text-xs text-slate-500 pt-1 border-t border-slate-200">
          Base ${bundle.subtotal.toFixed(2)} · Extras ${bundle.extrasTotal.toFixed(2)} ·{' '}
          <span className="text-slate-900 font-semibold">Total ${bundle.total.toFixed(2)} USD{bundle.monthly ? '/mes' : ''}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs text-slate-400">Estado</span>
          <select
            value={form.status}
            onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-xs text-slate-400">Nombre</span>
          <input
            value={form.client_first_name}
            onChange={(e) => setForm((current) => ({ ...current, client_first_name: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Apellido</span>
          <input
            value={form.client_last_name}
            onChange={(e) => setForm((current) => ({ ...current, client_last_name: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Correo</span>
          <input
            type="email"
            value={form.client_email}
            onChange={(e) => setForm((current) => ({ ...current, client_email: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Teléfono</span>
          <input
            value={form.client_phone}
            onChange={(e) => setForm((current) => ({ ...current, client_phone: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Empresa</span>
          <input
            value={form.company}
            onChange={(e) => setForm((current) => ({ ...current, company: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </label>

        <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
          <label className="block">
            <span className="text-xs text-slate-400">Agregar servicio</span>
            <div className="mt-1 flex flex-col sm:flex-row gap-3">
              <select
                value={pendingServiceType}
                onChange={(e) => setPendingServiceType(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
              >
                <option value="">Selecciona un servicio</option>
                {QUOTE_SERVICES.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.label} — ${service.price}
                    {service.monthly ? '/mes' : ''}
                  </option>
                ))}
                <option value={CATALOG_OTHER}>Otro — precio manual</option>
              </select>
              <button
                type="button"
                onClick={addService}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-brand text-white"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
          </label>
        </div>

        <div className="sm:col-span-2 space-y-4">
          {services.map((service, index) => {
            const catalog =
              service.service_type && service.service_type !== CATALOG_OTHER ? getService(service.service_type) : undefined
            const addOns = getQuoteAddonIfMissing(catalog)
            const isOther = service.service_type === CATALOG_OTHER
            const resolved = bundle.items[index]

            return (
              <div key={service.key} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
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
                    className="inline-flex items-center justify-center gap-2 min-h-[40px] px-3 py-2 rounded-lg border border-red-900/60 text-red-600 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Quitar
                  </button>
                </div>

                <label className="block">
                  <span className="text-xs text-slate-400">Servicio / descripción</span>
                  <input
                    value={service.service_label}
                    onChange={(e) => updateService(service.key, { service_label: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  />
                </label>

                {catalog ? (
                  <div className="rounded-lg border border-neon-blue/20 bg-brand/5 px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">Qué incluye</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600 list-disc pl-5">
                      {catalog.offerPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {(catalog?.needsDomainEmail || isOther) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-400">¿Tiene dominio?</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {(['si', 'no'] as const).map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => updateService(service.key, { has_domain: value })}
                            className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm ${
                              service.has_domain === value
                                ? 'border-brand/30 bg-brand/10 text-brand'
                                : 'border-slate-200 text-slate-600'
                            }`}
                          >
                            {value === 'si' ? 'Sí' : `No (+$${addOns.domainUsd})`}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">
                        {catalog?.wordpressDomainHosting ? '¿Tiene hosting?' : '¿Correo profesional?'}
                      </span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {(['si', 'no'] as const).map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => updateService(service.key, { has_professional_email: value })}
                            className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm ${
                              service.has_professional_email === value
                                ? 'border-brand/30 bg-brand/10 text-brand'
                                : 'border-slate-200 text-slate-600'
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
                    <span className="text-xs text-slate-400">¿Tiene hosting? (informativo)</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {(['si', 'no'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => updateService(service.key, { has_hosting: value })}
                          className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm ${
                            service.has_hosting === value
                              ? 'border-brand/30 bg-brand/10 text-brand'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          {value === 'si' ? 'Sí' : 'No'}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid sm:grid-cols-2 gap-4">
                  {catalog?.needsPages || isOther ? (
                    <label>
                      <span className="text-xs text-slate-400">
                        {catalog?.needsPages ? 'Cantidad de páginas' : 'Cantidad de páginas (opcional)'}
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={service.quantity_pages}
                        onChange={(e) => updateService(service.key, { quantity_pages: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                      />
                    </label>
                  ) : null}
                  <label className={catalog?.needsPages || isOther ? '' : 'sm:col-span-2'}>
                    <span className="text-xs text-slate-400">Precio base (USD)</span>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={service.base_amount}
                      onChange={(e) => updateService(service.key, { base_amount: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                    />
                  </label>
                </div>
              </div>
            )
          })}
        </div>

        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Comentarios del cliente</span>
          <textarea
            value={form.comments}
            onChange={(e) => setForm((current) => ({ ...current, comments: e.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Notas internas</span>
          <textarea
            value={form.internal_notes}
            onChange={(e) => setForm((current) => ({ ...current, internal_notes: e.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || services.length === 0 || bundle.mixedBilling}
          className="inline-flex min-h-[44px] px-5 py-2.5 rounded-xl bg-brand text-white font-medium hover:bg-brand-light disabled:opacity-50 w-full sm:w-auto items-center justify-center"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={convertToProject}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 w-full sm:w-auto"
        >
          <FolderPlus className="w-4 h-4 shrink-0" />
          Añadir a proyectos (pendiente)
        </button>
      </div>
    </div>
  )
}
