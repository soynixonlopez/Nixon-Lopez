import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, FileText, FolderKanban, GraduationCap, Plus, Receipt, Sparkles } from 'lucide-react'
import { MASTERCLASS_EVENT } from '@/lib/masterclass'
import { adminUi } from '@/lib/admin-ui'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [quotes, projects, invoices, contracts, masterclass] = await Promise.all([
    supabase.from('quotes').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('invoices').select('*', { count: 'exact', head: true }),
    supabase.from('service_contracts').select('*', { count: 'exact', head: true }),
    supabase
      .from('masterclass_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_slug', MASTERCLASS_EVENT.slug),
  ])

  const qStatus = await supabase.from('quotes').select('status').limit(500)

  const byStatus: Record<string, number> = {}
  qStatus.data?.forEach((r) => {
    const s = (r as { status: string }).status
    byStatus[s] = (byStatus[s] || 0) + 1
  })

  const cards = [
    {
      label: 'Cotizaciones',
      value: quotes.count ?? 0,
      href: '/admin/cotizaciones',
      icon: FileText,
      hint: Object.entries(byStatus)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' · '),
    },
    {
      label: 'Proyectos',
      value: projects.count ?? 0,
      href: '/admin/proyectos',
      icon: FolderKanban,
    },
    {
      label: 'Facturas',
      value: invoices.count ?? 0,
      href: '/admin/facturas',
      icon: Receipt,
    },
    {
      label: 'Contratos',
      value: contracts.count ?? 0,
      href: '/admin/contratos',
      icon: FileText,
    },
    {
      label: 'Masterclass',
      value: masterclass.count ?? 0,
      href: '/admin/masterclass',
      icon: GraduationCap,
      hint: MASTERCLASS_EVENT.dateLabel,
    },
  ]

  const quickLinks = [
    { href: '/admin/cotizacion-nueva', label: 'Crear cotización manual' },
    { href: '/admin/facturas/nueva', label: 'Nueva factura / prefactura' },
    { href: '/admin/contratos/nuevo', label: 'Nuevo contrato' },
    { href: '/admin/masterclass', label: 'Ver registros masterclass' },
  ]

  return (
    <div className="w-full min-w-0 space-y-8">
      <div>
        <span className={adminUi.badge}>
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Panel de control
        </span>
        <h1 className={`${adminUi.pageTitle} mt-4 flex items-center gap-3`}>
          Dashboard
        </h1>
        <p className={adminUi.pageSubtitle}>
          Resumen de cotizaciones, proyectos, facturas y masterclass.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c, i) => (
          <Link
            key={c.label}
            href={c.href}
            style={{ animationDelay: `${i * 65}ms` }}
            className={`${adminUi.card} ${adminUi.cardHover} group p-6 max-md:motion-safe:animate-soft-rise`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-slate-400">{c.label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{c.value}</p>
                {c.hint ? (
                  <p className="mt-2 line-clamp-2 text-xs text-slate-500">{c.hint}</p>
                ) : null}
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/20 transition-colors group-hover:bg-brand/30">
                <c.icon className={`h-5 w-5 ${adminUi.statIcon}`} aria-hidden />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className={adminUi.panel}>
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-brand" aria-hidden />
          <h2 className="font-semibold text-slate-900">Accesos rápidos</h2>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors hover:border-brand/25 hover:bg-brand/5 ${adminUi.link}`}
              >
                <span>{link.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
