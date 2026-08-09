'use client'

import { useState } from 'react'
import type { BlogTocItem } from '@/lib/blog-toc'

type Props = {
  items: BlogTocItem[]
  collapsible?: boolean
}

export function BlogToc({ items, collapsible = false }: Props) {
  const [open, setOpen] = useState(!collapsible)

  if (!items.length) return null

  return (
    <nav
      aria-label="En este artículo"
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
    >
      {collapsible ? (
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          En este artículo
          <span aria-hidden className="text-slate-400">
            {open ? '−' : '+'}
          </span>
        </button>
      ) : (
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          En este artículo
        </p>
      )}

      {open ? (
        <ol className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id} className={item.level === 3 ? 'pl-3' : undefined}>
              <a
                href={`#${item.id}`}
                className="block text-sm leading-snug text-slate-600 transition hover:text-brand dark:text-slate-300"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      ) : null}
    </nav>
  )
}
