import { createClient } from '@/lib/supabase/server'
import { MasterclassRegistrationsTable } from '@/components/admin/MasterclassRegistrationsTable'
import { MASTERCLASS_EVENT, MASTERCLASS_EVENTS } from '@/lib/masterclass'
import { adminUi } from '@/lib/admin-ui'
import { GraduationCap, ExternalLink } from 'lucide-react'
import Link from 'next/link'

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
        <h1 className={`${adminUi.pageTitle} flex items-center justify-center gap-2 sm:justify-start`}>
          <GraduationCap className="h-8 w-8 text-brand" aria-hidden />
          Masterclass
        </h1>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl mx-auto sm:mx-0">
          Gestiona registros, edita datos, envía recordatorios y exporta CSV. La landing pública está
          en{' '}
          <Link href="/masterclass" className={adminUi.link} target="_blank">
            /masterclass
          </Link>
          .
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`${adminUi.card} p-5`}>
          <p className="text-sm text-slate-500">Total registros</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{rows.length}</p>
        </div>
        <div className={`${adminUi.card} p-5`}>
          <p className="text-sm text-slate-500">Evento actual</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{currentEventCount}</p>
          <p className="mt-1 text-xs text-slate-500 truncate">{MASTERCLASS_EVENT.dateLabel}</p>
        </div>
        <div className={`${adminUi.card} p-5`}>
          <p className="text-sm text-slate-500">Slug activo</p>
          <p className="mt-1 text-sm font-mono text-brand break-all">{MASTERCLASS_EVENT.slug}</p>
        </div>
      </div>

      <div className={`${adminUi.panel} space-y-3`}>
        <h2 className="font-semibold text-slate-900">¿Cómo agregar un nuevo evento o bootcamp?</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li>
            Edita{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-brand">
              src/lib/masterclass.ts
            </code>{' '}
            — duplica el objeto del evento, cambia <strong>slug</strong>, fechas, enlaces de Meet /
            WhatsApp / Calendar y pon <code className="text-xs">active: true</code> en el nuevo.
          </li>
          <li>
            Haz deploy. Los registros nuevos en{' '}
            <Link href="/masterclass" className={adminUi.link} target="_blank">
              /masterclass
              <ExternalLink className="ml-0.5 inline h-3 w-3" />
            </Link>{' '}
            irán al evento activo.
          </li>
          <li>
            Desde este panel puedes <strong>Agregar registro</strong> manualmente (elige el slug del
            evento) y <strong>Recordatorio</strong> para enviar correos a todos o a los seleccionados.
          </li>
        </ol>
        {MASTERCLASS_EVENTS.length > 1 && (
          <p className="text-xs text-slate-500">
            Eventos configurados: {MASTERCLASS_EVENTS.map((e) => e.slug).join(', ')}
          </p>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm">
          Error al cargar: {error.message}. Ejecuta la migración SQL en Supabase (
          <code className="text-red-600">20260729103000_masterclass_registrations.sql</code>).
        </p>
      )}

      <MasterclassRegistrationsTable
        registrations={rows as never[]}
        eventSlugs={eventSlugs}
        events={MASTERCLASS_EVENTS}
      />
    </div>
  )
}
