import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'

/** Evita HTML estático en caché desalineado con el cliente (p. ej. tras cambios en Header). */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cotización online | NL Services — sitios web y automatización',
  description:
    'Solicita una cotización para tu web, tienda online o automatizaciones con IA. NL Services — desarrollo web profesional en Panamá. Precios transparentes.',
  keywords: [
    'cotización web Panamá',
    'presupuesto página web',
    'NL Services',
    'desarrollo web',
    'automatización IA',
  ],
  alternates: { canonical: `${SITE_URL}/cotizacion` },
  openGraph: {
    title: 'Cotización online | NL Services',
    description:
      'Calcula y solicita tu presupuesto para desarrollo web, e-commerce y automatizaciones.',
    url: `${SITE_URL}/cotizacion`,
    siteName: 'NL Services',
    locale: 'es_ES',
    type: 'website',
    images: [{ url: '/images/logonlservices.png', alt: 'NL Services logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cotización online | NL Services',
    description: 'Presupuesto web y automatizaciones — NL Services',
  },
  robots: { index: true, follow: true },
}

export default function CotizacionLayout({ children }: { children: React.ReactNode }) {
  return children
}
