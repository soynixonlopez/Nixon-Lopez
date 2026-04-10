import type { Metadata, Viewport } from 'next'
import '../styles/globals.css'
import { SiteJsonLd } from '@/components/seo/SiteJsonLd'
import { SITE_URL } from '@/lib/site-config'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover', /* permite safe-area-inset en dispositivos con notch */
}

const defaultTitle =
  'NL Services | Desarrollo web, IA y automatización — Nixon López | Panamá'

const defaultDescription =
  'NL Services: desarrollo web profesional, ChatBots, e-commerce y automatizaciones con inteligencia artificial en Panamá. Nixon López — más de 5 años creando soluciones digitales para negocios. Cotización online.'

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | NL Services`,
  },
  description: defaultDescription,
  keywords: [
    'NL Services',
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
  publisher: 'NL Services',
  category: 'technology',
  icons: {
    icon: [
      { url: '/images/faviconweb.png', type: 'image/png' },
    ],
    apple: [{ url: '/images/faviconweb.png', type: 'image/png' }],
    shortcut: '/images/faviconweb.png',
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: SITE_URL,
    siteName: 'NL Services',
    images: [
      {
        url: '/images/logonlservices.png',
        width: 1200,
        height: 630,
        alt: 'NL Services — logo oficial',
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
    images: ['/images/logonlservices.png'],
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
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth" className={inter.variable}>
      <body className="font-sans antialiased">
        <SiteJsonLd />
        <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-hidden bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  )
}
