import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import HashScroll from '@/components/HashScroll'
import { HomeSeoContent } from '@/components/seo/HomeSeoContent'
import { HeroSection } from '@/components/home/HeroSection'
import { ProblemSection } from '@/components/home/ProblemSection'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { ServicesPreviewSection } from '@/components/home/ServicesPreviewSection'
import { QuoteBannerSection } from '@/components/home/QuoteBannerSection'
import { CaseStudiesSection } from '@/components/home/CaseStudiesSection'
import { ProcessSection } from '@/components/home/ProcessSection'
import { AiSection } from '@/components/home/AiSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { AboutSection } from '@/components/home/AboutSection'
import { FaqSection } from '@/components/home/FaqSection'
import { FinalCtaSection } from '@/components/home/FinalCtaSection'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Nixon Lopez Services | Páginas web que consiguen más clientes en Panamá',
  description:
    'Estudio digital en Panamá: páginas web profesionales, tiendas online y software a medida. Cotización automática en minutos. Más clientes, más ventas.',
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
      <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-white">
        <HeroSection />
        <HomeSeoContent />
        <ProblemSection />
        <BenefitsSection />
        <ServicesPreviewSection />
        <QuoteBannerSection />
        <CaseStudiesSection />
        <ProcessSection />
        <TestimonialsSection />
        <AiSection />
        <AboutSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
