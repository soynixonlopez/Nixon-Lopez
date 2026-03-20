import { createClient } from '@/lib/supabase/server'
import { ProjectsBoard } from '@/components/admin/ProjectsBoard'

export default async function ProyectosPage() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select(
      'id, title, client_name, client_email, status, priority, due_date, created_at'
    )
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Proyectos</h1>
        <p className="text-slate-400 text-sm mt-1">
          Seguimiento por columnas. Mueve entre estados con los botones de cada tarjeta.
        </p>
      </div>
      {error && <p className="text-red-400 text-sm">{error.message}</p>}
      <ProjectsBoard projects={(projects ?? []) as never[]} />
    </div>
  )
}
