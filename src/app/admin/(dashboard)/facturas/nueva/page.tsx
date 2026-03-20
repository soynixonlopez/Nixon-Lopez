import { InvoiceCreateForm } from '@/components/admin/InvoiceCreateForm'

export default function NuevaFacturaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Nueva factura / prefactura</h1>
      <InvoiceCreateForm />
    </div>
  )
}
