import { notFound } from 'next/navigation'
import { LandingEditorClient } from '@/components/admin/LandingEditorClient'
import {
  normalizeLandingContent,
  normalizeLandingPayment,
  type LandingPageRow,
} from '@/lib/landing-pages'
import { createClient } from '@/lib/supabase/server'

export default async function EditLandingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('landing_pages').select('*').eq('id', id).single()

  if (error || !data) notFound()

  const landing: LandingPageRow = {
    ...data,
    price_amount: Number(data.price_amount ?? 0),
    content: normalizeLandingContent(data.content),
    payment: normalizeLandingPayment(data.payment),
  }

  return <LandingEditorClient landing={landing} />
}
