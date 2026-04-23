import { SITE_NAME, SITE_NAME_FULL, SITE_URL } from '@/lib/site-config'

const orgId = `${SITE_URL}/#organization`
const siteId = `${SITE_URL}/#website`

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: SITE_NAME,
      alternateName: ['Nixon López', 'Nixon López — desarrollo web'],
      url: SITE_URL,
      logo: `${SITE_URL}/images/logoweb.png`,
      image: `${SITE_URL}/images/logoweb.png`,
      description: SITE_NAME_FULL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle 50, Edificio Mirador 50',
        addressLocality: 'Panama City',
        addressCountry: 'PA',
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
      '@type': 'WebSite',
      '@id': siteId,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_NAME_FULL,
      publisher: { '@id': orgId },
      inLanguage: 'es-PA',
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
