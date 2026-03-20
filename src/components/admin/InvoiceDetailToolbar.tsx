'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Printer,
  Mail,
  Pencil,
  Trash2,
  X,
  Send,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  invoiceId: string
  invoiceNumber: string
  clientEmail: string | null
  clientName: string
}

export function InvoiceDetailToolbar({
  invoiceId,
  invoiceNumber,
  clientEmail,
  clientName,
}: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [emailTo, setEmailTo] = useState(clientEmail ?? '')
  const [emailMsg, setEmailMsg] = useState(
    `Hola,\n\nAdjuntamos el documento ${invoiceNumber} con el detalle de su facturación.\n\nSaludos cordiales.`
  )
  const [feedback, setFeedback] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)

  async function handleDelete() {
    if (!confirm(`¿Eliminar definitivamente ${invoiceNumber}? Esta acción no se puede deshacer.`)) {
      return
    }
    setBusy(true)
    const supabase = createClient()
    const { error } = await supabase.from('invoices').delete().eq('id', invoiceId)
    setBusy(false)
    if (error) {
      alert(error.message)
      return
    }
    router.push('/admin/facturas')
    router.refresh()
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setSendError(null)
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          to: emailTo.trim(),
          message: emailMsg,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSendError(typeof data.error === 'string' ? data.error : 'Error al enviar')
        return
      }
      setShowEmail(false)
      setFeedback('Correo enviado correctamente con PDF adjunto.')
    } catch {
      setSendError('Error de red al enviar.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="no-print print:hidden flex flex-wrap items-center gap-2 mb-6">
        <Link
          href="/admin/facturas"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Lista
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-white text-sm hover:bg-slate-700 border border-slate-700"
        >
          <Printer className="w-4 h-4" />
          Imprimir / PDF
        </button>
        <button
          type="button"
          onClick={() => {
            setFeedback(null)
            setSendError(null)
            setShowEmail(true)
          }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-500"
        >
          <Mail className="w-4 h-4" />
          Enviar por correo
        </button>
        <Link
          href={`/admin/facturas/${invoiceId}/edit`}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-600 text-slate-200 text-sm hover:bg-slate-800"
        >
          <Pencil className="w-4 h-4" />
          Editar
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-900/60 text-red-300 text-sm hover:bg-red-950/50 disabled:opacity-50 ml-auto"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </div>

      {feedback && (
        <p className="no-print print:hidden text-sm text-emerald-400 mb-4">{feedback}</p>
      )}

      {showEmail && (
        <div className="no-print print:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Enviar al cliente</h2>
              <button
                type="button"
                onClick={() => setShowEmail(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Para: <span className="text-slate-300">{clientName}</span>
            </p>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <label className="block">
                <span className="text-xs text-slate-400">Correo del destinatario</span>
                <input
                  type="email"
                  required
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="cliente@correo.com"
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-400">Mensaje (aparece en el cuerpo del correo)</span>
                <textarea
                  value={emailMsg}
                  onChange={(e) => setEmailMsg(e.target.value)}
                  rows={6}
                  className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
                />
              </label>
              {sendError && <p className="text-sm text-red-400">{sendError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmail(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {busy ? 'Enviando…' : 'Enviar con PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
