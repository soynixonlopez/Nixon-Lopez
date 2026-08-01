'use client'

import { Building2, CreditCard, Mail, MessageCircle, Smartphone } from 'lucide-react'
import {
  BOOTCAMP_HOTMART_URL,
  BOOTCAMP_PAYMENT,
  BOOTCAMP_PRICING,
  BOOTCAMP_SUPPORT,
} from '@/lib/bootcamp'
import { buildWhatsAppUrl } from '@/lib/marketing'
import { fadeUp } from './shared'
import { motion } from 'framer-motion'

const whatsappUrl = buildWhatsAppUrl(BOOTCAMP_SUPPORT.whatsappMessage)

export default function PaymentOptions() {
  return (
    <motion.div
      id="pagos"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeUp}
      className="relative mx-auto mt-10 max-w-2xl scroll-mt-24"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-neon-blue">Formas de pago</p>
        <h3 className="mt-2 text-center text-xl font-bold text-white sm:text-2xl">{BOOTCAMP_PAYMENT.altTitle}</h3>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm leading-relaxed text-slate-400">
          {BOOTCAMP_PAYMENT.altDescription}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neon-blue/30 bg-neon-blue/5 p-4 sm:col-span-1">
            <CreditCard className="mb-2 h-5 w-5 text-neon-blue" aria-hidden />
            <p className="font-bold text-white">{BOOTCAMP_PAYMENT.cardTitle}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{BOOTCAMP_PAYMENT.cardDescription}</p>
            <a
              href={BOOTCAMP_HOTMART_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs font-semibold text-neon-blue transition hover:text-white"
            >
              Ir a Hotmart →
            </a>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <Smartphone className="mb-2 h-5 w-5 text-neon-purple" aria-hidden />
            <p className="font-bold text-white">Yappy</p>
            <dl className="mt-2 space-y-1 text-xs text-slate-400">
              <div>
                <dt className="inline text-slate-500">Nombre: </dt>
                <dd className="inline font-medium text-slate-200">{BOOTCAMP_PAYMENT.yappyName}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">Teléfono: </dt>
                <dd className="inline font-medium text-slate-200">{BOOTCAMP_PAYMENT.yappyPhone}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <Building2 className="mb-2 h-5 w-5 text-neon-blue" aria-hidden />
            <p className="font-bold text-white">Transferencia</p>
            <dl className="mt-2 space-y-1 text-xs text-slate-400">
              <div>
                <dt className="inline text-slate-500">Banco: </dt>
                <dd className="inline font-medium text-slate-200">{BOOTCAMP_PAYMENT.bankName}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">Tipo: </dt>
                <dd className="inline font-medium text-slate-200">{BOOTCAMP_PAYMENT.bankAccountType}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">Titular: </dt>
                <dd className="inline font-medium text-slate-200">{BOOTCAMP_PAYMENT.bankHolder}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">Cuenta: </dt>
                <dd className="inline font-mono font-medium text-slate-200">{BOOTCAMP_PAYMENT.bankAccountNumber}</dd>
              </div>
            </dl>
          </div>
        </div>

        <ol className="mt-6 space-y-2 border-t border-white/10 pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pasos para inscribirte</p>
          {BOOTCAMP_PAYMENT.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-slate-300">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-neon-blue">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp soporte
          </a>
          <a
            href={`mailto:${BOOTCAMP_SUPPORT.email}?subject=${encodeURIComponent('Inscripción Bootcamp — pago Yappy/transferencia')}&body=${encodeURIComponent(BOOTCAMP_SUPPORT.whatsappMessage)}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-neon-blue/40 sm:w-auto"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {BOOTCAMP_SUPPORT.email}
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Monto actual: <strong className="text-slate-300">{BOOTCAMP_PRICING.priceLabel}</strong> ·{' '}
          {BOOTCAMP_PRICING.founderBadge}
        </p>
      </div>
    </motion.div>
  )
}
