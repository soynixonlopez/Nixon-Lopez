import { createClient } from '@/lib/supabase/server'
import { ProjectsBoard, type ContractProject } from '@/components/admin/ProjectsBoard'

export default async function ProyectosPage() {
  const supabase = await createClient()

  const [{ data: contracts, error: contractsError }, { data: projects, error: projectsError }] =
    await Promise.all([
      supabase
        .from('service_contracts')
        .select('id, contract_number, quote_id, service_label, client_name, created_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('projects')
        .select(
          'id, title, description, client_name, client_email, status, created_at, quote_id'
        )
        .order('created_at', { ascending: false }),
    ])

  const contractsByQuote = new Map<
    string,
    { id: string; contract_number: string; service_label: string | null; client_name: string }
  >()
  for (const contract of contracts ?? []) {
    if (!contract.quote_id) continue
    if (!contractsByQuote.has(contract.quote_id)) {
      contractsByQuote.set(contract.quote_id, {
        id: contract.id,
        contract_number: contract.contract_number,
        service_label: contract.service_label,
        client_name: contract.client_name,
      })
    }
  }

  const linked: ContractProject[] = (projects ?? [])
    .filter((project) => project.quote_id && contractsByQuote.has(project.quote_id))
    .map((project) => {
      const contract = contractsByQuote.get(project.quote_id as string)!
      return {
        id: project.id,
        title: project.title,
        description: project.description,
        client_name: project.client_name,
        client_email: project.client_email,
        status: project.status,
        created_at: project.created_at,
        quote_id: project.quote_id,
        contract_id: contract.id,
        contract_number: contract.contract_number,
        service_label: contract.service_label,
      }
    })

  // Si hay contrato sin proyecto aún, mostrar entrada virtual creable vía refresh tras crear contrato
  const projectQuoteIds = new Set(linked.map((p) => p.quote_id).filter(Boolean))
  const orphanContracts = (contracts ?? []).filter(
    (c) => c.quote_id && !projectQuoteIds.has(c.quote_id)
  )

  const error = contractsError || projectsError

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Proyectos</h1>
        <p className="mt-1 text-sm text-slate-400">
          Solo proyectos con contrato de trabajo. Cambia el estado: Iniciado → Desarrollo →
          Terminado.
        </p>
      </div>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      {orphanContracts.length > 0 ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Hay {orphanContracts.length} contrato(s) sin proyecto vinculado. Al crear un contrato
          nuevo se genera el proyecto automáticamente; puedes recrear abriendo el contrato y
          guardando de nuevo, o creando el proyecto desde la cotización.
        </p>
      ) : null}
      <ProjectsBoard projects={linked} />
    </div>
  )
}
