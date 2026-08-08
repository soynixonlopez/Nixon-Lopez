import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GeneratedLanding } from '@/components/landing/GeneratedLanding'
import {
  normalizeLandingContent,
  normalizeLandingPayment,
  type LandingPageRow,
} from '@/lib/landing-pages'
import { createClient } from '@/lib/supabase/server'

type Props = { params: Promise<{ slug: string }> }

async function getLanding(slug: string): Promise<LandingPageRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error || !data) return null

  return {
    ...data,
    price_amount: Number(data.price_amount ?? 0),
    content: normalizeLandingContent(data.content),
    payment: normalizeLandingPayment(data.payment),
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const landing = await getLanding(slug)
  if (!landing) return { title: 'Landing' }
  const content = normalizeLandingContent(landing.content)
  return {
    title: landing.seo_title || content.headline || landing.title,
    description: landing.seo_description || content.subheadline,
    openGraph: content.hero_image_url
      ? { images: [{ url: content.hero_image_url }] }
      : undefined,
  }
}

export default async function PublicLandingPage({ params }: Props) {
  const { slug } = await params
  const landing = await getLanding(slug)
  if (!landing) notFound()
  return <GeneratedLanding landing={landing} />
}
