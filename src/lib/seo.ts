import type { Metadata } from 'next'
import { HOME_IMAGES } from '@/lib/marketing'
import { SITE_NAME, absoluteUrl } from '@/lib/site-config'

export const DEFAULT_OG_IMAGE = {
  url: HOME_IMAGES.og,
  width: HOME_IMAGES.heroWidth,
  height: HOME_IMAGES.heroHeight,
  alt: 'Nixon López — desarrollo web e IA en Panamá',
} as const

type BuildPageMetadataInput = {
  title: string
  description: string
  path: string
  /** Si true, el title no usa el template del layout */
  absoluteTitle?: boolean
  keywords?: string[]
  image?: {
    url: string
    width?: number
    height?: number
    alt?: string
  }
  noIndex?: boolean
}

/** Metadata por página con canonical, OG y Twitter alineados al dominio www. */
export function buildPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  keywords,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const ogImage = {
    url: image.url.startsWith('http') ? image.url : image.url,
    width: image.width ?? DEFAULT_OG_IMAGE.width,
    height: image.height ?? DEFAULT_OG_IMAGE.height,
    alt: image.alt ?? DEFAULT_OG_IMAGE.alt,
  }

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'es_PA',
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  }
}
