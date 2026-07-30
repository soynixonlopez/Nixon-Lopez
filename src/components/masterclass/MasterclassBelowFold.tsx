'use client'

import dynamic from 'next/dynamic'
import { type ReactNode } from 'react'
import LazySection from '@/components/LazySection'

const Benefits = dynamic(() => import('@/components/masterclass/Benefits'))
const Learning = dynamic(() => import('@/components/masterclass/Learning'))
const Instructor = dynamic(() => import('@/components/masterclass/Instructor'))
const Projects = dynamic(() => import('@/components/masterclass/Projects'))
const RegisterForm = dynamic(() => import('@/components/masterclass/RegisterForm'))
const CTA = dynamic(() => import('@/components/masterclass/CTA'))

function wrap(node: ReactNode, minHeight: string) {
  return <LazySection minHeight={minHeight}>{node}</LazySection>
}

/** Secciones bajo el pliegue: se hidratan al acercarse al viewport (menos JS inicial). */
export default function MasterclassBelowFold() {
  return (
    <>
      {wrap(<Benefits />, 'min-h-[28rem]')}
      {wrap(<Learning />, 'min-h-[32rem]')}
      {wrap(<Instructor />, 'min-h-[32rem]')}
      {wrap(<Projects />, 'min-h-[28rem]')}
      {wrap(<RegisterForm />, 'min-h-[24rem]')}
      {wrap(<CTA />, 'min-h-[16rem]')}
    </>
  )
}
