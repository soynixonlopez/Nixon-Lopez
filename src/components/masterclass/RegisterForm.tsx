'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { MASTERCLASS_EVENT } from '@/lib/masterclass'
import {
  GlowOrb,
  MasterclassCta,
  MasterclassSection,
  PremiumCard,
  SectionLead,
  SectionTitle,
} from './shared'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function RegisterForm() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/masterclass/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, whatsapp, _hp: honeypot }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setErrorMsg(data.error ?? 'No se pudo completar el registro. Intenta de nuevo.')
        setState('error')
        return
      }

      if (data.alreadyRegistered) {
        setAlreadyRegistered(true)
        setState('success')
        return
      }

      setAlreadyRegistered(false)
      setState('success')
    } catch {
      setErrorMsg('Error de conexión. Verifica tu internet e intenta de nuevo.')
      setState('error')
    }
  }

  return (
    <MasterclassSection id="registro" className="scroll-mt-24 bg-[#050810]">
      <GlowOrb className="left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-neon-blue/10" />

      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <SectionTitle>Reserva tu acceso gratuito ahora</SectionTitle>
          <SectionLead className="mx-auto">
            {MASTERCLASS_EVENT.dateLabel} · {MASTERCLASS_EVENT.timeLabel} · {MASTERCLASS_EVENT.modality}
          </SectionLead>
        </div>

        <PremiumCard className="mt-10 !p-6 sm:!p-8" delay={0}>
          {state === 'success' ? (
            <div className="py-6 text-center">
              <CheckCircle className="mx-auto h-14 w-14 text-emerald-400" aria-hidden />
              <h3 className="mt-4 text-xl font-bold text-white">
                {alreadyRegistered ? '¡Ya estás registrado!' : '¡Registro confirmado!'}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {alreadyRegistered
                  ? 'Este correo ya tiene cupo reservado. Revisa tu bandeja por el enlace de WhatsApp y Google Meet.'
                  : 'Revisa tu correo: encontrarás el enlace al grupo de WhatsApp y el acceso a Google Meet.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative space-y-5">
              {/* Honeypot anti-bot — oculto para usuarios reales */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                <label htmlFor="mc-hp">No completar</label>
                <input
                  id="mc-hp"
                  name="_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="mc-nombre" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Nombre completo
                </label>
                <input
                  id="mc-nombre"
                  name="nombre"
                  type="text"
                  required
                  autoComplete="name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition-colors focus:border-neon-blue/60 focus:ring-2 focus:ring-neon-blue/20"
                />
              </div>

              <div>
                <label htmlFor="mc-email" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Correo electrónico
                </label>
                <input
                  id="mc-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition-colors focus:border-neon-blue/60 focus:ring-2 focus:ring-neon-blue/20"
                />
              </div>

              <div>
                <label htmlFor="mc-whatsapp" className="mb-1.5 block text-sm font-medium text-slate-300">
                  WhatsApp
                </label>
                <input
                  id="mc-whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+507 6000-0000"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition-colors focus:border-neon-blue/60 focus:ring-2 focus:ring-neon-blue/20"
                />
              </div>

              {state === 'error' && errorMsg && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errorMsg}
                </p>
              )}

              <MasterclassCta type="submit" disabled={state === 'loading'} className="!w-full">
                {state === 'loading' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    Enviando...
                  </>
                ) : (
                  'Quiero mi acceso gratis'
                )}
              </MasterclassCta>

              <p className="text-center text-xs text-slate-500">
                Al registrarte aceptas recibir información sobre la masterclass. Sin spam.
              </p>
            </form>
          )}
        </PremiumCard>
      </div>
    </MasterclassSection>
  )
}
