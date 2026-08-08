'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText } from 'lucide-react'

export type ContractProject = {
  id: string
  title: string
  description: string | null
  client_name: string
  client_email: string | null
  status: string
  created_at: string
  quote_id: string | null
  contract_id: string | null
  contract_number: string | null
  service_label: string | null
}

const FLOW = [
  { status: 'pending', label: 'Iniciado' },
  { status: 'in_progress', label: 'Desarrollo' },
  { status: 'completed', label: 'Terminado' },
] as const

function normalizeStatus(status: string) {
  if (status === 'in_progress') return 'in_progress'
  if (status === 'completed') return 'completed'
  return 'pending'
}

export function ProjectsBoard({ projects }: { projects: ContractProject[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.client_name.toLowerCase().includes(q) ||
        (p.service_label ?? '').toLowerCase().includes(q) ||
        (p.contract_number ?? '').toLowerCase().includes(q)
      const current = normalizeStatus(p.status)
      const matchesStatus = statusFilter === 'all' || current === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [projects, query, statusFilter])

  const counts = {
    pending: projects.filter((p) => normalizeStatus(p.status) === 'pending').length,
    in_progress: projects.filter((p) => normalizeStatus(p.status) === 'in_progress').length,
    completed: projects.filter((p) => normalizeStatus(p.status) === 'completed').length,
  }

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {FLOW.map((item) => (
          <div
            key={item.status}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{counts[item.status]}</p>
          </div>
        ))}
      </div>

      <div className="grid min-w-0 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por cliente, contrato o servicio…"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
        >
          <option value="all">Todos</option>
          {FLOW.map((s) => (
            <option key={s.status} value={s.status}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            No hay proyectos con contrato de trabajo.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Crea un contrato desde Cotizaciones → Contratos y el proyecto aparecerá aquí.
          </p>
          <Link
            href="/admin/contratos"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            <FileText className="h-4 w-4" />
            Ir a contratos
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((project) => {
            const current = normalizeStatus(project.status)
            const busy = loadingId === project.id
            return (
              <li
                key={project.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-slate-900">{project.title}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{project.client_name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {project.service_label || project.description || 'Servicio'}
                      {project.contract_number ? ` · ${project.contract_number}` : ''}
                    </p>
                    {project.contract_id ? (
                      <Link
                        href={`/admin/contratos/${project.contract_id}`}
                        className="mt-2 inline-block text-xs font-semibold text-brand hover:underline"
                      >
                        Ver contrato
                      </Link>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {FLOW.map((item) => {
                      const active = current === item.status
                      return (
                        <button
                          key={item.status}
                          type="button"
                          disabled={busy || active}
                          onClick={() => setStatus(project.id, item.status)}
                          className={`min-h-[40px] rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                            active
                              ? item.status === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : item.status === 'in_progress'
                                  ? 'bg-brand text-white'
                                  : 'bg-slate-800 text-white'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          } disabled:opacity-60`}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
