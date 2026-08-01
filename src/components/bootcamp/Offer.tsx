'use client'

import { Check } from 'lucide-react'
import {
  BOOTCAMP_HOTMART_URL,
  BOOTCAMP_OFFER_INCLUDES,
  BOOTCAMP_PRICING,
} from '@/lib/bootcamp'
import { bootcampCtaLarge } from '@/lib/bootcamp-ui'
import CountdownAndSpots from './CountdownAndSpots'
import PaymentOptions from './PaymentOptions'
import {
  BootcampSection,
  GlowOrb,
  SectionLead,
  SectionTitle,
  GradientHighlight,
} from './shared'

const TIERS = [
  {
    key: 'founder',
    label: BOOTCAMP_PRICING.founderBadge,
    price: BOOTCAMP_PRICING.founderLabel,
    note: 'Ahora',
    active: true,
  },
  {
    key: 'launch',
    label: BOOTCAMP_PRICING.launchBadge,
    price: BOOTCAMP_PRICING.launchLabel,
    note: 'Después',
    active: false,
  },
  {
    key: 'regular',
    label: 'Precio regular',
    price: BOOTCAMP_PRICING.regularLabel,
    note: 'Final',
    active: false,
  },
] as const

export default function Offer() {
  return (
    <BootcampSection id="oferta" className="overflow-hidden bg-[#050810]">
      <GlowOrb className="left-1/2 top-0 h-96 w-96 -translate-x-1/2 bg-neon-blue/15" />
      <GlowOrb className="right-0 bottom-0 h-72 w-72 bg-neon-purple/10" />

      <div className="relative mx-auto max-w-2xl text-center">
        <SectionTitle>
          Ahora <GradientHighlight>{BOOTCAMP_PRICING.priceLabel}</GradientHighlight> — no esperes a pagar más
        </SectionTitle>
        <SectionLead className="mx-auto">
          {BOOTCAMP_PRICING.founderNote}. {BOOTCAMP_PRICING.progressionNote}.
        </SectionLead>
      </div>

      <div className="relative mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3">
        {TIERS.map((tier) => (
          <div
            key={tier.key}
            className={`rounded-2xl border p-3 text-center sm:p-4 ${
              tier.active ?
                'border-neon-blue/50 bg-neon-blue/10 shadow-[0_0_32px_rgba(0,212,255,0.15)] ring-1 ring-neon-blue/30'
              : 'border-white/10 bg-white/[0.02] opacity-80'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">{tier.label}</p>
            <p className={`mt-1 text-2xl font-extrabold sm:text-3xl ${tier.active ? 'text-white' : 'text-slate-400'}`}>
              {tier.price}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">{tier.note}</p>
          </div>
        ))}
      </div>

      <div className="relative mx-auto mt-8 max-w-md rounded-3xl border border-white/15 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,212,255,0.12)] backdrop-blur-sm sm:p-9">
        <ul className="space-y-2.5">
          {BOOTCAMP_OFFER_INCLUDES.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-slate-200">
              <Check className="h-4 w-4 shrink-0 text-neon-blue" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        <div className="my-8 border-t border-white/10 pt-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-neon-blue">{BOOTCAMP_PRICING.founderBadge}</p>
          <p className="mt-1 text-lg text-slate-500 line-through">{BOOTCAMP_PRICING.launchLabel}</p>
          <p className="mt-1 text-6xl font-extrabold tracking-tight text-white">{BOOTCAMP_PRICING.priceLabel}</p>
          <p className="mt-2 text-sm text-slate-400">{BOOTCAMP_PRICING.progressionNote}</p>
          <p className="mt-1 text-xs text-slate-500">
            {BOOTCAMP_PRICING.perPersonNote} · {BOOTCAMP_PRICING.installments}
          </p>
        </div>

        <div className="flex justify-center">
          <a href={BOOTCAMP_HOTMART_URL} target="_blank" rel="noopener noreferrer" className={bootcampCtaLarge}>
            Quiero inscribirme — {BOOTCAMP_PRICING.priceLabel}
          </a>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          Tarjeta en Hotmart ·{' '}
          <a href="#pagos" className="font-medium text-neon-blue underline-offset-2 hover:underline">
            Yappy o transferencia
          </a>
        </p>
      </div>

      <PaymentOptions />

      <CountdownAndSpots />
    </BootcampSection>
  )
}
