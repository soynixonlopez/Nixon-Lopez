import type { Metadata } from 'next'
import { HOME_IMAGES } from '@/lib/marketing'
import { SITE_URL } from '@/lib/site-config'

/** Evita HTML estático en caché desalineado con el cliente (p. ej. tras cambios en Header). */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cotizador de proyectos | Nixon Lopez Services',
  description:
    'Configura tu proyecto y descubre cuánto cuesta en menos de 2 minutos. Cotización transparente para sitios web, tiendas online y sistemas a medida en Panamá.',
  keywords: [
    'cotización web Panamá',
    'presupuesto página web',
    'cotizador web',
    'Nixon Lopez Services',
    'desarrollo web',
    'tienda online Panamá',
  ],
  alternates: { canonical: `${SITE_URL}/cotizacion` },
  openGraph: {
    title: 'Cotizador de proyectos | Nixon Lopez Services',
    description:
      'Configura tu proyecto y recibe una inversión estimada con precio transparente.',
    url: `${SITE_URL}/cotizacion`,
    siteName: 'Nixon Lopez Services',
    locale: 'es_PA',
    type: 'website',
    images: [
      {
        url: HOME_IMAGES.og,
        width: HOME_IMAGES.heroWidth,
        height: HOME_IMAGES.heroHeight,
        alt: 'Cotizador de proyectos — Nixon Lopez Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cotizador de proyectos | Nixon Lopez Services',
    description: 'Configura tu proyecto y recibe un precio estimado transparente.',
    images: [HOME_IMAGES.og],
  },
  robots: { index: true, follow: true },
}

export default function CotizacionLayout({ children }: { children: React.ReactNode }) {
  return children
}
