import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import HashScroll from '@/components/HashScroll'
import { HomeSeoContent } from '@/components/seo/HomeSeoContent'
import { HeroSection } from '@/components/home/HeroSection'
import { SITE_URL } from '@/lib/site-config'
import { getHomePortfolioProjects } from '@/lib/portfolio'

/** Secciones bajo el fold: HTML en SSR, JS diferido por chunk */
const ProblemSection = dynamic(() =>
  import('@/components/home/ProblemSection').then((m) => ({ default: m.ProblemSection })),
)
const BenefitsSection = dynamic(() =>
  import('@/components/home/BenefitsSection').then((m) => ({ default: m.BenefitsSection })),
)
const ServicesPreviewSection = dynamic(() =>
  import('@/components/home/ServicesPreviewSection').then((m) => ({ default: m.ServicesPreviewSection })),
)
const QuoteBannerSection = dynamic(() =>
  import('@/components/home/QuoteBannerSection').then((m) => ({ default: m.QuoteBannerSection })),
)
const CaseStudiesSection = dynamic(() =>
  import('@/components/home/CaseStudiesSection').then((m) => ({ default: m.CaseStudiesSection })),
)
const ProcessSection = dynamic(() =>
  import('@/components/home/ProcessSection').then((m) => ({ default: m.ProcessSection })),
)
const TestimonialsSection = dynamic(() =>
  import('@/components/home/TestimonialsSection').then((m) => ({ default: m.TestimonialsSection })),
)
const AiSection = dynamic(() =>
  import('@/components/home/AiSection').then((m) => ({ default: m.AiSection })),
)
const AboutSection = dynamic(() =>
  import('@/components/home/AboutSection').then((m) => ({ default: m.AboutSection })),
)
const FaqSection = dynamic(() =>
  import('@/components/home/FaqSection').then((m) => ({ default: m.FaqSection })),
)
const FinalCtaSection = dynamic(() =>
  import('@/components/home/FinalCtaSection').then((m) => ({ default: m.FinalCtaSection })),
)

export const revalidate = 120

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

export default async function Home() {
  const featuredProjects = await getHomePortfolioProjects()

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
        <CaseStudiesSection projects={featuredProjects} />
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
