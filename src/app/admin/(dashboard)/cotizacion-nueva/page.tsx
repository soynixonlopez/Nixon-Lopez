'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { AdminConfiguratorEditor } from '@/components/admin/AdminConfiguratorEditor'
import {
  buildConfiguratorPayload,
  configuratorTotals,
  emptyConfiguratorState,
  isSocialMediaProjectType,
  PROJECT_TYPES,
  type ConfiguratorState,
} from '@/lib/admin-configurator-quote'
import { createClient } from '@/lib/supabase/client'

export default function NuevaCotizacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<ConfiguratorState>(emptyConfiguratorState)
  const [priceOverride, setPriceOverride] = useState('')
  const [customDecision, setCustomDecision] = useState('')
  const [form, setForm] = useState({
    client_first_name: '',
    client_last_name: '',
    client_email: '',
    client_phone: '',
    company: '',
    client_ruc: '',
    client_city: '',
    client_address: '',
    comments: '',
    internal_notes: '',
    status: 'new',
  })

  const steps = [
    { id: 1, title: 'Datos del cliente' },
    { id: 2, title: 'Configurador' },
    { id: 3, title: 'Ajustes' },
    { id: 4, title: 'Revisión' },
  ]

  const overrideValue = priceOverride.trim() === '' ? null : Number.parseFloat(priceOverride)
  const totals = useMemo(
    () =>
      configuratorTotals(
        config,
        overrideValue != null && Number.isFinite(overrideValue) ? overrideValue : null
      ),
    [config, overrideValue]
  )

  const isRedesPlan =
    isSocialMediaProjectType(config.projectType) ||
    Boolean(
      config.projectType &&
        PROJECT_TYPES.find((p) => p.id === config.projectType)?.category === 'redes'
    )

  const canGoNextStep = (() => {
    if (step === 1) {
      return Boolean(
        form.client_first_name.trim() &&
          form.client_last_name.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)
      )
    }
    if (step === 2) {
      if (!config.projectType) return false
      // Planes de redes: no requieren dominio/hosting
      if (isRedesPlan) return true
      return (
        (config.hasDomain === 'si' || config.hasDomain === 'no') &&
        (config.hasHosting === 'si' || config.hasHosting === 'no')
      )
    }
    if (step === 3) return true
    return false
  })()

  const stepProgress = ((step - 1) / (steps.length - 1)) * 100

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!config.projectType) return
    setLoading(true)
    const supabase = createClient()
    const payload = buildConfiguratorPayload(config, {
      priceOverride: totals.override,
      customDecision,
    })

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
        service_id: config.projectType,
        service_label: totals.quote.projectLabel,
        quantity_pages: null,
        total_amount: totals.total,
        subtotal: totals.base,
        extras_total: totals.extras,
        comments: form.comments || null,
        internal_notes: form.internal_notes || null,
        raw_payload: {
          ...payload,
          client_ruc: form.client_ruc.trim() || null,
          client_tax_id: form.client_ruc.trim() || null,
          client_city: form.client_city.trim() || null,
          city: form.client_city.trim() || null,
          client_address: form.client_address.trim() || null,
          client: {
            nombre: form.client_first_name,
            apellido: form.client_last_name,
            correo: form.client_email,
            whatsapp: form.client_phone,
            empresa: form.company,
            ruc: form.client_ruc.trim() || null,
            tax_id: form.client_ruc.trim() || null,
            ciudad: form.client_city.trim() || null,
            city: form.client_city.trim() || null,
            direccion: form.client_address.trim() || null,
            address: form.client_address.trim() || null,
          },
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
    <div className="mx-auto w-full max-w-4xl space-y-6 px-2 sm:px-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Nueva cotización</h1>
            <p className="text-sm text-slate-400">
              Mismo configurador y precios del cotizador público.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-brand to-neon-purple transition-all duration-300"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {steps.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg border px-3 py-2 text-xs sm:text-sm ${
                  step >= item.id
                    ? 'border-brand/30 bg-brand/10 text-brand'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
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
              <h2 className="text-lg font-semibold text-slate-900">Datos del cliente</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-xs text-slate-400">Nombre *</span>
                  <input
                    required
                    value={form.client_first_name}
                    onChange={(e) => setForm((c) => ({ ...c, client_first_name: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  />
                </label>
                <label>
                  <span className="text-xs text-slate-400">Apellido *</span>
                  <input
                    required
                    value={form.client_last_name}
                    onChange={(e) => setForm((c) => ({ ...c, client_last_name: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-slate-400">Correo *</span>
                <input
                  type="email"
                  required
                  value={form.client_email}
                  onChange={(e) => setForm((c) => ({ ...c, client_email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-xs text-slate-400">WhatsApp / teléfono</span>
                  <input
                    value={form.client_phone}
                    onChange={(e) => setForm((c) => ({ ...c, client_phone: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  />
                </label>
                <label>
                  <span className="text-xs text-slate-400">Empresa</span>
                  <input
                    value={form.company}
                    onChange={(e) => setForm((c) => ({ ...c, company: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  />
                </label>
                <label>
                  <span className="text-xs text-slate-400">RUC / cédula</span>
                  <input
                    value={form.client_ruc}
                    onChange={(e) => setForm((c) => ({ ...c, client_ruc: e.target.value }))}
                    placeholder="Ej. 8-888-888 o RUC"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  />
                </label>
                <label>
                  <span className="text-xs text-slate-400">Lugar / ciudad</span>
                  <input
                    value={form.client_city}
                    onChange={(e) => setForm((c) => ({ ...c, client_city: e.target.value }))}
                    placeholder="Ej. Panamá, Chiriquí…"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="text-xs text-slate-400">Dirección (opcional)</span>
                  <input
                    value={form.client_address}
                    onChange={(e) => setForm((c) => ({ ...c, client_address: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Configurador de proyecto</h2>
              <AdminConfiguratorEditor state={config} onChange={setConfig} />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Ajustes y seguimiento</h2>
              <div className="rounded-xl border border-brand/20 bg-brand/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Precio automático
                </p>
                <p className="mt-1 text-2xl font-bold text-brand">${totals.quote.total} USD</p>
                <label className="mt-3 block">
                  <span className="text-xs text-slate-500">
                    Precio final personalizado (opcional, deja vacío para usar el automático)
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={priceOverride}
                    onChange={(e) => setPriceOverride(e.target.value)}
                    placeholder={String(totals.quote.total)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
                  />
                </label>
                <label className="mt-3 block">
                  <span className="text-xs text-slate-500">Decisión / nota personalizada</span>
                  <textarea
                    value={customDecision}
                    onChange={(e) => setCustomDecision(e.target.value)}
                    rows={3}
                    placeholder="Ej: Descuento por cliente referido, alcance especial, etc."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-slate-400">Comentarios para el cliente</span>
                <textarea
                  value={form.comments}
                  onChange={(e) => setForm((c) => ({ ...c, comments: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-400">Notas internas</span>
                <textarea
                  value={form.internal_notes}
                  onChange={(e) => setForm((c) => ({ ...c, internal_notes: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-400">Estado inicial</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
                >
                  <option value="new">Nueva</option>
                  <option value="reviewing">En revisión</option>
                  <option value="accepted">Aceptada</option>
                  <option value="rejected">Rechazada</option>
                </select>
              </label>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Revisión final</h2>
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <p>
                  <span className="text-slate-400">Cliente:</span>{' '}
                  {form.client_first_name} {form.client_last_name}
                </p>
                <p>
                  <span className="text-slate-400">Correo:</span> {form.client_email}
                </p>
                {form.client_ruc.trim() ? (
                  <p>
                    <span className="text-slate-400">RUC / cédula:</span> {form.client_ruc.trim()}
                  </p>
                ) : null}
                {form.client_city.trim() || form.client_address.trim() ? (
                  <p>
                    <span className="text-slate-400">Lugar:</span>{' '}
                    {[form.client_city.trim(), form.client_address.trim()].filter(Boolean).join(' · ')}
                  </p>
                ) : null}
                <p>
                  <span className="text-slate-400">Proyecto:</span> {totals.quote.projectLabel}
                </p>
                {config.projectType ? (
                  <ul className="list-disc space-y-1 border-t border-slate-200 pt-3 pl-5 text-slate-600">
                    {(PROJECT_TYPES.find((p) => p.id === config.projectType)?.includes ?? []).map(
                      (item) => (
                        <li key={item}>{item}</li>
                      )
                    )}
                  </ul>
                ) : null}
                <ul className="space-y-1 border-t border-slate-200 pt-3">
                  {totals.quote.lines.map((line) => (
                    <li key={line.id} className="flex justify-between gap-2">
                      <span className="text-slate-600">{line.label}</span>
                      <span className="tabular-nums">${line.amount}</span>
                    </li>
                  ))}
                </ul>
                {totals.override != null && totals.override !== totals.quote.total ? (
                  <p className="text-amber-700">
                    Ajuste personalizado → total final ${totals.total} USD
                  </p>
                ) : null}
                {customDecision.trim() ? (
                  <p className="text-slate-600">
                    <span className="text-slate-400">Decisión:</span> {customDecision}
                  </p>
                ) : null}
                <p className="text-lg font-bold text-slate-900">
                  Total: ${totals.total} USD{totals.monthly ? ' / mes' : ''}
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep((c) => Math.max(1, c - 1))}
              disabled={step === 1 || loading}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            {step < 4 ? (
              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
                {step === 2 && !canGoNextStep ? (
                  <p className="text-right text-xs text-amber-700">
                    {config.projectType
                      ? 'Para proyectos web, indica si ya tiene dominio y hosting.'
                      : 'Selecciona un tipo de proyecto o plan para continuar.'}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!canGoNextStep || loading) return
                    setStep((c) => Math.min(4, c + 1))
                  }}
                  disabled={!canGoNextStep || loading}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2 font-medium text-white hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading || !config.projectType}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-500 disabled:opacity-50 sm:w-auto"
              >
                <Check className="h-4 w-4" />
                {loading ? 'Guardando…' : 'Crear cotización'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
