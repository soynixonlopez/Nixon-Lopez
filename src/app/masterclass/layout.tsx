import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'
import { MASTERCLASS_EVENT } from '@/lib/masterclass'

const title = 'Masterclass Gratuita: Crea páginas web con IA'
const description =
  'Aprende a crear páginas web profesionales con Inteligencia Artificial. Masterclass gratuita en vivo — sábado 1 de agosto, 10:00 AM. Reserva tu cupo gratis.'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'masterclass desarrollo web',
    'crear páginas web con IA',
    'inteligencia artificial',
    'Next.js',
    'React',
    'curso gratuito',
    'Nixon López',
    'desarrollo web Panamá',
  ],
  alternates: {
    canonical: `${SITE_URL}/masterclass`,
  },
  openGraph: {
    title: `${title} | Nixon Lopez Services`,
    description,
    url: `${SITE_URL}/masterclass`,
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/images/logoweb.png',
        width: 1306,
        height: 199,
        alt: 'Masterclass — Nixon López',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: { index: true, follow: true },
}

function MasterclassEventJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: MASTERCLASS_EVENT.name,
    description,
    startDate: '2026-08-01T10:00:00-05:00',
    endDate: '2026-08-01T12:00:00-05:00',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: `${SITE_URL}/masterclass`,
    },
    organizer: {
      '@type': 'Person',
      name: 'Nixon López',
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/masterclass#registro`,
    },
    isAccessibleForFree: true,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function MasterclassLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MasterclassEventJsonLd />
      <div className="min-h-screen bg-[#030712] text-white antialiased">{children}</div>
    </>
  )
}
