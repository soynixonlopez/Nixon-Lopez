'use client'

import { Building2, CreditCard, Mail, MessageCircle, Smartphone } from 'lucide-react'
import {
  BOOTCAMP_HOTMART_URL,
  BOOTCAMP_PAYMENT,
  BOOTCAMP_PRICING,
  BOOTCAMP_SUPPORT,
} from '@/lib/bootcamp'
import { buildWhatsAppUrl } from '@/lib/marketing'

const whatsappUrl = buildWhatsAppUrl(BOOTCAMP_SUPPORT.whatsappMessage)
const whatsappYappyUrl = buildWhatsAppUrl(BOOTCAMP_SUPPORT.whatsappYappyMessage)
const whatsappTransferUrl = buildWhatsAppUrl(BOOTCAMP_SUPPORT.whatsappTransferMessage)
const mailtoUrl = `mailto:${BOOTCAMP_SUPPORT.email}?subject=${encodeURIComponent('Inscripción Bootcamp — pago Yappy/transferencia')}&body=${encodeURIComponent(BOOTCAMP_SUPPORT.whatsappMessage)}`

const paymentCardClass =
  'group flex min-h-[13rem] flex-col rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue sm:p-6'

export default function PaymentOptions() {
  return (
    <div id="pagos" className="relative mx-auto mt-10 max-w-5xl scroll-mt-24">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:p-10">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-neon-blue">Formas de pago</p>
        <h3 className="mt-2 text-center text-xl font-bold text-white sm:text-2xl">{BOOTCAMP_PAYMENT.altTitle}</h3>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-relaxed text-slate-400">
          {BOOTCAMP_PAYMENT.altDescription}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <a
            href={BOOTCAMP_HOTMART_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pagar con tarjeta o débito en Hotmart"
            className={`${paymentCardClass} border-neon-blue/40 bg-neon-blue/5 hover:border-neon-blue/60 hover:bg-neon-blue/10`}
          >
            <CreditCard className="mb-3 h-5 w-5 text-neon-blue" aria-hidden />
            <p className="text-base font-bold text-white">{BOOTCAMP_PAYMENT.cardTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{BOOTCAMP_PAYMENT.cardDescription}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-neon-blue transition group-hover:text-white">
              Ir a Hotmart →
            </span>
          </a>

          <a
            href={whatsappYappyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pagar por Yappy — contactar por WhatsApp"
            className={`${paymentCardClass} border-white/10 bg-black/20 hover:border-neon-purple/40 hover:bg-neon-purple/5`}
          >
            <Smartphone className="mb-3 h-5 w-5 text-neon-purple" aria-hidden />
            <p className="text-base font-bold text-white">Yappy</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-slate-500">Nombre</dt>
                <dd className="font-semibold text-slate-100">{BOOTCAMP_PAYMENT.yappyName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Teléfono</dt>
                <dd className="font-mono text-base font-semibold tracking-wide text-slate-100 whitespace-nowrap">
                  {BOOTCAMP_PAYMENT.yappyPhone}
                </dd>
              </div>
            </dl>
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-neon-purple transition group-hover:text-white">
              Confirmar por WhatsApp →
            </span>
          </a>

          <a
            href={whatsappTransferUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pagar por transferencia bancaria — contactar por WhatsApp"
            className={`${paymentCardClass} border-white/10 bg-black/20 hover:border-neon-blue/40 hover:bg-neon-blue/5`}
          >
            <Building2 className="mb-3 h-5 w-5 text-neon-blue" aria-hidden />
            <p className="text-base font-bold text-white">Transferencia</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="grid grid-cols-[5.5rem_1fr] gap-x-2 gap-y-0.5 sm:grid-cols-[6rem_1fr]">
                <dt className="text-slate-500">Banco</dt>
                <dd className="font-semibold text-slate-100">{BOOTCAMP_PAYMENT.bankName}</dd>
                <dt className="text-slate-500">Tipo</dt>
                <dd className="font-semibold text-slate-100">{BOOTCAMP_PAYMENT.bankAccountType}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Titular</dt>
                <dd className="font-semibold leading-snug text-slate-100">{BOOTCAMP_PAYMENT.bankHolder}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Cuenta</dt>
                <dd className="overflow-x-auto font-mono text-sm font-semibold tracking-tight text-slate-100 whitespace-nowrap">
                  {BOOTCAMP_PAYMENT.bankAccountNumber}
                </dd>
              </div>
            </dl>
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-neon-blue transition group-hover:text-white">
              Confirmar por WhatsApp →
            </span>
          </a>
        </div>

        <ol className="mt-8 space-y-3 border-t border-white/10 pt-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pasos para inscribirte</p>
          {BOOTCAMP_PAYMENT.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-neon-blue">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
            href={mailtoUrl}
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
    </div>
  )
}
