import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GeneratedLanding } from '@/components/landing/GeneratedLanding'
import {
  normalizeLandingContent,
  normalizeLandingPayment,
  type LandingPageRow,
} from '@/lib/landing-pages'
import { createClient } from '@/lib/supabase/server'
import { buildPageMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo'

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
  if (!landing) {
    return {
      title: 'Landing no encontrada',
      robots: { index: false, follow: false },
    }
  }

  const content = normalizeLandingContent(landing.content)
  const title = landing.seo_title || content.headline || landing.title
  const description =
    landing.seo_description ||
    content.subheadline ||
    `Oferta de ${landing.title} — Nixon Lopez Services`

  const imageUrl = content.hero_image_url || DEFAULT_OG_IMAGE.url

  return buildPageMetadata({
    title,
    description,
    path: `/l/${landing.slug}`,
    absoluteTitle: true,
    image: {
      url: imageUrl,
      width: DEFAULT_OG_IMAGE.width,
      height: DEFAULT_OG_IMAGE.height,
      alt: title,
    },
  })
}

export default async function PublicLandingPage({ params }: Props) {
  const { slug } = await params
  const landing = await getLanding(slug)
  if (!landing) notFound()
  return <GeneratedLanding landing={landing} />
}
