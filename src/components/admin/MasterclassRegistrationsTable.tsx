'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, MessageCircle, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  MASTERCLASS_REGISTRATION_STATUSES,
  type MasterclassRegistrationStatus,
} from '@/lib/masterclass'

export type MasterclassRegistrationRow = {
  id: string
  created_at: string
  full_name: string
  email: string
  whatsapp: string
  event_slug: string
  event_name: string | null
  status: MasterclassRegistrationStatus
  internal_notes: string | null
}

function whatsappHref(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}`
}

function exportCsv(rows: MasterclassRegistrationRow[]) {
  const header = ['Fecha', 'Nombre', 'Email', 'WhatsApp', 'Evento', 'Estado', 'Notas']
  const lines = rows.map((r) => [
    new Date(r.created_at).toLocaleString('es'),
    r.full_name,
    r.email,
    r.whatsapp,
    r.event_name ?? r.event_slug,
    MASTERCLASS_REGISTRATION_STATUSES[r.status],
    r.internal_notes ?? '',
  ])
  const csv = [header, ...lines]
    .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `masterclass-registros-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function MasterclassRegistrationsTable({
  registrations,
  eventSlugs,
}: {
  registrations: MasterclassRegistrationRow[]
  eventSlugs: string[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [eventFilter, setEventFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return registrations.filter((r) => {
      if (eventFilter !== 'all' && r.event_slug !== eventFilter) return false
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (!q) return true
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.whatsapp.toLowerCase().includes(q)
      )
    })
  }, [registrations, query, eventFilter, statusFilter])

  async function setStatus(id: string, status: MasterclassRegistrationStatus) {
    const supabase = createClient()
    await supabase
      .from('masterclass_registrations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    router.refresh()
  }

  async function saveNotes(id: string, notes: string) {
    const supabase = createClient()
    await supabase
      .from('masterclass_registrations')
      .update({ internal_notes: notes || null, updated_at: new Date().toISOString() })
      .eq('id', id)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nombre, email o WhatsApp…"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-white"
        >
          <option value="all">Todos los eventos</option>
          {eventSlugs.map((slug) => (
            <option key={slug} value={slug}>
              {slug}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-white"
        >
          <option value="all">Todos los estados</option>
          {(Object.keys(MASTERCLASS_REGISTRATION_STATUSES) as MasterclassRegistrationStatus[]).map(
            (k) => (
              <option key={k} value={k}>
                {MASTERCLASS_REGISTRATION_STATUSES[k]}
              </option>
            ),
          )}
        </select>
        <button
          type="button"
          onClick={() => exportCsv(filtered)}
          disabled={!filtered.length}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-40"
        >
          <Download className="h-4 w-4" aria-hidden />
          Exportar CSV ({filtered.length})
        </button>
      </div>

      {!filtered.length ? (
        <p className="text-slate-400">
          {registrations.length ? 'Ningún registro coincide con los filtros.' : 'No hay registros aún.'}
        </p>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {filtered.map((r) => (
              <RegistrationCard
                key={r.id}
                row={r}
                onStatus={setStatus}
                onNotes={saveNotes}
              />
            ))}
          </div>
          <div className="hidden md:block admin-table-scroll overflow-x-auto rounded-xl border border-slate-800/90 bg-slate-950/20">
            <table className="w-full min-w-[880px] text-sm text-left">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Participante</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Evento</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                      {new Date(r.created_at).toLocaleString('es')}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {r.full_name}
                      <div className="text-xs text-slate-500">{r.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <WhatsAppCell whatsapp={r.whatsapp} />
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-[180px] truncate text-xs">
                      {r.event_name ?? r.event_slug}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          setStatus(r.id, e.target.value as MasterclassRegistrationStatus)
                        }
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs max-w-[140px]"
                      >
                        {(Object.keys(MASTERCLASS_REGISTRATION_STATUSES) as MasterclassRegistrationStatus[]).map(
                          (k) => (
                            <option key={k} value={k}>
                              {MASTERCLASS_REGISTRATION_STATUSES[k]}
                            </option>
                          ),
                        )}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <NotesInput id={r.id} initial={r.internal_notes ?? ''} onSave={saveNotes} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function WhatsAppCell({ whatsapp }: { whatsapp: string }) {
  const href = whatsappHref(whatsapp)
  if (!href) return <span className="text-slate-400">{whatsapp}</span>
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline"
    >
      <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {whatsapp}
    </a>
  )
}

function NotesInput({
  id,
  initial,
  onSave,
}: {
  id: string
  initial: string
  onSave: (id: string, notes: string) => void
}) {
  const [value, setValue] = useState(initial)
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value !== initial) onSave(id, value)
      }}
      placeholder="Nota interna…"
      className="w-full min-w-[120px] max-w-[200px] rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white placeholder:text-slate-500"
    />
  )
}

function RegistrationCard({
  row,
  onStatus,
  onNotes,
}: {
  row: MasterclassRegistrationRow
  onStatus: (id: string, status: MasterclassRegistrationStatus) => void
  onNotes: (id: string, notes: string) => void
}) {
  return (
    <article className="rounded-xl border border-slate-800/90 bg-slate-950/40 p-4 space-y-3">
      <div>
        <p className="font-medium text-white">{row.full_name}</p>
        <p className="text-xs text-slate-500 break-all">{row.email}</p>
        <p className="text-xs text-slate-500 mt-1">{new Date(row.created_at).toLocaleString('es')}</p>
      </div>
      <WhatsAppCell whatsapp={row.whatsapp} />
      <select
        value={row.status}
        onChange={(e) => onStatus(row.id, e.target.value as MasterclassRegistrationStatus)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs"
      >
        {(Object.keys(MASTERCLASS_REGISTRATION_STATUSES) as MasterclassRegistrationStatus[]).map(
          (k) => (
            <option key={k} value={k}>
              {MASTERCLASS_REGISTRATION_STATUSES[k]}
            </option>
          ),
        )}
      </select>
      <NotesInput id={row.id} initial={row.internal_notes ?? ''} onSave={onNotes} />
    </article>
  )
}
