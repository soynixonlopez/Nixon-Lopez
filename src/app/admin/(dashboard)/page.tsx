import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, FolderKanban, Receipt, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [quotes, projects, invoices, contracts] = await Promise.all([
    supabase.from('quotes').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('invoices').select('*', { count: 'exact', head: true }),
    supabase.from('service_contracts').select('*', { count: 'exact', head: true }),
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
  ]

  return (
    <div className="space-y-8 w-full min-w-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-indigo-400" />
          Dashboard
        </h1>
        <p className="text-slate-400 mt-1">Resumen de cotizaciones, proyectos y facturas.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Link
            key={c.label}
            href={c.href}
            style={{ animationDelay: `${i * 65}ms` }}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-indigo-500/50 transition-colors max-md:motion-safe:animate-soft-rise"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm">{c.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{c.value}</p>
                {c.hint && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.hint}</p>}
              </div>
              <c.icon className="w-10 h-10 text-indigo-400 opacity-80" />
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="font-semibold text-white mb-2">Accesos rápidos</h2>
        <ul className="flex flex-wrap gap-3 text-sm">
          <li>
            <Link className="text-indigo-400 hover:underline" href="/admin/cotizacion-nueva">
              Crear cotización manual
            </Link>
          </li>
          <li>
            <Link className="text-indigo-400 hover:underline" href="/admin/facturas/nueva">
              Nueva factura / prefactura
            </Link>
          </li>
          <li>
            <Link className="text-indigo-400 hover:underline" href="/admin/contratos/nuevo">
              Nuevo contrato
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
