'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

type Project = {
  id: string
  title: string
  client_name: string
  client_email: string | null
  status: string
  priority: string
  due_date: string | null
  created_at: string
}

const columns: { status: string; label: string }[] = [
  { status: 'pending', label: 'Pendiente' },
  { status: 'in_progress', label: 'En proceso' },
  { status: 'completed', label: 'Completado' },
  { status: 'on_hold', label: 'En pausa' },
  { status: 'cancelled', label: 'Cancelado' },
]

export function ProjectsBoard({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function setStatus(id: string, status: string) {
    setLoading(id)
    const supabase = createClient()
    const updates: Record<string, unknown> = { status }
    if (status === 'completed') updates.completed_at = new Date().toISOString()
    if (status === 'in_progress') updates.started_at = new Date().toISOString()
    await supabase.from('projects').update(updates).eq('id', id)
    setLoading(null)
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar proyecto?')) return
    const supabase = createClient()
    await supabase.from('projects').delete().eq('id', id)
    router.refresh()
  }

  const grouped = columns.map((col) => ({
    ...col,
    items: projects.filter((p) => p.status === col.status),
  }))

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
      {grouped.map((col) => (
        <div key={col.status} className="rounded-xl border border-slate-800 bg-slate-900/40 min-h-[200px]">
          <div className="p-3 border-b border-slate-800 font-medium text-slate-300 text-sm">
            {col.label}{' '}
            <span className="text-slate-500">({col.items.length})</span>
          </div>
          <ul className="p-2 space-y-2">
            {col.items.map((p) => (
              <li
                key={p.id}
                className="rounded-lg bg-slate-800/80 p-3 text-sm border border-slate-700"
              >
                <p className="font-medium text-white">{p.title}</p>
                <p className="text-slate-400 text-xs mt-1">{p.client_name}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {columns
                    .filter((c) => c.status !== p.status)
                    .map((c) => (
                      <button
                        key={c.status}
                        type="button"
                        disabled={loading === p.id}
                        onClick={() => setStatus(p.id, c.status)}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-700 hover:bg-indigo-600 text-slate-300"
                      >
                        → {c.label}
                      </button>
                    ))}
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="text-red-400 p-1 ml-auto"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
