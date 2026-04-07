import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ContractPrintView } from '@/components/contract/ContractPrintView'
import { ContractDetailToolbar } from '@/components/admin/ContractDetailToolbar'
import type { ServiceContractRecord } from '@/lib/types/contract'

export default async function ContratoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('service_contracts').select('*').eq('id', id).single()
  if (error || !data) notFound()
  const contract = data as ServiceContractRecord

  return (
    <div className="max-w-[220mm] mx-auto">
      <ContractDetailToolbar
        contractId={contract.id}
        contractNumber={contract.contract_number}
        clientName={contract.client_name}
        clientEmail={contract.client_email}
      />
      <ContractPrintView contract={contract} />
    </div>
  )
}
