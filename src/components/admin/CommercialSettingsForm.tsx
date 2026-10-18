'use client'

import { useState } from 'react'
import type { CommercialOfferSettings } from '@/lib/commercial-settings'
import { adBudgetRecommendationCopy } from '@/lib/commercial-settings'

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
        <h2 className="text-lg font-bold text-slate-900">Historias (extra mensual)</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ningún plan base incluye historias. Si el precio queda vacío, el cotizador no permite añadir este extra.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Precio adicional mensual (USD)
            <input
              className={`${fieldClass} mt-1`}
              type="number"
              min={0}
              step="0.01"
              value={form.storiesPriceUsd ?? ''}
              placeholder="Sin definir"
              onChange={(event) =>
                patch('storiesPriceUsd', event.target.value === '' ? null : Number(event.target.value))
              }
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Cantidad de historias al mes
            <input
              className={`${fieldClass} mt-1`}
              type="number"
              min={1}
              value={form.storiesQuantity ?? ''}
              placeholder="Sin definir"
              onChange={(event) =>
                patch('storiesQuantity', event.target.value === '' ? null : Number(event.target.value))
              }
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Plataforma
            <input
              className={`${fieldClass} mt-1`}
              value={form.storiesPlatform}
              onChange={(event) => patch('storiesPlatform', event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Tipo de contenido
            <input
              className={`${fieldClass} mt-1`}
              value={form.storiesContentType}
              onChange={(event) => patch('storiesContentType', event.target.value)}
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.storiesIncludesDesign}
              onChange={(event) => patch('storiesIncludesDesign', event.target.checked)}
            />
            Diseño incluido
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.storiesIncludesCopy}
              onChange={(event) => patch('storiesIncludesCopy', event.target.checked)}
            />
            Texto incluido
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.storiesIncludesScheduling}
              onChange={(event) => patch('storiesIncludesScheduling', event.target.checked)}
            />
            Programación incluida
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Presupuesto publicitario recomendado</h2>
        <p className="mt-1 text-sm text-slate-500">
          Es una inversión del cliente en Meta Ads. No es un honorario del proveedor y no se activa sin aprobación.
        </p>
        <label className="mt-4 block max-w-xs text-sm font-medium text-slate-700">
          Importe recomendado (USD / mes)
          <input
            className={`${fieldClass} mt-1`}
            type="number"
            min={1}
            step="0.01"
            value={form.recommendedAdBudgetUsd}
            onChange={(event) => patch('recommendedAdBudgetUsd', Number(event.target.value))}
          />
        </label>
        <p className="mt-4 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          {adBudgetRecommendationCopy(form.recommendedAdBudgetUsd)}
        </p>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? 'Guardando…' : 'Guardar configuración'}
      </button>
    </form>
  )
}
