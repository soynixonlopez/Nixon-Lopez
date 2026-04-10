'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Pencil, Save, Trash2, XCircle } from 'lucide-react'

type Project = {
  id: string
  title: string
  description: string | null
  client_name: string
  client_email: string | null
  status: string
  priority: string
  due_date: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
}

const statuses: { status: string; label: string }[] = [
  { status: 'pending', label: 'Pendiente' },
  { status: 'in_progress', label: 'En proceso' },
  { status: 'completed', label: 'Completado' },
  { status: 'on_hold', label: 'En pausa' },
  { status: 'cancelled', label: 'Cancelado' },
]

export function ProjectsBoard({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<{
    title: string
    description: string
    started_at: string
    due_date: string
    status: string
  }>({
    title: '',
    description: '',
    started_at: '',
    due_date: '',
    status: 'pending',
  })

  function toDateInput(value: string | null) {
    if (!value) return ''
    return value.slice(0, 10)
  }

  function startEdit(p: Project) {
    setEditingId(p.id)
    setDraft({
      title: p.title,
      description: p.description ?? '',
      started_at: toDateInput(p.started_at),
      due_date: p.due_date ?? '',
      status: p.status,
    })
  }

  function isFinalized(status: string) {
    return status === 'completed'
  }

  async function setStatus(id: string, status: string) {
    setLoadingId(id)
    const supabase = createClient()
    const updates: Record<string, unknown> = { status }
    if (status === 'completed') updates.completed_at = new Date().toISOString()
    if (status === 'in_progress') updates.started_at = new Date().toISOString()
    if (status !== 'completed') updates.completed_at = null
    await supabase.from('projects').update(updates).eq('id', id)
    setLoadingId(null)
    router.refresh()
  }

  async function saveEdit(id: string) {
    setLoadingId(id)
    const supabase = createClient()
    const nextStatus = draft.status
    const updates: Record<string, unknown> = {
      title: draft.title.trim() || 'Proyecto sin nombre',
      description: draft.description.trim() || null,
      due_date: draft.due_date || null,
      started_at: draft.started_at ? new Date(`${draft.started_at}T00:00:00.000Z`).toISOString() : null,
      status: nextStatus,
      completed_at: isFinalized(nextStatus) ? new Date().toISOString() : null,
    }
    const { error } = await supabase.from('projects').update(updates).eq('id', id)
    setLoadingId(null)
    if (error) {
      alert(error.message)
      return
    }
    setEditingId(null)
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar proyecto?')) return
    const supabase = createClient()
    await supabase.from('projects').delete().eq('id', id)
    router.refresh()
  }

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.client_name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [projects, query, statusFilter])

  const finalizedCount = filtered.filter((p) => p.status === 'completed').length

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 min-w-0">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] min-w-0">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por proyecto, cliente o servicio..."
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
          >
            <option value="all">Todos los estados</option>
            {statuses.map((s) => (
              <option key={s.status} value={s.status}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300 text-center">
            Finalizados: {finalizedCount}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const isEditing = editingId === p.id
          return (
            <article
              key={p.id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 min-w-0 overflow-hidden"
            >
              <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_180px_180px_180px_auto] lg:items-end min-w-0">
                <label className="block">
                  <span className="text-[11px] text-slate-500">Nombre del proyecto</span>
                  {isEditing ? (
                    <input
                      value={draft.title}
                      onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                      className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-white font-medium">{p.title}</p>
                  )}
                </label>
                <label className="block">
                  <span className="text-[11px] text-slate-500">Servicio</span>
                  {isEditing ? (
                    <input
                      value={draft.description}
                      onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                      className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-slate-300 text-sm">{p.description || 'Por definir'}</p>
                  )}
                </label>
                <label className="block">
                  <span className="text-[11px] text-slate-500">Fecha inicio</span>
                  {isEditing ? (
                    <input
                      type="date"
                      value={draft.started_at}
                      onChange={(e) => setDraft((d) => ({ ...d, started_at: e.target.value }))}
                      className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-slate-300 text-sm">{toDateInput(p.started_at) || 'Por colocar'}</p>
                  )}
                </label>
                <label className="block">
                  <span className="text-[11px] text-slate-500">Fecha entrega</span>
                  {isEditing ? (
                    <input
                      type="date"
                      value={draft.due_date}
                      onChange={(e) => setDraft((d) => ({ ...d, due_date: e.target.value }))}
                      className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-slate-300 text-sm">{p.due_date || 'Por colocar'}</p>
                  )}
                </label>
                <label className="block">
                  <span className="text-[11px] text-slate-500">Estado</span>
                  {isEditing ? (
                    <select
                      value={draft.status}
                      onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                      className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
                    >
                      {statuses.map((s) => (
                        <option key={s.status} value={s.status}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      {p.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-500" />
                      )}
                      <span className="text-slate-300">
                        {statuses.find((s) => s.status === p.status)?.label ?? p.status}
                      </span>
                    </div>
                  )}
                </label>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => saveEdit(p.id)}
                        disabled={loadingId === p.id}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/admin/proyectos/${p.id}`}
                        className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs"
                      >
                        Ver proyecto
                      </Link>
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      {p.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => setStatus(p.id, 'completed')}
                          disabled={loadingId === p.id}
                          className="px-3 py-2 rounded-lg border border-emerald-500/40 text-emerald-300 text-xs"
                        >
                          Finalizar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-red-900/60 text-red-300 text-xs"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Cliente: {p.client_name} {p.client_email ? `· ${p.client_email}` : ''}
              </p>
            </article>
          )
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
            No hay proyectos que coincidan con el filtro aplicado.
          </div>
        )}
      </div>
    </div>
  )
}
