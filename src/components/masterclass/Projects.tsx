'use client'

import { MASTERCLASS_PROJECTS } from '@/lib/masterclass'
import { ProjectCarousel } from '@/components/marketing/ProjectCarousel'
import {
  GlowOrb,
  MasterclassSection,
  SectionBadge,
  SectionLead,
  SectionTitle,
} from './shared'

export default function Projects() {
  return (
    <MasterclassSection id="proyectos" className="bg-[#070d18]">
      <GlowOrb className="left-1/3 top-0 h-72 w-72 bg-neon-blue/10" />

      <div className="text-center">
        <SectionBadge>Portafolio</SectionBadge>
        <SectionTitle>Proyectos reales desarrollados</SectionTitle>
        <SectionLead className="mx-auto">
          Sitios y plataformas construidos con tecnologías modernas — el mismo enfoque que verás en la
          masterclass.
        </SectionLead>
      </div>

      <div className="mt-10 sm:mt-14">
        <ProjectCarousel projects={MASTERCLASS_PROJECTS} theme="dark" />
      </div>
    </MasterclassSection>
  )
}
