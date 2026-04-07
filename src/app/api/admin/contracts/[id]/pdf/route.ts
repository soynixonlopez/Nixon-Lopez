import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/admin-constants'
import { generateContractPdfBuffer } from '@/lib/pdf/generateContractPdf'
import type { ServiceContractRecord } from '@/lib/types/contract'

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
  const safeName = contract.contract_number.replace(/[^\w.-]+/g, '_')

  return new NextResponse(Buffer.from(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': download
        ? `attachment; filename="${safeName}.pdf"`
        : `inline; filename="${safeName}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
