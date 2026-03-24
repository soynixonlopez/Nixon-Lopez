import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QuoteEditorClient } from '@/components/admin/QuoteEditorClient'
import { QuotePrintView } from '@/components/quote/QuotePrintView'
import { QuoteDetailToolbar } from '@/components/admin/QuoteDetailToolbar'

export default async function CotizacionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: quote, error } = await supabase.from('quotes').select('*').eq('id', id).single()

  if (error || !quote) notFound()

  const q = quote as Record<string, unknown> & {
    id: string
    client_first_name: string
    client_last_name: string
  }

  return (
    <div className="w-full max-w-[220mm] mx-auto px-2 sm:px-4 min-w-0">
      <QuoteDetailToolbar
        quoteId={q.id}
        clientName={`${q.client_first_name} ${q.client_last_name}`}
      />
      <QuotePrintView quote={q as never} />
      <div className="print:hidden mt-10 border-t border-slate-800 pt-8" id="editar-cotizacion">
        <QuoteEditorClient quote={quote as never} />
      </div>
    </div>
  )
}
