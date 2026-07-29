'use client'

import { Sparkles } from 'lucide-react'
import { WHATSAPP_MESSAGES, quoteUrl } from '@/lib/marketing'
import { SectionShell } from '@/components/marketing/SectionShell'

const AI_POINTS = [
  'Entregamos en menos tiempo sin sacrificar calidad ni atención personalizada.',
  'Automatizamos lo repetitivo para que tu proyecto avance más rápido.',
  'Tú hablas con Nixon en todo momento — la IA acelera, no reemplaza.',
  'Más eficiencia para ti significa precios justos y entregas ágiles.',
] as const

export function AiSection() {
  return (
    <SectionShell
      id="ai"
      eyebrow="Velocidad sin atajos"
      title="Usamos IA para que tu proyecto esté listo antes — sin perder calidad"
      subtitle="La tecnología nos ayuda a trabajar más rápido. Las decisiones importantes y la relación contigo siguen siendo humanas."
      cta
      quoteHref={quoteUrl()}
      quoteLabel="Quiero empezar pronto"
      whatsappMessage={WHATSAPP_MESSAGES.default}
      whatsappLabel="Cuéntame más"
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
          <div className="rounded-xl bg-brand p-3 text-white shrink-0">
            <Sparkles className="h-6 w-6" aria-hidden />
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {AI_POINTS.map((point) => (
              <li key={point} className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  )
}
