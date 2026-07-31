'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Download,
  Mail,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import {
  MASTERCLASS_REGISTRATION_STATUSES,
  type MasterclassEventConfig,
  type MasterclassRegistrationStatus,
} from '@/lib/masterclass'
import { adminUi } from '@/lib/admin-ui'

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
  events,
}: {
  registrations: MasterclassRegistrationRow[]
  eventSlugs: string[]
  events: MasterclassEventConfig[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [eventFilter, setEventFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [editRow, setEditRow] = useState<MasterclassRegistrationRow | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showReminders, setShowReminders] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

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

  const reminderTargets = useMemo(
    () => filtered.filter((r) => r.status !== 'cancelled'),
    [filtered],
  )

  const selectedRows = filtered.filter((r) => selected.has(r.id))
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((r) => selected.has(r.id))

  function toggleAll() {
    if (allFilteredSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((r) => r.id)))
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function setStatus(id: string, status: MasterclassRegistrationStatus) {
    const res = await fetch(`/api/admin/masterclass/registrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setFeedback({ type: 'err', text: data.error ?? 'No se pudo actualizar el estado.' })
      return
    }
    router.refresh()
  }

  async function saveNotes(id: string, notes: string) {
    const res = await fetch(`/api/admin/masterclass/registrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internal_notes: notes }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setFeedback({ type: 'err', text: data.error ?? 'No se pudieron guardar las notas.' })
      return
    }
    router.refresh()
  }

  async function deleteRegistration(id: string) {
    setBusy(true)
    const res = await fetch(`/api/admin/masterclass/registrations/${id}`, { method: 'DELETE' })
    setBusy(false)
    setDeleteId(null)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setFeedback({ type: 'err', text: data.error ?? 'No se pudo eliminar.' })
      return
    }
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setFeedback({ type: 'ok', text: 'Registro eliminado.' })
    router.refresh()
  }

  async function sendReminders(ids: string[], customMessage: string) {
    setBusy(true)
    const res = await fetch('/api/admin/masterclass/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration_ids: ids, custom_message: customMessage }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    setShowReminders(false)
    if (!res.ok) {
      setFeedback({ type: 'err', text: data.error ?? 'No se pudieron enviar los recordatorios.' })
      return
    }
    setFeedback({
      type: 'ok',
      text: `Recordatorios enviados: ${data.sent ?? 0}${data.failed ? ` · Fallidos: ${data.failed}` : ''}.`,
    })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <p
          className={`rounded-xl border px-3 py-2 text-sm ${
            feedback.type === 'ok' ?
              'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {feedback.text}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nombre, email o WhatsApp…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none shadow-sm focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm"
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
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm"
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
        <button type="button" onClick={() => setShowAdd(true)} className={adminUi.btnPrimary}>
          <Plus className="h-4 w-4" aria-hidden />
          Agregar registro
        </button>
        <button
          type="button"
          disabled={!reminderTargets.length || busy}
          onClick={() => setShowReminders(true)}
          className={adminUi.btnSecondary}
        >
          <Mail className="h-4 w-4" aria-hidden />
          Recordatorio (
          {selectedRows.filter((r) => r.status !== 'cancelled').length ||
            reminderTargets.length}
          )
        </button>
        <button
          type="button"
          onClick={() => exportCsv(filtered)}
          disabled={!filtered.length}
          className={adminUi.btnSecondary}
        >
          <Download className="h-4 w-4" aria-hidden />
          CSV ({filtered.length})
        </button>
      </div>

      {!filtered.length ? (
        <p className="text-slate-500">
          {registrations.length ? 'Ningún registro coincide con los filtros.' : 'No hay registros aún.'}
        </p>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {filtered.map((r) => (
              <RegistrationCard
                key={r.id}
                row={r}
                selected={selected.has(r.id)}
                onToggle={() => toggleOne(r.id)}
                onStatus={setStatus}
                onNotes={saveNotes}
                onEdit={() => setEditRow(r)}
                onDelete={() => setDeleteId(r.id)}
              />
            ))}
          </div>
          <div className="hidden md:block admin-table-scroll overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[980px] text-sm text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleAll}
                      aria-label="Seleccionar todos"
                    />
                  </th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Participante</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Evento</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Notas</th>
                  <th className="px-4 py-3 w-24">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={() => toggleOne(r.id)}
                        aria-label={`Seleccionar ${r.full_name}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                      {new Date(r.created_at).toLocaleString('es')}
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {r.full_name}
                      <div className="text-xs text-slate-500">{r.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <WhatsAppCell whatsapp={r.whatsapp} />
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate text-xs">
                      {r.event_name ?? r.event_slug}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          setStatus(r.id, e.target.value as MasterclassRegistrationStatus)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 shadow-sm max-w-[140px]"
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditRow(r)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand"
                          aria-label={`Editar ${r.full_name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(r.id)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Eliminar ${r.full_name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editRow && (
        <EditRegistrationModal
          row={editRow}
          busy={busy}
          onClose={() => setEditRow(null)}
          onSaved={() => {
            setEditRow(null)
            setFeedback({ type: 'ok', text: 'Registro actualizado.' })
            router.refresh()
          }}
          onError={(text) => setFeedback({ type: 'err', text })}
        />
      )}

      {showAdd && (
        <AddRegistrationModal
          events={events}
          eventSlugs={eventSlugs}
          busy={busy}
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false)
            setFeedback({ type: 'ok', text: 'Registro agregado.' })
            router.refresh()
          }}
          onError={(text) => setFeedback({ type: 'err', text })}
        />
      )}

      {showReminders && (
        <ReminderModal
          count={
            selectedRows.filter((r) => r.status !== 'cancelled').length ||
            reminderTargets.length
          }
          busy={busy}
          onClose={() => setShowReminders(false)}
          onSend={(message) => {
            const ids =
              selectedRows.filter((r) => r.status !== 'cancelled').length ?
                selectedRows.filter((r) => r.status !== 'cancelled').map((r) => r.id)
              : reminderTargets.map((r) => r.id)
            sendReminders(ids, message)
          }}
        />
      )}

      {deleteId && (
        <ConfirmDeleteModal
          busy={busy}
          onClose={() => setDeleteId(null)}
          onConfirm={() => deleteRegistration(deleteId)}
        />
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
      className="inline-flex items-center gap-1.5 text-emerald-600 hover:underline"
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
      className="w-full min-w-[120px] max-w-[200px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 shadow-sm"
    />
  )
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className={`${adminUi.modal} relative max-h-[90vh] overflow-y-auto`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function EditRegistrationModal({
  row,
  busy,
  onClose,
  onSaved,
  onError,
}: {
  row: MasterclassRegistrationRow
  busy: boolean
  onClose: () => void
  onSaved: () => void
  onError: (text: string) => void
}) {
  const [fullName, setFullName] = useState(row.full_name)
  const [email, setEmail] = useState(row.email)
  const [whatsapp, setWhatsapp] = useState(row.whatsapp)
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/admin/masterclass/registrations/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, whatsapp }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      onError(data.error ?? 'No se pudo guardar.')
      return
    }
    onSaved()
  }

  return (
    <ModalShell title="Editar participante" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nombre" value={fullName} onChange={setFullName} required />
        <Field label="Correo" type="email" value={email} onChange={setEmail} required />
        <Field label="WhatsApp" value={whatsapp} onChange={setWhatsapp} required />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={adminUi.btnSecondary}>
            Cancelar
          </button>
          <button type="submit" disabled={saving || busy} className={adminUi.btnPrimary}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function AddRegistrationModal({
  events,
  eventSlugs,
  busy,
  onClose,
  onCreated,
  onError,
}: {
  events: MasterclassEventConfig[]
  eventSlugs: string[]
  busy: boolean
  onClose: () => void
  onCreated: () => void
  onError: (text: string) => void
}) {
  const defaultSlug = events.find((e) => e.active)?.slug ?? eventSlugs[0] ?? ''
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [eventSlug, setEventSlug] = useState(defaultSlug)
  const [sendConfirmation, setSendConfirmation] = useState(true)
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/masterclass/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: fullName,
        email,
        whatsapp,
        event_slug: eventSlug,
        send_confirmation: sendConfirmation,
      }),
    })
    const data = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) {
      onError(data.error ?? 'No se pudo crear el registro.')
      return
    }
    if (data.warning) {
      onError(data.warning)
      return
    }
    onCreated()
  }

  const slugOptions = Array.from(new Set([...eventSlugs, ...events.map((e) => e.slug)]))

  return (
    <ModalShell title="Agregar registro manual" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nombre" value={fullName} onChange={setFullName} required />
        <Field label="Correo" type="email" value={email} onChange={setEmail} required />
        <Field label="WhatsApp" value={whatsapp} onChange={setWhatsapp} required />
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-600">Evento</label>
          <select
            value={eventSlug}
            onChange={(e) => setEventSlug(e.target.value)}
            className={adminUi.input}
          >
            {slugOptions.map((slug) => (
              <option key={slug} value={slug}>
                {slug}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={sendConfirmation}
            onChange={(e) => setSendConfirmation(e.target.checked)}
          />
          Enviar correo de confirmación al participante
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={adminUi.btnSecondary}>
            Cancelar
          </button>
          <button type="submit" disabled={saving || busy} className={adminUi.btnPrimary}>
            {saving ? 'Guardando…' : 'Agregar'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function ReminderModal({
  count,
  busy,
  onClose,
  onSend,
}: {
  count: number
  busy: boolean
  onClose: () => void
  onSend: (message: string) => void
}) {
  const [message, setMessage] = useState('')

  return (
    <ModalShell title="Enviar recordatorio por correo" onClose={onClose}>
      <p className="mb-4 text-sm text-slate-600">
        Se enviará un correo con tu logo, fecha del evento, enlaces de <strong>Google Meet</strong>,{' '}
        <strong>WhatsApp</strong> y botón de calendario a <strong>{count}</strong> participante
        {count === 1 ? '' : 's'}.
      </p>
      <label className="mb-4 block">
        <span className="mb-2 block text-xs font-medium text-slate-600">
          Mensaje personal opcional (aparece destacado en el correo)
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Ej.: ¡Nos vemos mañana sábado 1 de agosto! Conéctate 5 minutos antes de las 10:00 AM."
          className={`${adminUi.input} resize-y`}
        />
      </label>
      <p className="mb-4 text-xs text-slate-500">
        Requiere SMTP configurado en <code className="text-brand">.env.local</code>. Los envíos se
        hacen uno por uno para no saturar el servidor.
      </p>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className={adminUi.btnSecondary}>
          Cancelar
        </button>
        <button
          type="button"
          disabled={busy || count < 1}
          onClick={() => onSend(message)}
          className={adminUi.btnPrimary}
        >
          {busy ? 'Enviando…' : `Enviar a ${count}`}
        </button>
      </div>
    </ModalShell>
  )
}

function ConfirmDeleteModal({
  busy,
  onClose,
  onConfirm,
}: {
  busy: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <ModalShell title="Eliminar registro" onClose={onClose}>
      <p className="mb-6 text-sm text-slate-600">
        ¿Eliminar este registro? Esta acción no se puede deshacer.
      </p>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className={adminUi.btnSecondary}>
          Cancelar
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {busy ? 'Eliminando…' : 'Eliminar'}
        </button>
      </div>
    </ModalShell>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={adminUi.input}
      />
    </div>
  )
}

function RegistrationCard({
  row,
  selected,
  onToggle,
  onStatus,
  onNotes,
  onEdit,
  onDelete,
}: {
  row: MasterclassRegistrationRow
  selected: boolean
  onToggle: () => void
  onStatus: (id: string, status: MasterclassRegistrationStatus) => void
  onNotes: (id: string, notes: string) => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={selected} onChange={onToggle} aria-label="Seleccionar" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900">{row.full_name}</p>
          <p className="text-xs text-slate-500 break-all">{row.email}</p>
          <p className="text-xs text-slate-500 mt-1">{new Date(row.created_at).toLocaleString('es')}</p>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={onEdit} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={onDelete} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <WhatsAppCell whatsapp={row.whatsapp} />
      <select
        value={row.status}
        onChange={(e) => onStatus(row.id, e.target.value as MasterclassRegistrationStatus)}
        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-900 shadow-sm"
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
