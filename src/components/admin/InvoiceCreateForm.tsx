'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Line = { description: string; quantity: string; unit_price: string }

export function InvoiceCreateForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [invoiceKind, setInvoiceKind] = useState<'prefactura' | 'final'>('prefactura')
  const [isAbono, setIsAbono] = useState(true)
  const [abonoAmount, setAbonoAmount] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientTaxId, setClientTaxId] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [taxRate, setTaxRate] = useState('0')
  const [lines, setLines] = useState<Line[]>([
    { description: 'Servicio web', quantity: '1', unit_price: '0' },
  ])
  const [notes, setNotes] = useState('')

  function addLine() {
    setLines((l) => [...l, { description: '', quantity: '1', unit_price: '0' }])
  }

  function lineTotal(line: Line) {
    const q = parseFloat(line.quantity) || 0
    const p = parseFloat(line.unit_price) || 0
    return q * p
  }

  const subtotal = lines.reduce((s, l) => s + lineTotal(l), 0)
  const taxPercent = parseFloat(taxRate) || 0
  const taxAmount = subtotal * (taxPercent / 100)
  const total = subtotal + taxAmount

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const { data: invoiceNumber, error: rpcErr } = await supabase.rpc('next_invoice_number')
    if (rpcErr || !invoiceNumber) {
      setLoading(false)
      alert(rpcErr?.message ?? 'No se pudo generar número de factura')
      return
    }

    const invPayload = {
      invoice_number: invoiceNumber as string,
      invoice_kind: invoiceKind,
      invoice_status: 'draft' as const,
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
      discount_amount: 0,
      total_amount: total,
      amount_paid:
        invoiceKind === 'prefactura' && isAbono && abonoAmount
          ? parseFloat(abonoAmount)
          : 0,
      currency: 'USD',
      notes: notes || null,
    }

    const { data: inv, error: invErr } = await supabase
      .from('invoices')
      .insert(invPayload)
      .select('id')
      .single()

    if (invErr || !inv) {
      setLoading(false)
      alert(invErr?.message ?? 'Error creando factura')
      return
    }

    const invoiceId = (inv as { id: string }).id
    const lineRows = lines.map((l, i) => ({
      invoice_id: invoiceId,
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
    router.push(`/admin/facturas/${invoiceId}`)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
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
        <span className="text-xs text-slate-400">Notas</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-50"
      >
        {loading ? 'Guardando…' : 'Crear factura'}
      </button>
    </form>
  )
}
