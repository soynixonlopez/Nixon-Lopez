export type ContractStatus = 'draft' | 'sent' | 'signed' | 'cancelled'

export type ServiceContractRecord = {
  id: string
  created_at: string
  updated_at: string
  contract_number: string
  status: ContractStatus
  quote_id: string | null
  client_name: string
  client_email: string | null
  client_tax_id: string | null
  client_address: string | null
  city: string | null
  service_type: string | null
  service_label: string
  total_amount: number
  currency: string
  signed_date: string | null
  custom_notes: string | null
  terms_payload: Record<string, unknown> | null
}
