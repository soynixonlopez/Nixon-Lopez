import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-config'
import { MASTERCLASS_EVENT } from '@/lib/masterclass'
import { buildPageMetadata } from '@/lib/seo'

const title = 'Masterclass gratuita: crea páginas web con IA'
const description =
  'Aprende a crear páginas web profesionales con inteligencia artificial. Masterclass gratuita en vivo con Nixon López. Reserva tu cupo gratis.'

export const metadata: Metadata = {
  ...buildPageMetadata({
    title,
    description,
    path: '/masterclass',
    keywords: [
      'masterclass desarrollo web',
      'crear páginas web con IA',
      'inteligencia artificial',
      'Next.js',
      'curso gratuito',
      'Nixon López',
      'desarrollo web Panamá',
    ],
    image: {
      url: '/images/nixon/masterclass_hero.webp',
      width: 1086,
      height: 1448,
      alt: 'Masterclass de desarrollo web con IA — Nixon López',
    },
  }),
  other: {
    'format-detection': 'telephone=no',
  },
}

function MasterclassEventJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: MASTERCLASS_EVENT.name,
    description,
    startDate: MASTERCLASS_EVENT.startDateIso,
    endDate: MASTERCLASS_EVENT.endDateIso,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: MASTERCLASS_EVENT.googleMeetUrl,
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
      <div className="min-h-screen scroll-pt-[4.5rem] bg-[#030712] text-white antialiased sm:scroll-pt-[4.75rem]">{children}</div>
    </>
  )
}
