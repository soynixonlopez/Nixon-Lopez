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
  const terms = contract.terms_payload
  const companyFromTerms =
    terms && typeof terms === 'object'
      ? (() => {
          const client = (terms as Record<string, unknown>).client
          if (client && typeof client === 'object' && !Array.isArray(client)) {
            const empresa = (client as Record<string, unknown>).empresa
            if (typeof empresa === 'string' && empresa.trim()) return empresa.trim()
          }
          const company = (terms as Record<string, unknown>).company
          return typeof company === 'string' && company.trim() ? company.trim() : null
        })()
      : null

  return (
    <div className="max-w-[220mm] mx-auto print:max-w-none print:w-full print:overflow-visible">
      <ContractDetailToolbar
        contractId={contract.id}
        contractNumber={contract.contract_number}
        clientName={contract.client_name}
        clientEmail={contract.client_email}
        company={companyFromTerms}
      />
      <ContractPrintView contract={contract} />
    </div>
  )
}
