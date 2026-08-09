'use client'

import { Search } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function BlogSearch({
  value,
  onChange,
  placeholder = 'Buscar por tema, palabra clave o etiqueta...',
}: Props) {
  return (
    <label className="relative block">
      <span className="sr-only">Buscar artículos</span>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200/80 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-[0_4px_16px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-brand/35 focus:ring-2 focus:ring-brand/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </label>
  )
}
