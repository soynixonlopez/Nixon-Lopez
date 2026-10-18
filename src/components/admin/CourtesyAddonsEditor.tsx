'use client'

import { ALL_WEB_PLAN_IDS, type CourtesyAddonDefinition } from '@/lib/courtesy-addons'
import { getCatalogPlan } from '@/lib/service-catalog'

const fieldClass =
  'w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

export function CourtesyAddonsEditor({
  items,
  onChange,
}: {
  items: CourtesyAddonDefinition[]
  onChange: (next: CourtesyAddonDefinition[]) => void
}) {
  function patch(index: number, patchValue: Partial<CourtesyAddonDefinition>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patchValue } : item)))
  }

  function togglePlan(index: number, planId: (typeof ALL_WEB_PLAN_IDS)[number]) {
    const item = items[index]
    const has = item.webPlanIds.includes(planId)
    patch(index, {
      webPlanIds: has ? item.webPlanIds.filter((id) => id !== planId) : [...item.webPlanIds, planId],
    })
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <article
          key={item.id}
          className={`rounded-xl border p-4 ${item.enabled ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50 opacity-80'}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-slate-900">{item.name}</p>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(event) => patch(index, { enabled: event.target.checked })}
              />
              Activo
            </label>
          </div>
          <p className="mt-1 text-xs text-slate-500">ID: {item.id} · Categoría: {item.category}</p>
          <label className="mt-3 block text-xs font-medium text-slate-600">
            Nombre visible
            <input
              className={`${fieldClass} mt-1`}
              value={item.name}
              onChange={(event) => patch(index, { name: event.target.value })}
            />
          </label>
          <label className="mt-2 block text-xs font-medium text-slate-600">
            Descripción
            <textarea
              className={`${fieldClass} mt-1`}
              rows={2}
              value={item.description}
              onChange={(event) => patch(index, { description: event.target.value })}
            />
          </label>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Paquetes web</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ALL_WEB_PLAN_IDS.map((planId) => {
              const plan = getCatalogPlan(planId)
              const active = item.webPlanIds.includes(planId)
              return (
                <button
                  key={planId}
                  type="button"
                  onClick={() => togglePlan(index, planId)}
                  className={`rounded-lg border px-2 py-1 text-xs font-medium ${
                    active
                      ? 'border-emerald-400 bg-white text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  {plan?.label ?? planId}
                </button>
              )
            })}
          </div>
        </article>
      ))}
    </div>
  )
}
