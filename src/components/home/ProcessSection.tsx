'use client'

import { HOME_PROCESS, WHATSAPP_MESSAGES, quoteUrl } from '@/lib/marketing'
import { SectionShell } from '@/components/marketing/SectionShell'

export function ProcessSection() {
  return (
    <SectionShell
      id="process"
      eyebrow="Proceso simple"
      title="De la cotización a tu web publicada, sin sorpresas"
      subtitle="Sabes qué sigue en cada paso. Contrato formal, pago en dos partes y comunicación directa conmigo."
      tone="muted"
      cta
      quoteHref={quoteUrl()}
      quoteLabel="Empezar mi cotización"
      whatsappMessage={WHATSAPP_MESSAGES.process}
      whatsappLabel="Tengo una pregunta"
    >
      <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {HOME_PROCESS.map((item) => (
          <li key={item.step} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
              {item.step}
            </span>
            <h3 className="mt-4 font-semibold text-slate-900 text-sm sm:text-base">{item.title}</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
