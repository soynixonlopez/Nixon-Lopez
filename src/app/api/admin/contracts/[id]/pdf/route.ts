import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/admin-constants'
import {
  buildClientDocumentFilename,
  contentDispositionAttachment,
  contentDispositionInline,
} from '@/lib/document-filename'
import { generateContractPdfBuffer } from '@/lib/pdf/generateContractPdf'
import type { ServiceContractRecord } from '@/lib/types/contract'

function companyFromTerms(terms: ServiceContractRecord['terms_payload']): string | null {
  if (!terms || typeof terms !== 'object') return null
  const client = (terms as Record<string, unknown>).client
  if (client && typeof client === 'object' && !Array.isArray(client)) {
    const empresa = (client as Record<string, unknown>).empresa
    if (typeof empresa === 'string' && empresa.trim()) return empresa.trim()
  }
  const company = (terms as Record<string, unknown>).company
  return typeof company === 'string' && company.trim() ? company.trim() : null
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data, error } = await supabase.from('service_contracts').select('*').eq('id', id).single()
  if (error || !data) {
    return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 })
  }

  let pdfBuffer: Uint8Array
  try {
    pdfBuffer = await generateContractPdfBuffer(data as ServiceContractRecord)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'No se pudo generar el PDF' }, { status: 500 })
  }

  const url = new URL(request.url)
  const download = url.searchParams.get('download') === '1'
  const contract = data as ServiceContractRecord
  const filename = buildClientDocumentFilename({
    kind: 'Contrato',
    clientName: contract.client_name,
    company: companyFromTerms(contract.terms_payload),
    ref: contract.contract_number,
  })

  return new NextResponse(Buffer.from(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': download
        ? contentDispositionAttachment(filename)
        : contentDispositionInline(filename),
      'Cache-Control': 'private, no-store',
    },
  })
}
