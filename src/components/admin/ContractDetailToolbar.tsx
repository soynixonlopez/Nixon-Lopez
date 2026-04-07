'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Mail, Printer, Send, Trash2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  contractId: string
  contractNumber: string
  clientName: string
  clientEmail: string | null
}

export function ContractDetailToolbar({
  contractId,
  contractNumber,
  clientName,
  clientEmail,
}: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [emailTo, setEmailTo] = useState(clientEmail ?? '')
  const [emailMsg, setEmailMsg] = useState(
    `Hola,\n\nAdjuntamos el contrato ${contractNumber} para su revisión y firma.\n\nSaludos cordiales.`
  )
  const [error, setError] = useState<string | null>(null)

  async function remove() {
    if (!confirm(`¿Eliminar ${contractNumber}?`)) return
    setBusy(true)
    const supabase = createClient()
    const { error } = await supabase.from('service_contracts').delete().eq('id', contractId)
    setBusy(false)
    if (error) return alert(error.message)
    router.push('/admin/contratos')
    router.refresh()
  }

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/contracts/${contractId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ to: emailTo.trim(), message: emailMsg }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Error al enviar')
        return
      }
      setShowEmail(false)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="print:hidden no-print flex flex-wrap items-center gap-2 mb-6">
        <Link
          href="/admin/contratos"
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
          onClick={() => setShowEmail(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-500"
        >
          <Mail className="w-4 h-4" />
          Enviar por correo
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-900/60 text-red-300 text-sm hover:bg-red-950/50 disabled:opacity-50 ml-auto"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </div>

      {showEmail && (
        <div className="no-print print:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Enviar contrato</h2>
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
            <form onSubmit={send} className="space-y-4">
              <input
                type="email"
                required
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
              />
              <textarea
                value={emailMsg}
                onChange={(e) => setEmailMsg(e.target.value)}
                rows={6}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {busy ? 'Enviando…' : 'Enviar con PDF'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
