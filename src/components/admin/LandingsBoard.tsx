'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import type { LandingPageRow } from '@/lib/landing-pages'
import { createClient } from '@/lib/supabase/client'

export function LandingsBoard({ landings }: { landings: LandingPageRow[] }) {
  const router = useRouter()

  async function remove(id: string, title: string) {
    if (!confirm(`¿Eliminar la landing “${title}”?`)) return
    const supabase = createClient()
    const { error } = await supabase.from('landing_pages').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    router.refresh()
  }

  if (landings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center">
        <p className="font-medium text-slate-800">Aún no hay landings</p>
        <p className="mt-1 text-sm text-slate-500">
          Crea la primera y configura contenido + método de pago.
        </p>
        <Link
          href="/admin/landings/nueva"
          className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Crear landing
        </Link>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {landings.map((landing) => (
        <li
          key={landing.id}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-base font-bold text-slate-900">{landing.title}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  landing.is_published
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {landing.is_published ? 'Publicada' : 'Borrador'}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              /l/{landing.slug} · ${Number(landing.price_amount).toFixed(2)} USD
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {landing.is_published ? (
              <Link
                href={`/l/${landing.slug}`}
                target="_blank"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
              >
                <ExternalLink className="h-4 w-4" />
                Ver
              </Link>
            ) : null}
            <Link
              href={`/admin/landings/${landing.id}`}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
            <button
              type="button"
              onClick={() => remove(landing.id, landing.title)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
