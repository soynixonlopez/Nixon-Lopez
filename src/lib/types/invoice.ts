export type InvoiceKind = 'prefactura' | 'final'
export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'cancelled'

export type InvoiceLineRow = {
  id?: string
  sort_order: number
  description: string
  quantity: number
  unit_price: number
  line_total: number
}

export type InvoiceRecord = {
  id: string
  created_at: string
  updated_at: string
  invoice_number: string
  invoice_kind: InvoiceKind
  invoice_status: InvoiceStatus
  is_abono: boolean
  abono_amount: number | null
  quote_id: string | null
  project_id: string | null
  client_name: string
  client_email: string | null
  client_tax_id: string | null
  client_address: string | null
  subtotal: number
  tax_rate: number | null
  tax_amount: number | null
  discount_amount: number | null
  total_amount: number
  amount_paid: number | null
  currency: string
  issued_at: string | null
  due_date: string | null
  paid_at: string | null
  notes: string | null
  terms: string | null
}
