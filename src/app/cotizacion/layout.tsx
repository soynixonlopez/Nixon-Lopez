import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

/** Evita HTML estático en caché desalineado con el cliente (p. ej. tras cambios en Header). */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata({
  title: 'Cotizador de proyectos',
  description:
    'Configura tu proyecto y descubre cuánto cuesta en menos de 2 minutos. Cotización transparente para sitios web, tiendas online y sistemas a medida en Panamá.',
  path: '/cotizacion',
  keywords: [
    'cotización web Panamá',
    'presupuesto página web',
    'cotizador web',
    'desarrollo web Panamá',
  ],
})

export default function CotizacionLayout({ children }: { children: React.ReactNode }) {
  return children
}
