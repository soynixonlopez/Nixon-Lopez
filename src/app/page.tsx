import type { Metadata } from 'next'
import Header from '@/components/Header'
import HeroSectionStatic from '@/components/HeroSectionStatic'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import HashScroll from '@/components/HashScroll'
import HomeBelowFold from '@/components/HomeBelowFold'
import { HomeSeoContent } from '@/components/seo/HomeSeoContent'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Nixon Lopez Services | Desarrollo web, IA y automatización en Panamá',
  description:
    'Páginas web profesionales, tiendas online, SEO, apps móviles y automatización con IA para negocios en Panamá. Cotización online. Nixon López — más de 5 años impulsando negocios digitales.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    type: 'website',
  },
}

export default function Home() {
  return (
    <>
      <Header />
      <HashScroll />
      <main className="min-h-screen w-full min-w-0 overflow-x-hidden">
        <HeroSectionStatic />
        <HomeSeoContent />
        <HomeBelowFold />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
