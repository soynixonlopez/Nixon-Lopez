import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ContractEditForm } from '@/components/admin/ContractEditForm'
import type { ServiceContractRecord } from '@/lib/types/contract'

export default async function ContratoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('service_contracts').select('*').eq('id', id).single()
  if (error || !data) notFound()
  const contract = data as ServiceContractRecord

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href={`/admin/contratos/${id}`} className="text-sm text-indigo-400 hover:underline">
          ← Volver al contrato
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Editar contrato</h1>
        <p className="text-slate-400 text-sm mt-1">
          Los cambios se reflejan en la vista imprimible y en el PDF.
        </p>
      </div>
      <ContractEditForm contract={contract} />
    </div>
  )
}
