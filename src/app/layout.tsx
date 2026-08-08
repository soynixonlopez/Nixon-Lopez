import type { Metadata, Viewport } from 'next'
import '../styles/globals.css'
import { MetaPixel } from '@/components/analytics/MetaPixel'
import { SiteProviders } from '@/components/providers/SiteProviders'
import { SiteJsonLd } from '@/components/seo/SiteJsonLd'
import { SITE_URL } from '@/lib/site-config'
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
    'inteligencia artificial',
    'chatbots',
    'automatización negocios',
    'Nixon López',
    'nixoncodes.ai',
    'e-commerce',
    'sitio web profesional',
    'desarrollador web',
    'IT services Panamá',
  ],
  authors: [{ name: 'Nixon López', url: SITE_URL }],
  creator: 'Nixon López',
  publisher: 'Nixon Lopez Services',
  category: 'technology',
  icons: {
    icon: [
      { url: '/images/faviconweb-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-apple.png', sizes: '180x180', type: 'image/png' },
    ],
    apple: [{ url: '/images/favicon-apple.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/images/faviconweb-32.png',
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: SITE_URL,
    siteName: 'Nixon Lopez Services',
    images: [
      {
        url: '/images/logoweb.png',
        width: 1306,
        height: 199,
        alt: 'Nixon López — logo',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    creator: '@soynixonlopez',
    images: ['/images/logoweb.png'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth" className={inter.variable}>
      <body className={`${inter.className} font-sans antialiased`}>
        <SiteProviders>
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
