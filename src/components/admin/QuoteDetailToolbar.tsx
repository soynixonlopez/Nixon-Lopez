'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Printer, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  quoteId: string
  clientName: string
}

export function QuoteDetailToolbar({ quoteId, clientName }: Props) {
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

  return (
    <div className="print:hidden no-print flex flex-wrap items-center gap-2 mb-6">
      <Link
        href="/admin/cotizaciones"
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
      <a
        href="#editar-cotizacion"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-600 text-slate-200 text-sm hover:bg-slate-800"
      >
        <Pencil className="w-4 h-4" />
        Editar datos
      </a>
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
  )
}
