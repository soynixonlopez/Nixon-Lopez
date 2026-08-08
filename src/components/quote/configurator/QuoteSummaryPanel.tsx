'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Clock } from 'lucide-react'
import { calculateQuote, type ConfiguratorState } from '@/lib/quote-configurator'

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US')}`
}

type Props = {
  state: ConfiguratorState
  compact?: boolean
  /** Card flotante sobre la imagen del cotizador */
  overlay?: boolean
}

export function QuoteSummaryPanel({ state, compact = false, overlay = false }: Props) {
  const quote = calculateQuote(state)

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">Inversión estimada</p>
          <p className="truncate text-sm font-semibold text-slate-800">{quote.projectLabel}</p>
        </div>
        <motion.p
          key={quote.total}
          initial={{ opacity: 0.4, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-xl font-bold tabular-nums text-brand"
        >
          {formatMoney(quote.total)}
          <span className="ml-1 text-xs font-medium text-slate-500">USD</span>
        </motion.p>
      </div>
    )
  }

  if (overlay) {
    return (
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-[min(100%,17.5rem)] rounded-2xl border border-white/70 bg-white/90 p-3.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur-md sm:w-[18.5rem] sm:p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Tu proyecto</p>
            <p className="mt-0.5 truncate text-sm font-bold text-slate-900">{quote.projectLabel}</p>
          </div>
          <motion.p
            key={quote.total}
            initial={{ opacity: 0.35, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="shrink-0 text-lg font-bold tabular-nums text-brand"
          >
            {formatMoney(quote.total)}
            <span className="ml-0.5 text-[10px] font-semibold text-slate-500">USD</span>
          </motion.p>
        </div>

        <div className="mt-2.5 max-h-[7.5rem] space-y-1.5 overflow-y-auto border-t border-slate-100/90 pt-2.5 pr-0.5">
          <AnimatePresence initial={false} mode="popLayout">
            {quote.lines.length === 0 ? (
              <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-slate-500">
                Elige opciones a la derecha.
              </motion.p>
            ) : (
              quote.lines.slice(0, 5).map((line) => (
                <motion.div
                  key={line.id}
                  layout
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-baseline justify-between gap-2 text-[12px]"
                >
                  <span className="truncate text-slate-600">{line.label}</span>
                  <span className="shrink-0 font-medium tabular-nums text-slate-900">
                    {line.id.startsWith('project-')
                      ? formatMoney(line.amount)
                      : `+${formatMoney(line.amount).slice(1)}`}
                  </span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          {quote.includedZeroPriceFeatures.slice(0, 2).map((label) => (
            <div key={label} className="flex items-center gap-1.5 text-[12px] text-slate-500">
              <Check className="h-3 w-3 text-brand" strokeWidth={2.5} />
              {label}
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-slate-50/90 px-2.5 py-2 text-[11px] text-slate-600">
          <Clock className="h-3.5 w-3.5 shrink-0 text-brand" />
          <span>
            Entrega <span className="font-semibold text-slate-900">{quote.delivery}</span>
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tu proyecto</p>
          <p className="mt-1 text-base font-bold text-slate-900">{quote.projectLabel}</p>
        </div>
        <motion.p
          key={quote.total}
          initial={{ opacity: 0.35, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-2xl font-bold tabular-nums text-brand"
        >
          {formatMoney(quote.total)}
          <span className="ml-0.5 text-xs font-semibold text-slate-500">USD</span>
        </motion.p>
      </div>

      <div className="mt-4 max-h-40 space-y-2 overflow-y-auto border-t border-slate-100 pt-4">
        <AnimatePresence initial={false} mode="popLayout">
          {quote.lines.length === 0 ? (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-500">
              Selecciona opciones para ver el desglose.
            </motion.p>
          ) : (
            quote.lines.map((line) => (
              <motion.div
                key={line.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-baseline justify-between gap-2 text-sm"
              >
                <span className="truncate text-slate-600">{line.label}</span>
                <span className="shrink-0 font-medium tabular-nums text-slate-900">
                  {line.id.startsWith('project-')
                    ? formatMoney(line.amount)
                    : `+${formatMoney(line.amount).slice(1)}`}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {quote.includedZeroPriceFeatures.map((label) => (
          <div key={label} className="flex items-center gap-2 text-sm text-slate-500">
            <Check className="h-3.5 w-3.5 text-brand" strokeWidth={2.5} />
            {label}
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
        Entrega: <span className="font-semibold text-slate-900">{quote.delivery}</span>
      </p>
    </div>
  )
}
