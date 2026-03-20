'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { InvoiceLineRow, InvoiceRecord, InvoiceStatus } from '@/lib/types/invoice'

type Line = { description: string; quantity: string; unit_price: string }

type Props = {
  invoice: InvoiceRecord
  lines: InvoiceLineRow[]
}

export function InvoiceEditForm({ invoice, lines: initialLines }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [invoiceKind, setInvoiceKind] = useState<'prefactura' | 'final'>(invoice.invoice_kind)
  const [isAbono, setIsAbono] = useState(invoice.is_abono)
  const [abonoAmount, setAbonoAmount] = useState(
    invoice.abono_amount != null ? String(invoice.abono_amount) : ''
  )
  const [clientName, setClientName] = useState(invoice.client_name)
  const [clientEmail, setClientEmail] = useState(invoice.client_email ?? '')
  const [clientTaxId, setClientTaxId] = useState(invoice.client_tax_id ?? '')
  const [clientAddress, setClientAddress] = useState(invoice.client_address ?? '')
  const [taxRate, setTaxRate] = useState(String(invoice.tax_rate ?? 0))
  const [lines, setLines] = useState<Line[]>(() =>
    initialLines.length
      ? [...initialLines]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((l) => ({
            description: l.description,
            quantity: String(l.quantity),
            unit_price: String(l.unit_price),
          }))
      : [{ description: '', quantity: '1', unit_price: '0' }]
  )
  const [notes, setNotes] = useState(invoice.notes ?? '')
  const [terms, setTerms] = useState(invoice.terms ?? '')
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>(invoice.invoice_status)

  const lineTotal = (line: Line) => {
    const q = parseFloat(line.quantity) || 0
    const p = parseFloat(line.unit_price) || 0
    return q * p
  }

  const subtotal = lines.reduce((s, l) => s + lineTotal(l), 0)
  const taxPercent = parseFloat(taxRate) || 0
  const taxAmount = subtotal * (taxPercent / 100)
  const total = subtotal + taxAmount

  function addLine() {
    setLines((l) => [...l, { description: '', quantity: '1', unit_price: '0' }])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const invPayload = {
      invoice_kind: invoiceKind,
      invoice_status: invoiceStatus,
      is_abono: invoiceKind === 'prefactura' ? isAbono : false,
      abono_amount:
        invoiceKind === 'prefactura' && isAbono && abonoAmount
          ? parseFloat(abonoAmount)
          : null,
      client_name: clientName,
      client_email: clientEmail || null,
      client_tax_id: clientTaxId || null,
      client_address: clientAddress || null,
      subtotal,
      tax_rate: taxPercent,
      tax_amount: taxAmount,
      discount_amount: invoice.discount_amount ?? 0,
      total_amount: total,
      amount_paid:
        invoiceKind === 'prefactura' && isAbono && abonoAmount
          ? parseFloat(abonoAmount)
          : invoice.amount_paid ?? 0,
      currency: invoice.currency || 'USD',
      notes: notes || null,
      terms: terms || null,
    }

    const { error: upErr } = await supabase.from('invoices').update(invPayload).eq('id', invoice.id)
    if (upErr) {
      setLoading(false)
      alert(upErr.message)
      return
    }

    const { error: delErr } = await supabase
      .from('invoice_line_items')
      .delete()
      .eq('invoice_id', invoice.id)
    if (delErr) {
      setLoading(false)
      alert(delErr.message)
      return
    }

    const lineRows = lines.map((l, i) => ({
      invoice_id: invoice.id,
      sort_order: i,
      description: l.description || 'Ítem',
      quantity: parseFloat(l.quantity) || 1,
      unit_price: parseFloat(l.unit_price) || 0,
      line_total: lineTotal(l),
    }))

    const { error: lineErr } = await supabase.from('invoice_line_items').insert(lineRows)
    setLoading(false)
    if (lineErr) {
      alert(lineErr.message)
      return
    }
    router.push(`/admin/facturas/${invoice.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/facturas/${invoice.id}`}
          className="text-sm text-indigo-400 hover:underline"
        >
          ← Ver documento
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label>
          <span className="text-xs text-slate-400">Estado</span>
          <select
            value={invoiceStatus}
            onChange={(e) => setInvoiceStatus(e.target.value as InvoiceStatus)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          >
            <option value="draft">Borrador</option>
            <option value="sent">Enviada</option>
            <option value="partially_paid">Pago parcial</option>
            <option value="paid">Pagada</option>
            <option value="cancelled">Anulada</option>
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Tipo de documento</span>
          <select
            value={invoiceKind}
            onChange={(e) => setInvoiceKind(e.target.value as 'prefactura' | 'final')}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          >
            <option value="prefactura">Prefactura (anticipo / parcial)</option>
            <option value="final">Factura final (total cerrado)</option>
          </select>
        </label>
        {invoiceKind === 'prefactura' && (
          <>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={isAbono}
                onChange={(e) => setIsAbono(e.target.checked)}
              />
              <span className="text-sm text-slate-300">Incluye abono / anticipo</span>
            </label>
            {isAbono && (
              <label>
                <span className="text-xs text-slate-400">Monto abonado (USD)</span>
                <input
                  type="number"
                  step="0.01"
                  value={abonoAmount}
                  onChange={(e) => setAbonoAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                />
              </label>
            )}
          </>
        )}
      </div>

      <p className="text-xs text-slate-500 font-mono">Número: {invoice.invoice_number}</p>

      <h2 className="text-lg font-semibold text-white">Cliente</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Nombre / Razón social</span>
          <input
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">Correo</span>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label>
          <span className="text-xs text-slate-400">RUC / ID fiscal</span>
          <input
            value={clientTaxId}
            onChange={(e) => setClientTaxId(e.target.value)}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs text-slate-400">Dirección</span>
          <textarea
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          />
        </label>
      </div>

      <h2 className="text-lg font-semibold text-white">Líneas</h2>
      <div className="space-y-3">
        {lines.map((line, i) => (
          <div key={i} className="grid sm:grid-cols-12 gap-2 items-end">
            <label className="sm:col-span-6">
              <span className="text-xs text-slate-400">Descripción</span>
              <input
                value={line.description}
                onChange={(e) => {
                  const next = [...lines]
                  next[i] = { ...line, description: e.target.value }
                  setLines(next)
                }}
                className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-xs text-slate-400">Cant.</span>
              <input
                type="number"
                value={line.quantity}
                onChange={(e) => {
                  const next = [...lines]
                  next[i] = { ...line, quantity: e.target.value }
                  setLines(next)
                }}
                className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-xs text-slate-400">Precio u.</span>
              <input
                type="number"
                step="0.01"
                value={line.unit_price}
                onChange={(e) => {
                  const next = [...lines]
                  next[i] = { ...line, unit_price: e.target.value }
                  setLines(next)
                }}
                className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
              />
            </label>
            <div className="sm:col-span-2 text-sm text-slate-400 pb-2">
              ${lineTotal(line).toFixed(2)}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addLine}
          className="text-sm text-indigo-400 hover:underline"
        >
          + Añadir línea
        </button>
      </div>

      <label>
        <span className="text-xs text-slate-400">Impuesto % (sobre subtotal)</span>
        <input
          type="number"
          step="0.01"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
          className="mt-1 w-full max-w-xs rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
        />
      </label>

      <div className="rounded-xl border border-slate-700 p-4 text-sm space-y-1">
        <p className="text-slate-400">
          Subtotal: <span className="text-white">${subtotal.toFixed(2)}</span>
        </p>
        <p className="text-slate-400">
          Impuesto: <span className="text-white">${taxAmount.toFixed(2)}</span>
        </p>
        <p className="text-lg font-bold text-white">Total: ${total.toFixed(2)} USD</p>
      </div>

      <label>
        <span className="text-xs text-slate-400">Notas (en el documento)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
        />
      </label>
      <label>
        <span className="text-xs text-slate-400">Términos / condiciones (metadatos)</span>
        <textarea
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-50"
      >
        {loading ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  )
}
