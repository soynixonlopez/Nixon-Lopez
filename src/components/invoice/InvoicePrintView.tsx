import Image from 'next/image'
import { INVOICE_BRANDING, documentTitle } from '@/lib/invoice-branding'
import type { InvoiceRecord, InvoiceLineRow } from '@/lib/types/invoice'

type Props = {
  invoice: InvoiceRecord
  lines: InvoiceLineRow[]
}

function fmtMoney(n: number, currency: string) {
  return new Intl.NumberFormat('es-PA', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'USD',
    minimumFractionDigits: 2,
  }).format(n)
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-PA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function InvoicePrintView({ invoice, lines }: Props) {
  const title = documentTitle(invoice.invoice_kind)
  const accent = INVOICE_BRANDING.accentHex
  const subtotal = Number(invoice.subtotal ?? 0)
  const taxRate = Number(invoice.tax_rate ?? 0)
  const taxAmount = Number(invoice.tax_amount ?? 0)
  const total = Number(invoice.total_amount ?? 0)
  const paid = Number(invoice.amount_paid ?? 0)
  const currency = invoice.currency || 'USD'
  const issued = invoice.issued_at
    ? fmtDate(invoice.issued_at)
    : fmtDate(invoice.created_at)

  const terms =
    invoice.terms?.trim() ||
    (invoice.invoice_kind === 'prefactura'
      ? 'Condiciones según acuerdo comercial.'
      : 'Pago según condiciones acordadas.')

  const sorted = [...lines].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <article
      id="invoice-print-root"
      className="mx-auto w-full max-w-[210mm] min-h-[260mm] bg-white text-slate-900 shadow-xl shadow-slate-900/20 rounded-none sm:rounded-lg overflow-hidden print:shadow-none print:rounded-none border border-slate-200 print:border-0"
    >
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 px-8 pt-8 pb-6 border-b border-slate-200">
        <div className="flex-1 min-w-0 max-w-md">
          <div className="relative h-16 w-56 sm:h-20 sm:w-64 max-w-[280px]">
            <Image
              src={INVOICE_BRANDING.logoPath}
              alt={INVOICE_BRANDING.logoAlt}
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 224px, 256px"
              priority
            />
          </div>
          <div className="mt-3 sm:mt-4 space-y-1">
            <p className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: accent }}>
              {INVOICE_BRANDING.businessName}
            </p>
            <p className="text-sm text-slate-600">{INVOICE_BRANDING.businessSubtitle}</p>
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/90 px-3 py-3 text-left">
            <p className="text-[11px] text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-800">RUC:</span> {INVOICE_BRANDING.ruc}
            </p>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              {INVOICE_BRANDING.addressLine1}
              <br />
              {INVOICE_BRANDING.addressLine2}
              <br />
              {INVOICE_BRANDING.country}
            </p>
            <p className="text-[11px] text-slate-700 mt-2 pt-2 border-t border-slate-200/80">
              {INVOICE_BRANDING.email}
              {INVOICE_BRANDING.phone ? (
                <>
                  <br />
                  <span className="text-slate-600">Tel:</span> {INVOICE_BRANDING.phone}
                </>
              ) : null}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: accent }}
          >
            {title}
          </p>
          {invoice.invoice_kind === 'prefactura' && invoice.is_abono && (
            <p className="text-xs font-semibold text-amber-700 mt-1">Incluye abono / anticipo</p>
          )}
        </div>
      </div>

      {/* Cliente + metadatos */}
      <div className="grid sm:grid-cols-2 gap-4 px-8 py-6">
        <div>
          <div
            className="text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-t"
            style={{ backgroundColor: accent }}
          >
            Facturar a
          </div>
          <div className="border border-t-0 border-slate-200 rounded-b px-3 py-3 text-sm space-y-1">
            <p className="font-semibold text-slate-900">{invoice.client_name}</p>
            {invoice.client_tax_id ? (
              <p className="text-slate-600">RUC / ID: {invoice.client_tax_id}</p>
            ) : null}
            {invoice.client_address ? (
              <p className="text-slate-600 whitespace-pre-wrap">{invoice.client_address}</p>
            ) : null}
            {invoice.client_email ? (
              <p className="text-slate-600">{invoice.client_email}</p>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <MetaCell label="Nº documento" value={invoice.invoice_number} accent={accent} />
          <MetaCell label="Fecha" value={issued} accent={accent} />
          <MetaCell label="Estado" value={statusLabel(invoice.invoice_status)} accent={accent} />
          <MetaCell label="Términos" value={terms} accent={accent} small />
        </div>
      </div>

      {/* Tabla */}
      <div className="px-8 pb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: accent }}>
              <th className="text-left text-white font-semibold px-3 py-2 text-xs uppercase">
                Descripción
              </th>
              <th className="text-right text-white font-semibold px-3 py-2 text-xs uppercase w-20">
                Cant.
              </th>
              <th className="text-right text-white font-semibold px-3 py-2 text-xs uppercase w-28">
                Precio u.
              </th>
              <th className="text-right text-white font-semibold px-3 py-2 text-xs uppercase w-28">
                Importe
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 border border-slate-200 border-t-0">
            {sorted.map((row, i) => (
              <tr key={row.id ?? i} className="bg-white">
                <td className="px-3 py-2 text-slate-800">{row.description}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-700">
                  {Number(row.quantity).toLocaleString('es-PA', { maximumFractionDigits: 4 })}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-700">
                  {fmtMoney(Number(row.unit_price), currency)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-medium text-slate-900">
                  {fmtMoney(Number(row.line_total), currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="flex flex-col sm:flex-row sm:justify-end px-8 pb-8 gap-6">
        <div className="w-full sm:w-72 space-y-1 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="tabular-nums">{fmtMoney(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>ITBIS / Impuesto ({taxRate.toFixed(2)}%)</span>
            <span className="tabular-nums">{fmtMoney(taxAmount, currency)}</span>
          </div>
          {invoice.invoice_kind === 'prefactura' && invoice.is_abono && invoice.abono_amount != null ? (
            <div className="flex justify-between text-amber-800 font-medium">
              <span>Abono registrado</span>
              <span className="tabular-nums">{fmtMoney(Number(invoice.abono_amount), currency)}</span>
            </div>
          ) : null}
          <div
            className="flex justify-between items-center text-white px-3 py-3 mt-2 rounded"
            style={{ backgroundColor: accent }}
          >
            <span className="font-bold text-base uppercase">Total</span>
            <span className="font-bold text-xl tabular-nums">{fmtMoney(total, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-600 pt-1">
            <span>Monto pagado</span>
            <span className="tabular-nums">{fmtMoney(paid, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-800 font-semibold border-t border-slate-200 pt-2">
            <span>Saldo</span>
            <span className="tabular-nums">{fmtMoney(total - paid, currency)}</span>
          </div>
        </div>
      </div>

      {/* Pie */}
      <div className="px-8 pb-8 pt-0 border-t border-slate-100">
        <p className="text-slate-500 text-xs italic mb-2">¡Gracias por su preferencia!</p>
        {invoice.notes ? (
          <p className="text-xs text-slate-600 whitespace-pre-wrap border border-slate-100 rounded p-2 bg-slate-50">
            <span className="font-semibold text-slate-700">Notas: </span>
            {invoice.notes}
          </p>
        ) : null}
        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">{INVOICE_BRANDING.legalNote}</p>
      </div>
    </article>
  )
}

function MetaCell({
  label,
  value,
  accent,
  small,
}: {
  label: string
  value: string
  accent: string
  small?: boolean
}) {
  return (
    <div className="border border-slate-200 rounded overflow-hidden">
      <div className="text-[10px] font-bold text-white px-2 py-1 uppercase" style={{ backgroundColor: accent }}>
        {label}
      </div>
      <div className={`px-2 py-1.5 text-slate-800 bg-white ${small ? 'text-[11px] leading-snug' : 'text-sm'}`}>
        {value}
      </div>
    </div>
  )
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    draft: 'Borrador',
    sent: 'Enviada',
    partially_paid: 'Pago parcial',
    paid: 'Pagada',
    cancelled: 'Anulada',
  }
  return map[s] ?? s
}
