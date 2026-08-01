'use client'

import dynamic from 'next/dynamic'
import LazySection from '@/components/LazySection'

const TrustBar = dynamic(() => import('./TrustBar'))
const Audience = dynamic(() => import('./Audience'))
const Problem = dynamic(() => import('./Problem'))
const Outcomes = dynamic(() => import('./Outcomes'))
const Curriculum = dynamic(() => import('./Curriculum'))
const Bonuses = dynamic(() => import('./Bonuses'))
const Instructor = dynamic(() => import('./Instructor'))
const Testimonials = dynamic(() => import('./Testimonials'))
const FAQ = dynamic(() => import('./FAQ'))
const Offer = dynamic(() => import('./Offer'))

export default function BootcampBelowFold() {
  return (
    <>
      <LazySection minHeight="min-h-[8rem]">
        <TrustBar />
      </LazySection>
      <LazySection minHeight="min-h-[28rem]">
        <Audience />
      </LazySection>
      <LazySection minHeight="min-h-[24rem]">
        <Problem />
      </LazySection>
      <LazySection minHeight="min-h-[24rem]">
        <Outcomes />
      </LazySection>
      <LazySection minHeight="min-h-[32rem]">
        <Curriculum />
      </LazySection>
      <LazySection minHeight="min-h-[24rem]">
        <Bonuses />
      </LazySection>
      <LazySection minHeight="min-h-[28rem]">
        <Instructor />
      </LazySection>
      <LazySection minHeight="min-h-[20rem]">
        <Testimonials />
      </LazySection>
      <LazySection minHeight="min-h-[24rem]">
        <FAQ />
      </LazySection>
      <LazySection minHeight="min-h-[28rem]">
        <Offer />
      </LazySection>
    </>
  )
}
