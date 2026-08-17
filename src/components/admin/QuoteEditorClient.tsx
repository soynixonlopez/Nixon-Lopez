'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderPlus } from 'lucide-react'
import { AdminConfiguratorEditor } from '@/components/admin/AdminConfiguratorEditor'
import {
  buildConfiguratorPayload,
  configuratorTotals,
  emptyConfiguratorState,
  isFixedScopeAdminProject,
  parseClientExtraFromPayload,
  parseConfiguratorFromPayload,
  parsePriceOverride,
  type ConfiguratorState,
} from '@/lib/admin-configurator-quote'
import { createClient } from '@/lib/supabase/client'

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

function initialConfig(quote: Quote): ConfiguratorState {
  return parseConfiguratorFromPayload(quote.raw_payload) ?? emptyConfiguratorState()
}

function initialOverride(quote: Quote): string {
  const fromPayload = parsePriceOverride(quote.raw_payload)
  if (fromPayload != null) return String(fromPayload)
  return ''
}

function initialCustomDecision(quote: Quote): string {
  if (!quote.raw_payload || typeof quote.raw_payload !== 'object' || Array.isArray(quote.raw_payload)) {
    return ''
  }
  const value = (quote.raw_payload as Record<string, unknown>).custom_decision
  return typeof value === 'string' ? value : ''
}

export function QuoteEditorClient({ quote }: { quote: Quote }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<ConfiguratorState>(() => initialConfig(quote))
  const [priceOverride, setPriceOverride] = useState(() => initialOverride(quote))
  const [customDecision, setCustomDecision] = useState(() => initialCustomDecision(quote))
  const clientExtra = parseClientExtraFromPayload(quote.raw_payload)
  const [form, setForm] = useState({
    status: quote.status,
    client_first_name: quote.client_first_name,
    client_last_name: quote.client_last_name,
    client_email: quote.client_email,
    client_phone: quote.client_phone ?? '',
    company: quote.company ?? '',
    client_ruc: clientExtra.client_ruc,
    client_city: clientExtra.client_city,
    client_address: clientExtra.client_address,
    internal_notes: quote.internal_notes ?? '',
    comments: quote.comments ?? '',
  })

  const overrideValue = priceOverride.trim() === '' ? null : Number.parseFloat(priceOverride)
  const totals = useMemo(
    () =>
      configuratorTotals(
        config,
        overrideValue != null && Number.isFinite(overrideValue) ? overrideValue : null
      ),
    [config, overrideValue]
  )

  const canSave = Boolean(config.projectType) && (
    isFixedScopeAdminProject(config.projectType) ||
    ((config.hasDomain === 'si' || config.hasDomain === 'no') &&
      (config.hasHosting === 'si' || config.hasHosting === 'no'))
  )

  async function save() {
    if (!canSave || !config.projectType) return
    setSaving(true)
    const supabase = createClient()
    const payload = buildConfiguratorPayload(config, {
      priceOverride: totals.override,
      customDecision,
    })
    const raw_payload = mergeRawPayload(quote.raw_payload, {
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
        service_id: config.projectType,
        service_label: totals.quote.projectLabel,
        quantity_pages: null,
        subtotal: totals.base,
        extras_total: totals.extras,
        total_amount: totals.total,
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
        description: totals.quote.projectLabel || null,
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
      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Editar cotización</h1>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm sm:p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total</p>
        <ul className="space-y-1 text-slate-700">
          {totals.quote.lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-2">
              <span>{line.label}</span>
              <span className="tabular-nums">${line.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="border-t border-slate-200 pt-2 text-slate-900">
          Automático ${totals.quote.total.toFixed(2)} ·{' '}
          <span className="font-semibold">Final ${totals.total.toFixed(2)} USD</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs text-slate-400">Estado</span>
          <select
            value={form.status}
            onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
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
            onChange={(e) => setForm((c) => ({ ...c, client_first_name: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Apellido</span>
          <input
            value={form.client_last_name}
            onChange={(e) => setForm((c) => ({ ...c, client_last_name: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Correo</span>
          <input
            type="email"
            value={form.client_email}
            onChange={(e) => setForm((c) => ({ ...c, client_email: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Teléfono</span>
          <input
            value={form.client_phone}
            onChange={(e) => setForm((c) => ({ ...c, client_phone: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Empresa</span>
          <input
            value={form.company}
            onChange={(e) => setForm((c) => ({ ...c, company: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">RUC / cédula</span>
          <input
            value={form.client_ruc}
            onChange={(e) => setForm((c) => ({ ...c, client_ruc: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Lugar / ciudad</span>
          <input
            value={form.client_city}
            onChange={(e) => setForm((c) => ({ ...c, client_city: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Dirección (opcional)</span>
          <input
            value={form.client_address}
            onChange={(e) => setForm((c) => ({ ...c, client_address: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
          />
        </label>

        <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-bold text-slate-900">Configurador (precios actuales)</p>
          <AdminConfiguratorEditor state={config} onChange={setConfig} />
        </div>

        <div className="sm:col-span-2 space-y-3 rounded-xl border border-brand/20 bg-brand/[0.04] p-4">
          <label className="block">
            <span className="text-xs text-slate-500">
              Precio final personalizado (vacío = automático ${totals.quote.total})
            </span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={priceOverride}
              onChange={(e) => setPriceOverride(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-500">Decisión personalizada</span>
            <textarea
              value={customDecision}
              onChange={(e) => setCustomDecision(e.target.value)}
              rows={3}
              placeholder="Descuento, alcance especial, condiciones…"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            />
          </label>
        </div>

        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Comentarios del cliente</span>
          <textarea
            value={form.comments}
            onChange={(e) => setForm((c) => ({ ...c, comments: e.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Notas internas</span>
          <textarea
            value={form.internal_notes}
            onChange={(e) => setForm((c) => ({ ...c, internal_notes: e.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
          />
        </label>
      </div>

      <div className="flex flex-col flex-wrap gap-3 sm:flex-row">
        <button
          type="button"
          onClick={save}
          disabled={saving || !canSave}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand px-5 py-2.5 font-medium text-white hover:bg-brand-light disabled:opacity-50 sm:w-auto"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={convertToProject}
          disabled={saving}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
        >
          <FolderPlus className="h-4 w-4 shrink-0" />
          Añadir a proyectos
        </button>
      </div>
    </div>
  )
}
