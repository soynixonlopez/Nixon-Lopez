import { Images } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PortfolioBoard } from '@/components/admin/PortfolioBoard'
import { adminUi } from '@/lib/admin-ui'
import type { PortfolioProjectRow } from '@/lib/portfolio'

export default async function PortafolioAdminPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-8">
      <div className="text-center sm:text-left">
        <h1
          className={`${adminUi.pageTitle} flex items-center justify-center gap-2 sm:justify-start`}
        >
          <Images className="h-8 w-8 text-brand" aria-hidden />
          Portafolio web
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500 sm:mx-0">
          Sube proyectos e imágenes optimizadas. Lo publicado con “Mostrar en Home” aparece en el
          carrusel de{' '}
          <Link href="/#projects" className={adminUi.link} target="_blank">
            la página principal
          </Link>
          . Las imágenes se ajustan a 16:10 (1600×1000) y se comprimen a WebP.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No se pudo cargar la tabla <code className="font-mono">portfolio_projects</code>:{' '}
          {error.message}. Ejecuta en Supabase la migración{' '}
          <code className="font-mono">20260806200000_portfolio_projects.sql</code>.
        </div>
      )}

      <PortfolioBoard projects={(data ?? []) as PortfolioProjectRow[]} />
    </div>
  )
}
