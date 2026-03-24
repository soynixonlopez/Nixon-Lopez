'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FolderPlus } from 'lucide-react'
import {
  ADMIN_SERVICE_TYPE_OPTIONS,
  computeManualQuoteTotals,
  type YesNo,
} from '@/lib/quote-pricing'

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

function parseYesNo(v: unknown): YesNo {
  return v === 'si' || v === 'no' ? v : ''
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

  const rawInit =
    quote.raw_payload && typeof quote.raw_payload === 'object' && !Array.isArray(quote.raw_payload)
      ? (quote.raw_payload as Record<string, unknown>)
      : {}

  const initialBase =
    typeof rawInit.base_amount === 'number' && !Number.isNaN(rawInit.base_amount)
      ? rawInit.base_amount
      : quote.total_amount != null
        ? Number(quote.total_amount)
        : ''

  const [form, setForm] = useState({
    status: quote.status,
    client_first_name: quote.client_first_name,
    client_last_name: quote.client_last_name,
    client_email: quote.client_email,
    client_phone: quote.client_phone ?? '',
    company: quote.company ?? '',
    service_type: (typeof rawInit.service_type === 'string' ? rawInit.service_type : quote.service_id) ?? '',
    service_label: quote.service_label ?? '',
    quantity_pages: quote.quantity_pages ?? '',
    base_amount: initialBase === '' ? '' : String(initialBase),
    has_domain: parseYesNo(rawInit.has_domain),
    has_professional_email: parseYesNo(rawInit.has_professional_email),
    internal_notes: quote.internal_notes ?? '',
    comments: quote.comments ?? '',
  })

  const pricing = useMemo(() => {
    const base = form.base_amount === '' ? 0 : Number(form.base_amount)
    return computeManualQuoteTotals({
      baseAmount: Number.isFinite(base) ? base : 0,
      hasDomain: form.has_domain,
      hasProfessionalEmail: form.has_professional_email,
    })
  }, [form.base_amount, form.has_domain, form.has_professional_email])

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const baseNum = form.base_amount === '' ? 0 : Number(form.base_amount)
    const { lines, subtotal, extrasTotal, total } = computeManualQuoteTotals({
      baseAmount: Number.isFinite(baseNum) ? baseNum : 0,
      hasDomain: form.has_domain,
      hasProfessionalEmail: form.has_professional_email,
    })
    const raw_payload = mergeRawPayload(quote.raw_payload, {
      manual: true,
      service_type: form.service_type || null,
      has_domain: form.has_domain || null,
      has_professional_email: form.has_professional_email || null,
      base_amount: Number.isFinite(baseNum) ? baseNum : 0,
      breakdown: { lines },
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
        service_id: form.service_type || null,
        service_label: form.service_label || null,
        quantity_pages: form.quantity_pages === '' ? null : Number(form.quantity_pages),
        subtotal,
        extras_total: extrasTotal,
        total_amount: total,
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
        description: form.service_label || null,
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
      <h1 className="text-xl sm:text-2xl font-bold text-white">Editar cotización</h1>

      <div className="rounded-xl border border-slate-700/80 bg-slate-950/40 p-3 sm:p-4 space-y-2 text-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total calculado</p>
        <ul className="space-y-1 text-slate-200">
          {pricing.lines.length === 0 ? (
            <li className="text-slate-500">Sin partidas (ajusta precio base o extras)</li>
          ) : (
            pricing.lines.map((l, i) => (
              <li key={i} className="flex flex-wrap justify-between gap-2">
                <span className="break-words min-w-0">{l.label}</span>
                <span className="tabular-nums shrink-0">${l.amount.toFixed(2)}</span>
              </li>
            ))
          )}
        </ul>
        <p className="text-xs text-slate-500 pt-1 border-t border-slate-800">
          Base ${pricing.subtotal.toFixed(2)} · Extras ${pricing.extrasTotal.toFixed(2)} ·{' '}
          <span className="text-white font-semibold">Total ${pricing.total.toFixed(2)} USD</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs text-slate-400">Estado</span>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-xs text-slate-400">Nombre</span>
          <input
            value={form.client_first_name}
            onChange={(e) => setForm((f) => ({ ...f, client_first_name: e.target.value }))}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Apellido</span>
          <input
            value={form.client_last_name}
            onChange={(e) => setForm((f) => ({ ...f, client_last_name: e.target.value }))}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Correo</span>
          <input
            type="email"
            value={form.client_email}
            onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
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
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Tipo de servicio</span>
          <select
            value={form.service_type}
            onChange={(e) => setForm((f) => ({ ...f, service_type: e.target.value }))}
            className="mt-1 w-full min-w-0 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          >
            <option value="">—</option>
            {ADMIN_SERVICE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Servicio / descripción</span>
          <input
            value={form.service_label}
            onChange={(e) => setForm((f) => ({ ...f, service_label: e.target.value }))}
            className="mt-1 w-full min-w-0 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-slate-400">¿Tiene dominio?</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {(['si', 'no'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, has_domain: value }))}
                  className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm ${form.has_domain === value ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-slate-700 text-slate-300'}`}
                >
                  {value === 'si' ? 'Sí' : 'No'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400">¿Correo profesional?</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {(['si', 'no'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, has_professional_email: value }))}
                  className={`min-h-[44px] px-4 py-2 rounded-lg border text-sm ${form.has_professional_email === value ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-slate-700 text-slate-300'}`}
                >
                  {value === 'si' ? 'Sí' : 'No'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <label>
          <span className="text-xs text-slate-400">Páginas</span>
          <input
            type="number"
            value={form.quantity_pages}
            onChange={(e) => setForm((f) => ({ ...f, quantity_pages: e.target.value as never }))}
            className="mt-1 w-full min-w-0 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Precio base (USD)</span>
          <input
            type="number"
            step="0.01"
            min={0}
            value={form.base_amount}
            onChange={(e) => setForm((f) => ({ ...f, base_amount: e.target.value }))}
            className="mt-1 w-full min-w-0 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Comentarios del cliente</span>
          <textarea
            value={form.comments}
            onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Notas internas</span>
          <textarea
            value={form.internal_notes}
            onChange={(e) => setForm((f) => ({ ...f, internal_notes: e.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 w-full sm:w-auto items-center justify-center"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={convertToProject}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-600 text-white hover:bg-slate-800 disabled:opacity-50 w-full sm:w-auto"
        >
          <FolderPlus className="w-4 h-4 shrink-0" />
          Añadir a proyectos (pendiente)
        </button>
      </div>
    </div>
  )
}
