'use client'

import Image from 'next/image'
import { Github, Instagram, Linkedin } from 'lucide-react'
import { BOOTCAMP_INSTRUCTOR } from '@/lib/bootcamp'
import {
  BootcampSection,
  GlowOrb,
  PremiumCard,
  SectionCta,
  SectionLead,
  SectionTitle,
} from './shared'
import instructorPhoto from '../../../public/images/nixon/masterclass_about.webp'

const SOCIAL = { Instagram, LinkedIn: Linkedin, GitHub: Github } as const

export default function Instructor() {
  return (
    <BootcampSection id="instructor" className="bg-[#050810]">
      <GlowOrb className="right-1/4 top-1/2 h-80 w-80 -translate-y-1/2 bg-neon-purple/10" />

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="order-2 lg:order-1">
          <SectionTitle>{BOOTCAMP_INSTRUCTOR.name}</SectionTitle>
          <p className="mt-2 text-lg font-medium text-neon-blue">{BOOTCAMP_INSTRUCTOR.role}</p>
          <SectionLead>{BOOTCAMP_INSTRUCTOR.bio}</SectionLead>

          <PremiumCard className="mt-6 !p-4">
            <div className="flex flex-wrap gap-2">
              {BOOTCAMP_INSTRUCTOR.tech.map((t) => (
                <span key={t} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
                  {t}
                </span>
              ))}
            </div>
          </PremiumCard>

          <div className="mt-4 flex flex-wrap gap-2">
            {BOOTCAMP_INSTRUCTOR.social.map((s) => {
              const Icon = SOCIAL[s.label as keyof typeof SOCIAL]
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300 transition hover:border-neon-blue/40"
                >
                  <Icon className="h-4 w-4 text-neon-blue" aria-hidden />
                  {s.handle}
                </a>
              )
            })}
          </div>

          <SectionCta className="justify-center" />
        </div>

        <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
          <div aria-hidden className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-neon-blue/25 to-neon-purple/25 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_24px_64px_rgba(0,0,0,0.55)]">
            <Image
              src={instructorPhoto}
              alt={`${BOOTCAMP_INSTRUCTOR.name} — instructor`}
              width={instructorPhoto.width}
              height={instructorPhoto.height}
              quality={80}
              className="h-auto w-full object-contain"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
        </div>
      </div>
    </BootcampSection>
  )
}
