import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { HOME_IMAGES } from '@/lib/marketing'
import { WHATSAPP_E164 } from '@/lib/site-contact'
import {
  SITE_NAME,
  SITE_NAME_FULL,
  SITE_SAME_AS,
  SITE_URL,
} from '@/lib/site-config'

const orgId = `${SITE_URL}/#organization`
const personId = `${SITE_URL}/#person`
const siteId = `${SITE_URL}/#website`
const serviceId = `${SITE_URL}/#service`

const personName = 'Nixon López'
const personLegalName = INVOICE_BRANDING.signatoryLegalName
const logoUrl = `${SITE_URL}/images/logooficial.png`
const imageUrl = `${SITE_URL}${HOME_IMAGES.og}`
const telephone = `+${WHATSAPP_E164}`

/**
 * Schema global (todas las páginas públicas).
 * FAQPage vive solo en HomeFaqJsonLd (home con FAQ visible).
 */
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': personId,
      name: personName,
      alternateName: [personLegalName, 'Nixon Lopez'],
      url: SITE_URL,
      image: imageUrl,
      jobTitle: 'Desarrollador web',
      description:
        'Desarrollador web en Panamá especializado en sitios profesionales, e-commerce y automatización con IA.',
      worksFor: { '@id': orgId },
      sameAs: [...SITE_SAME_AS],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Panama City',
        addressRegion: 'Panamá',
        addressCountry: 'PA',
      },
    },
    {
      '@type': 'Organization',
      '@id': orgId,
      name: SITE_NAME,
      alternateName: [personName, 'Nixon Lopez'],
      url: SITE_URL,
      logo: logoUrl,
      image: imageUrl,
      description: SITE_NAME_FULL,
      email: INVOICE_BRANDING.email,
      founder: { '@id': personId },
      sameAs: [...SITE_SAME_AS],
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${INVOICE_BRANDING.addressLine1}, ${INVOICE_BRANDING.addressLine2}`,
        addressLocality: 'Panama City',
        addressRegion: 'Panamá',
        addressCountry: 'PA',
      },
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_NAME_FULL,
      inLanguage: 'es-PA',
      publisher: { '@id': orgId },
      author: { '@id': personId },
    },
    {
      '@type': 'ProfessionalService',
      '@id': serviceId,
      name: SITE_NAME,
      url: SITE_URL,
      image: imageUrl,
      description: SITE_NAME_FULL,
      telephone,
      email: INVOICE_BRANDING.email,
      provider: { '@id': personId },
      areaServed: {
        '@type': 'Country',
        name: 'Panamá',
      },
      serviceType: [
        'Desarrollo web',
        'Diseño de sitios web',
        'Tiendas online',
        'Optimización SEO',
        'Automatización con IA',
      ],
      sameAs: [...SITE_SAME_AS],
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
