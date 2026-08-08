'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Printer, Pencil, Trash2, ReceiptText } from 'lucide-react'
import { buildClientDocumentPrintTitle } from '@/lib/document-filename'
import { createClient } from '@/lib/supabase/client'

type Props = {
  quoteId: string
  clientName: string
  company?: string | null
}

export function QuoteDetailToolbar({ quoteId, clientName, company }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleDelete() {
    if (!confirm(`¿Eliminar la cotización de ${clientName}?`)) return
    setBusy(true)
    const supabase = createClient()
    const { error } = await supabase.from('quotes').delete().eq('id', quoteId)
    setBusy(false)
    if (error) {
      alert(error.message)
      return
    }
    router.push('/admin/cotizaciones')
    router.refresh()
  }

  function handlePrint() {
    const prev = document.title
    document.title = buildClientDocumentPrintTitle({
      kind: 'Cotizacion',
      clientName,
      company,
      ref: quoteId.slice(0, 8).toUpperCase(),
    })
    window.print()
    window.setTimeout(() => {
      document.title = prev
    }, 500)
  }

  return (
    <div className="print:hidden no-print flex flex-wrap items-stretch sm:items-center gap-2 mb-6 w-full min-w-0">
      <Link
        href="/admin/cotizaciones"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Lista
      </Link>
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 shadow-sm hover:bg-slate-50 flex-1 sm:flex-initial min-w-0"
      >
        <Printer className="w-4 h-4" />
        Imprimir / PDF
      </button>
      <a
        href="#editar-cotizacion"
        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 flex-1 sm:flex-initial min-w-0"
      >
        <Pencil className="w-4 h-4" />
        Editar datos
      </a>
      <Link
        href={`/admin/facturas/nueva?quoteId=${quoteId}`}
        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl border border-brand/30 text-brand text-sm hover:bg-brand/5 flex-1 sm:flex-initial min-w-0"
      >
        <ReceiptText className="w-4 h-4" />
        Generar factura
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-xl border border-red-900/60 text-red-600 text-sm hover:bg-red-950/50 disabled:opacity-50 w-full sm:w-auto sm:ml-auto"
      >
        <Trash2 className="w-4 h-4" />
        Eliminar
      </button>
    </div>
  )
}
