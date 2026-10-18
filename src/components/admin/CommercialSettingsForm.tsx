'use client'

import { useState } from 'react'
import type { CommercialOfferSettings } from '@/lib/commercial-settings'
import { adBudgetRecommendationCopy } from '@/lib/commercial-settings'
import { MARKETING_STORIES_PER_WEEK } from '@/lib/service-catalog'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

export function CommercialSettingsForm({ initial }: { initial: CommercialOfferSettings }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function patch<K extends keyof CommercialOfferSettings>(key: K, value: CommercialOfferSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    const response = await fetch('/api/admin/commercial-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const body = await response.json().catch(() => null)
    setSaving(false)
    if (!response.ok) {
      setError(body?.error || 'No se pudo guardar.')
      return
    }
    setMessage('Configuración guardada. Las cotizaciones nuevas usarán estos valores. Las ya aceptadas conservan su copia.')
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Historias en planes de redes</h2>
        <p className="mt-1 text-sm text-slate-500">
          Todos los planes incluyen {MARKETING_STORIES_PER_WEEK} historias por semana. Puedes ajustar la frecuencia
          por defecto solo para cotizaciones personalizadas creadas en admin (el cotizador público no pregunta por historias).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Historias por semana (predeterminado admin)
            <input
              className={`${fieldClass} mt-1`}
              type="number"
              min={1}
              max={21}
              value={form.storiesQuantity ?? MARKETING_STORIES_PER_WEEK}
              onChange={(event) =>
                patch('storiesQuantity', event.target.value === '' ? null : Number(event.target.value))
              }
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Plataformas (texto informativo)
            <input
              className={`${fieldClass} mt-1`}
              value={form.storiesPlatform}
              onChange={(event) => patch('storiesPlatform', event.target.value)}
            />
          </label>
          <label className="col-span-full block text-sm font-medium text-slate-700">
            Alcance de las historias
            <input
              className={`${fieldClass} mt-1`}
              value={form.storiesContentType}
              onChange={(event) => patch('storiesContentType', event.target.value)}
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.storiesIncludesDesign}
              onChange={(event) => patch('storiesIncludesDesign', event.target.checked)}
            />
            Incluye diseño
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.storiesIncludesCopy}
              onChange={(event) => patch('storiesIncludesCopy', event.target.checked)}
            />
            Incluye texto
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.storiesIncludesScheduling}
              onChange={(event) => patch('storiesIncludesScheduling', event.target.checked)}
            />
            Incluye programación
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Presupuesto publicitario recomendado</h2>
        <p className="mt-1 text-sm text-slate-500">
          Importe orientativo editable. No se autoriza hasta que el cliente lo apruebe en la cotización.
        </p>
        <label className="mt-4 block max-w-xs text-sm font-medium text-slate-700">
          USD / mes recomendados
          <input
            className={`${fieldClass} mt-1`}
            type="number"
            min={0}
            step={1}
            value={form.recommendedAdBudgetUsd}
            onChange={(event) => patch('recommendedAdBudgetUsd', Number(event.target.value) || 150)}
          />
        </label>
        <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
          {adBudgetRecommendationCopy(form.recommendedAdBudgetUsd)}
        </p>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? 'Guardando…' : 'Guardar configuración'}
      </button>
    </form>
  )
}
