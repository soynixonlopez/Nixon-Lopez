'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FolderPlus } from 'lucide-react'

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
}

const statuses = [
  'new',
  'reviewing',
  'accepted',
  'rejected',
  'converted_to_project',
  'archived',
] as const

export function QuoteEditorClient({ quote }: { quote: Quote }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    status: quote.status,
    client_first_name: quote.client_first_name,
    client_last_name: quote.client_last_name,
    client_email: quote.client_email,
    client_phone: quote.client_phone ?? '',
    company: quote.company ?? '',
    service_label: quote.service_label ?? '',
    quantity_pages: quote.quantity_pages ?? '',
    total_amount: quote.total_amount ?? '',
    internal_notes: quote.internal_notes ?? '',
    comments: quote.comments ?? '',
  })

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('quotes')
      .update({
        status: form.status,
        client_first_name: form.client_first_name,
        client_last_name: form.client_last_name,
        client_email: form.client_email,
        client_phone: form.client_phone || null,
        company: form.company || null,
        service_label: form.service_label || null,
        quantity_pages: form.quantity_pages === '' ? null : Number(form.quantity_pages),
        total_amount: form.total_amount === '' ? null : Number(form.total_amount),
        internal_notes: form.internal_notes || null,
        comments: form.comments || null,
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
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Editar cotización</h1>

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
          <span className="text-xs text-slate-400">Servicio</span>
          <input
            value={form.service_label}
            onChange={(e) => setForm((f) => ({ ...f, service_label: e.target.value }))}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Páginas</span>
          <input
            type="number"
            value={form.quantity_pages}
            onChange={(e) => setForm((f) => ({ ...f, quantity_pages: e.target.value as never }))}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Total (USD)</span>
          <input
            type="number"
            step="0.01"
            value={form.total_amount}
            onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value as never }))}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
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

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={convertToProject}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-600 text-white hover:bg-slate-800 disabled:opacity-50"
        >
          <FolderPlus className="w-4 h-4" />
          Añadir a proyectos (pendiente)
        </button>
      </div>
    </div>
  )
}
