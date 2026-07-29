import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { HOME_FAQ } from '@/lib/marketing'
import { SITE_NAME, SITE_NAME_FULL, SITE_URL } from '@/lib/site-config'

const orgId = `${SITE_URL}/#organization`
const siteId = `${SITE_URL}/#website`
const localBusinessId = `${SITE_URL}/#localbusiness`

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: SITE_NAME,
      alternateName: ['Nixon López', 'Nixon Lopez', 'Nixon López — desarrollo web'],
      url: SITE_URL,
      logo: `${SITE_URL}/images/logoweb.png`,
      image: `${SITE_URL}/images/logoweb.png`,
      description: SITE_NAME_FULL,
      email: INVOICE_BRANDING.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle 50, Edificio Mirador 50',
        addressLocality: 'Panama City',
        addressRegion: 'Panamá',
        addressCountry: 'PA',
      },
      founder: {
        '@type': 'Person',
        name: INVOICE_BRANDING.signatoryLegalName,
        alternateName: 'Nixon López',
        jobTitle: 'Desarrollador web',
        url: SITE_URL,
      },
      sameAs: [
        'https://www.instagram.com/nixondev.ai/',
        'https://github.com/soynixonlopez',
        'https://facebook.com/soynixonlopez',
        'https://tiktok.com/@soynixonlopez',
        'https://www.youtube.com/@soynixonlopez',
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': localBusinessId,
      name: SITE_NAME,
      description: SITE_NAME_FULL,
      url: SITE_URL,
      image: `${SITE_URL}/images/logoweb.png`,
      telephone: '+507-6825-2312',
      email: INVOICE_BRANDING.email,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle 50, Edificio Mirador 50',
        addressLocality: 'Panama City',
        addressRegion: 'Panamá',
        addressCountry: 'PA',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Panamá',
      },
      knowsAbout: [
        'Desarrollo web',
        'E-commerce',
        'SEO',
        'Automatización con inteligencia artificial',
        'Apps móviles',
        'Meta Ads',
        'Google Ads',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_NAME_FULL,
      publisher: { '@id': orgId },
      inLanguage: 'es-PA',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/cotizacion`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: SITE_NAME,
      url: SITE_URL,
      provider: { '@id': orgId },
      areaServed: 'Panamá',
      serviceType: [
        'Desarrollo web',
        'Diseño de sitios web',
        'Tiendas online',
        'Optimización SEO',
        'Automatización con IA',
        'Desarrollo de apps móviles',
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: HOME_FAQ.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
}

export function SiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
