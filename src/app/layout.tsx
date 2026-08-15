import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import '../styles/globals.css'
import { MetaPixel } from '@/components/analytics/MetaPixel'
import { SiteProviders } from '@/components/providers/SiteProviders'
import { SiteJsonLd } from '@/components/seo/SiteJsonLd'
import { DEFAULT_OG_IMAGE } from '@/lib/seo'
import { SITE_NAME, SITE_URL } from '@/lib/site-config'
import type { Locale } from '@/i18n/types'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

const defaultTitle =
  'Nixon Lopez Services | Desarrollo web y frontend en Panamá — Nixon López'

const defaultDescription =
  'Nixon López (Nixon Lopez Services): desarrollo web profesional, e-commerce y automatizaciones con IA en Panamá. Cotización online y atención directa.'

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION
const bingVerification = process.env.BING_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  keywords: [
    'Nixon Lopez',
    'Nixon López',
    'desarrollo web Panamá',
    'frontend developer Panamá',
    'React developer',
    'Next.js developer',
    'TypeScript developer',
    'páginas web Panamá',
    'tienda online Panamá',
  ],
  authors: [{ name: 'Nixon López', url: SITE_URL }],
  creator: 'Nixon López',
  publisher: SITE_NAME,
  category: 'technology',
  icons: {
    icon: [
      { url: '/images/favicon.png', sizes: 'any', type: 'image/png' },
      { url: '/images/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/images/favicon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/images/favicon.png',
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
    locale: 'es_PA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    creator: '@soynixonlopez',
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Sin canonical global: cada página indexable define el suyo
  ...(googleVerification || bingVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification ? { other: { 'msvalidate.01': bingVerification } } : {}),
        },
      }
    : {}),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const rawLocale = cookieStore.get('nl-locale')?.value
  const initialLocale: Locale = rawLocale === 'en' ? 'en' : 'es'

  return (
    <html lang={initialLocale === 'en' ? 'en' : 'es'} suppressHydrationWarning data-scroll-behavior="smooth" className={inter.variable}>
      <body className={`${inter.className} font-sans antialiased`} suppressHydrationWarning>
        <SiteProviders initialLocale={initialLocale}>
          <SiteJsonLd />
          <MetaPixel />

          <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
            {children}
          </div>
        </SiteProviders>
      </body>
    </html>
  )
}
