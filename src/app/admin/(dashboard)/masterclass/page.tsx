import { createClient } from '@/lib/supabase/server'
import { MasterclassRegistrationsTable } from '@/components/admin/MasterclassRegistrationsTable'
import { MASTERCLASS_EVENT } from '@/lib/masterclass'
import { GraduationCap } from 'lucide-react'

export default async function MasterclassAdminPage() {
  const supabase = await createClient()
  const { data: registrations, error } = await supabase
    .from('masterclass_registrations')
    .select(
      'id, created_at, full_name, email, whatsapp, event_slug, event_name, status, internal_notes',
    )
    .order('created_at', { ascending: false })

  const rows = registrations ?? []
  const eventSlugs = Array.from(new Set(rows.map((r) => r.event_slug as string)))
  if (!eventSlugs.includes(MASTERCLASS_EVENT.slug)) {
    eventSlugs.unshift(MASTERCLASS_EVENT.slug)
  }

  const currentEventCount = rows.filter((r) => r.event_slug === MASTERCLASS_EVENT.slug).length

  return (
    <div className="space-y-8 max-w-6xl mx-auto w-full min-w-0">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <GraduationCap className="h-8 w-8 text-indigo-400" aria-hidden />
          Masterclass
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl mx-auto sm:mx-0">
          Registros desde la landing <code className="text-indigo-300">/masterclass</code>. Busca,
          filtra por evento o estado y exporta a CSV.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm text-slate-400">Total registros</p>
          <p className="mt-1 text-3xl font-bold text-white">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm text-slate-400">Evento actual</p>
          <p className="mt-1 text-3xl font-bold text-white">{currentEventCount}</p>
          <p className="mt-1 text-xs text-slate-500 truncate">{MASTERCLASS_EVENT.dateLabel}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm text-slate-400">Slug activo</p>
          <p className="mt-1 text-sm font-mono text-indigo-300 break-all">{MASTERCLASS_EVENT.slug}</p>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm">
          Error al cargar: {error.message}. Ejecuta la migración SQL en Supabase (
          <code className="text-red-300">20260729103000_masterclass_registrations.sql</code>).
        </p>
      )}

      <MasterclassRegistrationsTable
        registrations={rows as never[]}
        eventSlugs={eventSlugs}
      />
    </div>
  )
}
