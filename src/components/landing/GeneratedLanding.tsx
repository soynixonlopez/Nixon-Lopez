import Image from 'next/image'
import Link from 'next/link'
import {
  normalizeLandingContent,
  normalizeLandingPayment,
  resolveCheckoutUrl,
  type LandingPageRow,
} from '@/lib/landing-pages'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '50760000000'

export function GeneratedLanding({ landing }: { landing: LandingPageRow }) {
  const content = normalizeLandingContent(landing.content)
  const payment = normalizeLandingPayment(landing.payment)
  const checkout = resolveCheckoutUrl(payment)
  const whatsappUrl = `https://wa.me/${WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hola, me interesa: ${landing.title}`
  )}`

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <section className="relative min-h-[88vh] overflow-hidden">
        {content.hero_image_url ? (
          <Image
            src={content.hero_image_url}
            alt=""
            fill
            priority
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1a33] via-[#12305a] to-[#0b1220]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/70 to-[#0b1220]/30" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8">
          {content.eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              {content.eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {content.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">{content.subheadline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {checkout ? (
              <a
                href={checkout}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-slate-900"
              >
                {content.cta_primary || payment.cta_label}
              </a>
            ) : (
              <a
                href="#pago"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-slate-900"
              >
                {content.cta_primary || payment.cta_label}
              </a>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/30 px-6 text-sm font-semibold text-white"
            >
              {content.cta_secondary}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h2 className="text-2xl font-bold sm:text-3xl">{content.benefits_title}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {content.benefits.map((benefit) => (
            <div key={benefit.id} className="border-t border-white/15 pt-4">
              <h3 className="text-lg font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 sm:grid-cols-2 sm:px-8 sm:items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{content.about_title}</h2>
            <p className="mt-4 whitespace-pre-line text-slate-300 leading-relaxed">
              {content.about_body}
            </p>
          </div>
          {content.about_image_url ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={content.about_image_url}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/10" />
          )}
        </div>
      </section>

      <section id="pago" className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            {landing.price_label}
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{content.offer_title}</h2>
          <p className="mt-3 max-w-xl text-slate-300">{content.offer_body}</p>
          <p className="mt-6 text-5xl font-bold tracking-tight">
            ${Number(landing.price_amount).toFixed(0)}
            <span className="ml-2 text-lg font-semibold text-slate-400">USD</span>
          </p>
          {landing.price_note ? (
            <p className="mt-2 text-sm text-slate-400">{landing.price_note}</p>
          ) : null}

          <div className="mt-8 space-y-4">
            {checkout ? (
              <a
                href={checkout}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-sky-400 px-6 text-base font-bold text-slate-950 sm:w-auto"
              >
                {payment.cta_label}
              </a>
            ) : null}

            {payment.primary_method === 'yappy' || payment.yappy_number ? (
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
                <p className="font-semibold text-white">Yappy</p>
                <p className="mt-1 text-slate-300">
                  {payment.yappy_name ? `${payment.yappy_name} · ` : ''}
                  {payment.yappy_number}
                </p>
              </div>
            ) : null}

            {payment.primary_method === 'bank_transfer' || payment.bank_account ? (
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
                <p className="font-semibold text-white">Transferencia bancaria</p>
                <p className="mt-1 text-slate-300">
                  {payment.bank_name}
                  {payment.bank_type ? ` · ${payment.bank_type}` : ''}
                </p>
                <p className="text-slate-300">{payment.bank_account}</p>
                <p className="text-slate-300">{payment.bank_holder}</p>
              </div>
            ) : null}

            {payment.custom_instructions ? (
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
                <p className="font-semibold text-white">{payment.custom_label}</p>
                <p className="mt-1 whitespace-pre-line text-slate-300">
                  {payment.custom_instructions}
                </p>
              </div>
            ) : null}
          </div>

          {content.guarantee_text ? (
            <p className="mt-6 text-sm text-slate-400">{content.guarantee_text}</p>
          ) : null}
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-slate-500">
        <p>{content.footer_note || 'Nixon Lopez Services'}</p>
        <Link href="/" className="mt-2 inline-block text-sky-300 hover:underline">
          Volver al sitio
        </Link>
      </footer>
    </div>
  )
}
