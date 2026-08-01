import type { Metadata } from 'next'
import { BOOTCAMP_META, BOOTCAMP_PRICING, BOOTCAMP_HOTMART_URL } from '@/lib/bootcamp'
import { SITE_URL } from '@/lib/site-config'

const { title, description, keywords } = BOOTCAMP_META

export const metadata: Metadata = {
  title,
  description,
  keywords: [...keywords],
  alternates: {
    canonical: `${SITE_URL}/bootcamp`,
  },
  other: {
    'format-detection': 'telephone=no',
  },
  openGraph: {
    title: `${title} | Nixon Lopez Services`,
    description,
    url: `${SITE_URL}/bootcamp`,
    type: 'website',
    locale: 'es_ES',
    siteName: 'Nixon Lopez Services',
    images: [
      {
        url: '/images/nixon/masterclass_hero.webp',
        width: 1086,
        height: 1448,
        alt: 'Bootcamp de desarrollo web con IA — Nixon López',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/nixon/masterclass_hero.webp'],
  },
  robots: { index: true, follow: true },
}

function BootcampCourseJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    provider: {
      '@type': 'Person',
      name: 'Nixon López',
      url: SITE_URL,
    },
    url: `${SITE_URL}/bootcamp`,
    image: `${SITE_URL}/images/nixon/masterclass_hero.webp`,
    inLanguage: 'es',
    courseMode: 'online',
    educationalLevel: 'Beginner',
    teaches: [
      'Desarrollo web con Inteligencia Artificial',
      'Landing pages profesionales',
      'Next.js y Vercel',
      'Freelance y captación de clientes',
    ],
    offers: {
      '@type': 'Offer',
      category: 'Paid',
      price: BOOTCAMP_PRICING.price,
      priceCurrency: BOOTCAMP_PRICING.currency,
      url: BOOTCAMP_HOTMART_URL,
      availability: 'https://schema.org/InStock',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT6W',
    },
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  )
}

export default function BootcampLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="dns-prefetch" href="https://pay.hotmart.com" />
      <link rel="preconnect" href="https://pay.hotmart.com" crossOrigin="anonymous" />
      <BootcampCourseJsonLd />
      <div className="min-h-screen scroll-pt-[4.5rem] bg-[#030712] text-white antialiased sm:scroll-pt-[4.75rem]">
        {children}
      </div>
    </>
  )
}
