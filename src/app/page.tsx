import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import HashScroll from '@/components/HashScroll'
import { HomeSeoContent } from '@/components/seo/HomeSeoContent'
import { HeroSection } from '@/components/home/HeroSection'
import { ProblemSection } from '@/components/home/ProblemSection'
import { QuoteBannerSection } from '@/components/home/QuoteBannerSection'
import { HomeFaqJsonLd } from '@/components/seo/HomeFaqJsonLd'
import { BlogPreviewSection } from '@/components/home/BlogPreviewSection'
import { buildPageMetadata } from '@/lib/seo'
import { getHomePortfolioProjects } from '@/lib/portfolio'

/** Secciones bajo el fold: HTML en SSR, JS diferido por chunk */
const BenefitsSection = dynamic(() =>
  import('@/components/home/BenefitsSection').then((m) => ({ default: m.BenefitsSection })),
)
const ServicesPreviewSection = dynamic(() =>
  import('@/components/home/ServicesPreviewSection').then((m) => ({ default: m.ServicesPreviewSection })),
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

export const metadata: Metadata = buildPageMetadata({
  title: 'Nixon Lopez Services | Páginas web que consiguen más clientes en Panamá',
  description:
    'Desarrollo web en Panamá: páginas profesionales, tiendas online, SEO y automatización con IA. Cotización en minutos. Atención directa con Nixon López.',
  path: '/',
  absoluteTitle: true,
})

export default async function Home() {
  const featuredProjects = await getHomePortfolioProjects()

  return (
    <>
      <HomeFaqJsonLd />
      <Header />
      <HashScroll />
      <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-white dark:bg-slate-950">
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
        <BlogPreviewSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
