'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NuevaCotizacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    client_first_name: '',
    client_last_name: '',
    client_email: '',
    client_phone: '',
    company: '',
    service_label: '',
    quantity_pages: '',
    total_amount: '',
    comments: '',
    internal_notes: '',
    status: 'new',
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
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
        service_label: form.service_label || null,
        quantity_pages: form.quantity_pages ? parseInt(form.quantity_pages, 10) : null,
        total_amount: form.total_amount ? parseFloat(form.total_amount) : null,
        subtotal: form.total_amount ? parseFloat(form.total_amount) : null,
        comments: form.comments || null,
        internal_notes: form.internal_notes || null,
        raw_payload: { manual: true },
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
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Nueva cotización (manual)</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label>
            <span className="text-xs text-slate-400">Nombre</span>
            <input
              required
              value={form.client_first_name}
              onChange={(e) => setForm((f) => ({ ...f, client_first_name: e.target.value }))}
              className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Apellido</span>
            <input
              required
              value={form.client_last_name}
              onChange={(e) => setForm((f) => ({ ...f, client_last_name: e.target.value }))}
              className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
            />
          </label>
        </div>
        <label>
          <span className="text-xs text-slate-400">Correo</span>
          <input
            type="email"
            required
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
        <label>
          <span className="text-xs text-slate-400">Servicio / descripción</span>
          <input
            value={form.service_label}
            onChange={(e) => setForm((f) => ({ ...f, service_label: e.target.value }))}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label>
            <span className="text-xs text-slate-400">Páginas</span>
            <input
              type="number"
              value={form.quantity_pages}
              onChange={(e) => setForm((f) => ({ ...f, quantity_pages: e.target.value }))}
              className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Total USD</span>
            <input
              type="number"
              step="0.01"
              value={form.total_amount}
              onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
              className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
            />
          </label>
        </div>
        <label>
          <span className="text-xs text-slate-400">Comentarios</span>
          <textarea
            value={form.comments}
            onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Notas internas</span>
          <textarea
            value={form.internal_notes}
            onChange={(e) => setForm((f) => ({ ...f, internal_notes: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Guardando…' : 'Crear cotización'}
        </button>
      </form>
    </div>
  )
}
