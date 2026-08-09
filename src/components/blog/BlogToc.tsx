'use client'

import { useState } from 'react'
import type { BlogTocItem } from '@/lib/blog-toc'
import { blogSurface } from '@/components/blog/blog-ui'

type Props = {
  items: BlogTocItem[]
  collapsible?: boolean
}

export function BlogToc({ items, collapsible = false }: Props) {
  const [open, setOpen] = useState(!collapsible)

  if (!items.length) return null

  return (
    <nav aria-label="En este artículo" className={`${blogSurface} p-5`}>
      {collapsible ? (
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-[0.14em] text-brand"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          En este artículo
          <span aria-hidden className="text-slate-400">
            {open ? '−' : '+'}
          </span>
        </button>
      ) : (
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
          En este artículo
        </p>
      )}

      {open ? (
        <ol className="mt-4 space-y-2.5">
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
