import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProjectScrumBoard } from '@/components/admin/ProjectScrumBoard'

export default async function ProyectoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project, error: projectError }, { data: tasks, error: tasksError }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, title, description, client_name, client_email, status, started_at, due_date, created_at')
      .eq('id', id)
      .single(),
    supabase
      .from('project_tasks')
      .select('id, project_id, title, description, status, priority, due_date, sort_order')
      .eq('project_id', id)
      .order('sort_order', { ascending: true }),
  ])

  if (projectError || !project) notFound()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/proyectos"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Proyectos
        </Link>
        <h1 className="text-2xl font-bold text-white">{project.title}</h1>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <p>
          <span className="text-slate-500 block text-xs">Cliente</span>
          {project.client_name}
        </p>
        <p>
          <span className="text-slate-500 block text-xs">Servicio</span>
          {project.description || 'Por definir'}
        </p>
        <p>
          <span className="text-slate-500 block text-xs">Inicio</span>
          {project.started_at ? String(project.started_at).slice(0, 10) : 'Por colocar'}
        </p>
        <p>
          <span className="text-slate-500 block text-xs">Entrega</span>
          {project.due_date || 'Por colocar'}
        </p>
      </div>

      {tasksError ? (
        <p className="text-red-400 text-sm">{tasksError.message}</p>
      ) : (
        <ProjectScrumBoard projectId={project.id} initialTasks={(tasks ?? []) as never[]} />
      )}
    </div>
  )
}
