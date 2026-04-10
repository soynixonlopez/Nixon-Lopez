'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, type ReactNode } from 'react'
import LazySection from '@/components/LazySection'

const SkillsSection = dynamic(() => import('@/components/SkillsSection'), {
  ssr: false,
})
const ServicesSection = dynamic(() => import('@/components/ServicesSection'), {
  ssr: false,
})
const WhyChooseSection = dynamic(() => import('@/components/WhyChooseSection'), {
  ssr: false,
})
const AboutSection = dynamic(() => import('@/components/AboutSection'), {
  ssr: false,
})
const ProjectsSection = dynamic(() => import('@/components/ProjectsSection'), {
  ssr: false,
})
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  ssr: false,
})
const ContactSection = dynamic(() => import('@/components/ContactSection'), {
  ssr: false,
})

/**
 * Si la URL trae ancla a una sección (#projects, #contact, etc.), cargamos todo el bloque
 * para no romper altura del documento ni scroll; si no, cada sección se hidrata al acercarse al viewport.
 */
function useEagerBelowFoldForHash() {
  const [eager, setEager] = useState(false)

  useEffect(() => {
    const apply = () => {
      const raw = window.location.hash.slice(1)
      if (raw && raw !== 'hero') setEager(true)
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [])

  return eager
}

export default function HomeBelowFold() {
  const eager = useEagerBelowFoldForHash()

  const wrap = (node: ReactNode, minHeight: string) =>
    eager ? node : <LazySection minHeight={minHeight}>{node}</LazySection>

  return (
    <>
      {wrap(<SkillsSection />, 'min-h-[20rem]')}
      {wrap(<ServicesSection />, 'min-h-[28rem]')}
      {wrap(<WhyChooseSection />, 'min-h-[28rem]')}
      {wrap(<AboutSection />, 'min-h-[28rem]')}
      {wrap(<ProjectsSection />, 'min-h-[32rem]')}
      {wrap(<TestimonialsSection />, 'min-h-[24rem]')}
      {wrap(<ContactSection />, 'min-h-[28rem]')}
    </>
  )
}
