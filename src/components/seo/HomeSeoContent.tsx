import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/site-config'

export function HomeSeoContent() {
  return (
    <section
      aria-label="Servicios de Nixon Lopez Services en Panamá"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-slate-900"
    >
      <h2>{SITE_NAME} — Más clientes para tu negocio con una web profesional en Panamá</h2>
      <p>
        Nixon López ayuda a dueños de negocio en Panamá a conseguir más consultas y ventas con páginas web
        profesionales, tiendas online y sistemas a medida. Cotización automática en minutos, contrato formal y
        atención directa por WhatsApp.
      </p>
      <ul>
        <li>Página web profesional para captar clientes desde Google y WhatsApp</li>
        <li>Tienda online para vender productos las 24 horas</li>
        <li>Software a medida, SEO, apps móviles y automatización</li>
      </ul>
      <p>
        <Link href="/cotizacion">Obtener cotización gratis</Link> en {SITE_URL}
      </p>
    </section>
  )
}
