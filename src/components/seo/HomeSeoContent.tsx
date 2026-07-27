import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/site-config'

/**
 * Contenido semántico renderizado en servidor para crawlers (Google, Bing, IA).
 * Complementa las secciones interactivas del home sin depender de JavaScript.
 */
export function HomeSeoContent() {
  return (
    <section
      aria-label="Servicios de Nixon Lopez Services en Panamá"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-slate-900"
    >
      <h2>
        {SITE_NAME} — Desarrollo web, apps móviles, SEO e inteligencia artificial en Panamá
      </h2>
      <p>
        Nixon López ofrece páginas web profesionales para negocios de servicios, tiendas online,
        marketplaces, sistemas de reservas, automatización con IA, campañas Meta Ads y Google Ads,
        y optimización SEO en la República de Panamá.
      </p>
      <ul>
        <li>Sitios web de servicios profesionales desde USD $90</li>
        <li>Desarrollo web con panel administrativo desde USD $150</li>
        <li>Tiendas online y marketplaces desde USD $200</li>
        <li>Optimización SEO para sitios web — USD $200</li>
        <li>Apps móviles, automatización con IA y publicidad digital</li>
      </ul>
      <p>
        Solicita una{' '}
        <Link href="/cotizacion">cotización online</Link> o visita{' '}
        <a href={SITE_URL}>{SITE_URL.replace(/^https:\/\//, '')}</a>.
      </p>
    </section>
  )
}
