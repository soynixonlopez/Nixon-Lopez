import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import '../styles/globals.css'
import { MetaPixel } from '@/components/analytics/MetaPixel'
import { SiteProviders } from '@/components/providers/SiteProviders'
import { SiteJsonLd } from '@/components/seo/SiteJsonLd'
import { SITE_URL } from '@/lib/site-config'
import { HOME_IMAGES } from '@/lib/marketing'
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
  viewportFit: 'cover', /* permite safe-area-inset en dispositivos con notch */
}

const defaultTitle =
  'Nixon Lopez Services | Desarrollo web, IA y automatización — Nixon López | Panamá'

const defaultDescription =
  'Nixon Lopez Services: desarrollo web profesional, ChatBots, e-commerce y automatizaciones con inteligencia artificial en Panamá. Nixon López — más de 5 años creando soluciones digitales para negocios. Cotización online.'

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION
const bingVerification = process.env.BING_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | Nixon Lopez Services`,
  },
  description: defaultDescription,
  keywords: [
    'Nixon Lopez Services',
    'desarrollo web Panamá',
    'páginas web Panamá',
    'crear página web Panamá',
    'diseño web Panamá',
    'tienda online Panamá',
    'SEO Panamá',
    'inteligencia artificial Panamá',
    'chatbots WhatsApp',
    'automatización negocios',
    'Nixon López',
    'nixonlopez.com',
    'e-commerce Panamá',
    'sitio web profesional',
    'desarrollador web Panamá',
  ],
  authors: [{ name: 'Nixon López', url: SITE_URL }],
  creator: 'Nixon López',
  publisher: 'Nixon Lopez Services',
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
    siteName: 'Nixon Lopez Services',
    images: [
      {
        url: HOME_IMAGES.og,
        width: HOME_IMAGES.heroWidth,
        height: HOME_IMAGES.heroHeight,
        alt: 'Nixon López — desarrollo web e IA en Panamá',
      },
    ],
    locale: 'es_PA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    creator: '@soynixonlopez',
    images: [HOME_IMAGES.og],
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
  alternates: {
    canonical: SITE_URL,
  },
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
    <html lang={initialLocale} suppressHydrationWarning data-scroll-behavior="smooth" className={inter.variable}>
      <body className={`${inter.className} font-sans antialiased`} suppressHydrationWarning>
        <SiteProviders initialLocale={initialLocale}>
          <SiteJsonLd />
          <MetaPixel />

          <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-hidden bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
            {children}
          </div>
        </SiteProviders>
      </body>
    </html>
  )
}
