import Header from '@/components/Header'
import HeroSectionStatic from '@/components/HeroSectionStatic'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import HashScroll from '@/components/HashScroll'
import HomeBelowFold from '@/components/HomeBelowFold'

export default function Home() {
  return (
    <>
      <Header />
      <HashScroll />
      <main className="min-h-screen w-full min-w-0 overflow-x-hidden">
        <HeroSectionStatic />
        <HomeBelowFold />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
