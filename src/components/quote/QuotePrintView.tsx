import Image from 'next/image'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'

type QuoteRow = Record<string, unknown> & {
  id: string
  created_at: string
  client_first_name: string
  client_last_name: string
  client_email: string
  client_phone?: string | null
  company?: string | null
  service_label: string | null
  service_id: string | null
  quantity_pages: number | null
  total_amount: number | null
  subtotal: number | null
  comments: string | null
  internal_notes: string | null
  status: string
  raw_payload: unknown
}

function parseBreakdown(raw: unknown): { label: string; amount: number }[] | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const b = o.breakdown
  if (!b || typeof b !== 'object') return null
  const lines = (b as { lines?: unknown }).lines
  if (!Array.isArray(lines)) return null
  return lines
    .map((x) => {
      if (!x || typeof x !== 'object') return null
      const l = x as Record<string, unknown>
      const label = typeof l.label === 'string' ? l.label : ''
      const amount = typeof l.amount === 'number' ? l.amount : Number(l.amount)
      if (!label || Number.isNaN(amount)) return null
      return { label, amount }
    })
    .filter(Boolean) as { label: string; amount: number }[]
}

const statusEs: Record<string, string> = {
  new: 'Nueva',
  reviewing: 'En revisión',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  converted_to_project: 'Convertida a proyecto',
  archived: 'Archivada',
}

export function QuotePrintView({ quote }: { quote: QuoteRow }) {
  const accent = INVOICE_BRANDING.accentHex
  const breakdown = parseBreakdown(quote.raw_payload)
  const total = quote.total_amount != null ? Number(quote.total_amount) : 0
  const monthly =
    typeof quote.raw_payload === 'object' &&
    quote.raw_payload !== null &&
    (quote.raw_payload as { monthly?: boolean }).monthly === true

  return (
    <article
      id="quote-print-root"
      className="mx-auto w-full max-w-full sm:max-w-[210mm] bg-white text-slate-900 shadow-xl shadow-slate-900/10 rounded-lg overflow-hidden border border-slate-200 print:shadow-none print:rounded-none print:border-0 print:max-w-none mb-8 print:break-inside-avoid"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 px-4 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-slate-200 print:px-6 print:pt-6">
        <div className="flex-1 min-w-0 max-w-full sm:max-w-md">
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
              {INVOICE_BRANDING.addressLine1}, {INVOICE_BRANDING.addressLine2}
              <br />
              {INVOICE_BRANDING.country}
            </p>
            <p className="text-[11px] text-slate-700 mt-2 pt-2 border-t border-slate-200/80">
              {INVOICE_BRANDING.email}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right min-w-0 shrink-0">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight" style={{ color: accent }}>
            COTIZACIÓN
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono">Ref. {quote.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-sm text-slate-600 mt-2">
            {new Date(quote.created_at).toLocaleDateString('es-PA', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs text-slate-500 mt-1">Estado: {statusEs[quote.status] ?? quote.status}</p>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-6 print:px-6">
        <div
          className="text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-t"
          style={{ backgroundColor: accent }}
        >
          Cliente
        </div>
        <div className="border border-t-0 border-slate-200 rounded-b px-3 py-3 text-sm space-y-1 break-words">
          <p className="font-semibold text-slate-900">
            {quote.client_first_name} {quote.client_last_name}
          </p>
          {quote.company ? <p className="text-slate-600 break-words">{String(quote.company)}</p> : null}
          <p className="text-slate-600 break-all">{quote.client_email}</p>
          {quote.client_phone ? <p className="text-slate-600 break-words">{quote.client_phone}</p> : null}
        </div>
      </div>

      <div className="px-4 sm:px-8 pb-5 sm:pb-6 print:px-6 min-w-0">
        <h3 className="text-sm font-bold text-slate-800 mb-3" style={{ color: accent }}>
          Detalle del presupuesto
        </h3>
        {breakdown && breakdown.length > 0 ? (
          <div className="w-full overflow-x-auto -mx-1 px-1 print:overflow-visible print:mx-0 print:px-0">
            <table className="w-full min-w-[280px] text-xs sm:text-sm border border-slate-200 rounded-lg overflow-hidden print:text-sm table-fixed">
              <thead>
                <tr style={{ backgroundColor: accent }} className="text-white [print-color-adjust:exact]">
                  <th className="text-left px-2 sm:px-3 py-2 font-semibold w-[65%] sm:w-auto">Concepto</th>
                  <th className="text-right px-2 sm:px-3 py-2 font-semibold w-[35%] sm:w-28 whitespace-nowrap">
                    Importe
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {breakdown.map((row, i) => (
                  <tr key={i} className="print:break-inside-avoid">
                    <td className="px-2 sm:px-3 py-2 text-slate-800 align-top break-words">{row.label}</td>
                    <td className="px-2 sm:px-3 py-2 text-right tabular-nums whitespace-nowrap align-top">
                      ${row.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 p-3 sm:p-4 text-sm space-y-2 break-words">
            <p>
              <span className="text-slate-500">Servicio: </span>
              <span className="text-slate-900">{quote.service_label ?? '—'}</span>
            </p>
            {quote.quantity_pages != null ? (
              <p>
                <span className="text-slate-500">Páginas / alcance: </span>
                {quote.quantity_pages}
              </p>
            ) : null}
          </div>
        )}

        <div
          className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-white px-3 sm:px-4 py-3 rounded-lg print:flex-row print:items-center print:justify-between"
          style={{ backgroundColor: accent }}
        >
          <span className="font-bold uppercase text-sm sm:text-base">Total estimado</span>
          <span className="text-lg sm:text-xl font-bold tabular-nums">
            ${total.toFixed(2)} USD{monthly ? ' / mes' : ''}
          </span>
        </div>
      </div>

      {quote.comments ? (
        <div className="px-4 sm:px-8 pb-5 sm:pb-6 print:px-6 min-w-0">
          <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Comentarios del cliente</h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap border border-slate-100 rounded-lg p-3 bg-slate-50">
            {quote.comments}
          </p>
        </div>
      ) : null}

      <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-0 border-t border-slate-100 print:px-6">
        <p className="text-xs italic text-slate-500">*Gracias por su interés. Esta cotización tiene carácter informativo.</p>
        <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">{INVOICE_BRANDING.legalNote}</p>
      </div>
    </article>
  )
}
