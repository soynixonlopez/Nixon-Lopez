'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Save, Trash2, X } from 'lucide-react'

type Task = {
  id: string
  project_id: string
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  due_date: string | null
  sort_order: number
}

const COLUMNS: { id: Task['status']; label: string }[] = [
  { id: 'pending', label: 'Pendiente' },
  { id: 'in_progress', label: 'En proceso' },
  { id: 'completed', label: 'Finalizado' },
]

export function ProjectScrumBoard({
  projectId,
  initialTasks,
}: {
  projectId: string
  initialTasks: Task[]
}) {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Task['status']>('all')
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({
    title: '',
    description: '',
    status: 'pending' as Task['status'],
    priority: 'normal' as Task['priority'],
    due_date: '',
  })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tasks.filter((t) => {
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [tasks, query, statusFilter])

  function beginEdit(t: Task) {
    setEditingId(t.id)
    setEditDraft({
      title: t.title,
      description: t.description ?? '',
      status: t.status,
      priority: t.priority,
      due_date: t.due_date ?? '',
    })
  }

  async function createTask() {
    if (!newTitle.trim()) return
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('project_tasks')
      .insert({
        project_id: projectId,
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        status: 'pending',
        priority: 'normal',
        due_date: newDueDate || null,
        sort_order: tasks.length + 1,
      })
      .select('id, project_id, title, description, status, priority, due_date, sort_order')
      .single()
    setLoading(false)
    if (error || !data) {
      alert(error?.message ?? 'No se pudo crear la tarea')
      return
    }
    setTasks((prev) => [...prev, data as Task])
    setNewTitle('')
    setNewDescription('')
    setNewDueDate('')
  }

  async function updateTask(id: string, patch: Partial<Task>) {
    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    const supabase = createClient()
    const { error } = await supabase.from('project_tasks').update(patch).eq('id', id)
    if (error) {
      setTasks(previous)
      alert(error.message)
      return
    }
    router.refresh()
  }

  async function saveEdit(id: string) {
    setLoading(true)
    const patch: Partial<Task> = {
      title: editDraft.title.trim() || 'Tarea',
      description: editDraft.description.trim() || null,
      status: editDraft.status,
      priority: editDraft.priority,
      due_date: editDraft.due_date || null,
    }
    await updateTask(id, patch)
    setLoading(false)
    setEditingId(null)
  }

  async function removeTask(id: string) {
    if (!confirm('¿Eliminar tarea?')) return
    const previous = tasks
    setTasks((prev) => prev.filter((t) => t.id !== id))
    const supabase = createClient()
    const { error } = await supabase.from('project_tasks').delete().eq('id', id)
    if (error) {
      setTasks(previous)
      alert(error.message)
      return
    }
    router.refresh()
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
        <h2 className="text-lg font-semibold text-white">Agregar tarea</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Título de la tarea"
            className="md:col-span-2 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
          />
          <button
            type="button"
            onClick={createTask}
            disabled={loading || !newTitle.trim()}
            className="rounded-xl bg-indigo-600 text-white text-sm font-medium px-3 py-2 disabled:opacity-50"
          >
            Crear tarea
          </button>
        </div>
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          rows={2}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 grid gap-3 md:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar tareas..."
          className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | Task['status'])}
          className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
        >
          <option value="all">Todos los estados</option>
          {COLUMNS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnTasks = filtered
            .filter((t) => t.status === column.id)
            .sort((a, b) => a.sort_order - b.sort_order)
          return (
            <div key={column.id} className="rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="px-3 py-2 border-b border-slate-800 text-sm font-medium text-slate-300">
                {column.label} ({columnTasks.length})
              </div>
              <div className="p-3 space-y-3">
                {columnTasks.map((t) => {
                  const isEditing = editingId === t.id
                  return (
                    <article key={t.id} className="rounded-lg border border-slate-700 bg-slate-800/70 p-3 space-y-2">
                      {isEditing ? (
                        <>
                          <input
                            value={editDraft.title}
                            onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-white text-sm"
                          />
                          <textarea
                            value={editDraft.description}
                            onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                            rows={2}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-white text-sm"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={editDraft.status}
                              onChange={(e) => setEditDraft((d) => ({ ...d, status: e.target.value as Task['status'] }))}
                              className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-white text-xs"
                            >
                              {COLUMNS.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                            <select
                              value={editDraft.priority}
                              onChange={(e) => setEditDraft((d) => ({ ...d, priority: e.target.value as Task['priority'] }))}
                              className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-white text-xs"
                            >
                              <option value="low">Baja</option>
                              <option value="normal">Normal</option>
                              <option value="high">Alta</option>
                              <option value="urgent">Urgente</option>
                            </select>
                          </div>
                          <input
                            type="date"
                            value={editDraft.due_date}
                            onChange={(e) => setEditDraft((d) => ({ ...d, due_date: e.target.value }))}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-white text-xs"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => saveEdit(t.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 text-white text-xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-600 text-slate-200 text-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                              Cancelar
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-white font-medium text-sm">{t.title}</p>
                          {t.description && <p className="text-slate-300 text-xs">{t.description}</p>}
                          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                              Prioridad: {t.priority}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                              Entrega: {t.due_date || 'Por colocar'}
                            </span>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => beginEdit(t)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-600 text-slate-200 text-xs"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => removeTask(t.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-red-900/60 text-red-300 text-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </article>
                  )
                })}
                {columnTasks.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6">
                    Sin tareas en esta columna.
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
