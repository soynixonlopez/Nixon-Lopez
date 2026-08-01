'use client'

import { useEffect, useState } from 'react'
import { Check, Clock } from 'lucide-react'
import { BOOTCAMP_URGENCY } from '@/lib/bootcamp'

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; expired: boolean }

function calcTimeLeft(iso: string): TimeLeft {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function CountdownAndSpots() {
  const { enrollmentDeadlineIso, totalSpots, spotsTaken, spotsLabel } = BOOTCAMP_URGENCY
  const spotsLeft = Math.max(0, totalSpots - spotsTaken)
  const fill = Math.min(100, Math.round((spotsTaken / totalSpots) * 100))
  const [time, setTime] = useState(() => calcTimeLeft(enrollmentDeadlineIso))

  useEffect(() => {
    const id = window.setInterval(() => setTime(calcTimeLeft(enrollmentDeadlineIso)), 1000)
    return () => window.clearInterval(id)
  }, [enrollmentDeadlineIso])

  return (
    <div className="relative mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Clock className="h-4 w-4 text-neon-blue" aria-hidden />
          {time.expired ? 'Oferta cerrada' : 'Termina el precio fundador en'}
        </p>
        {!time.expired ? (
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { v: time.days, l: 'D' },
              { v: time.hours, l: 'H' },
              { v: time.minutes, l: 'M' },
              { v: time.seconds, l: 'S' },
            ].map(({ v, l }) => (
              <div key={l} className="rounded-xl bg-black/30 px-2 py-2.5 ring-1 ring-white/10">
                <span className="block text-xl font-bold tabular-nums text-white">{pad(v)}</span>
                <span className="text-[10px] text-slate-500">{l}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">Escríbeme para lista de espera.</p>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{spotsLabel}</p>
        <p className="mt-2 text-2xl font-bold text-white">
          {spotsLeft} <span className="text-base font-medium text-slate-400">/ {totalSpots} cupos</span>
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/30">
          <div className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all" style={{ width: `${fill}%` }} />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <Check className="h-3.5 w-3.5 text-neon-green" aria-hidden />
          {spotsTaken} ya reservaron
        </p>
      </div>
    </div>
  )
}
