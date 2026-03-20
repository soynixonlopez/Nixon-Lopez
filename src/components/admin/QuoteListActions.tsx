'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Eye, MoreVertical, Pencil, Printer, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { clsx } from 'clsx'

const MENU_WIDTH = 216
const MENU_GAP = 6

type Props = {
  id: string
  label: string
}

function computeMenuPosition(trigger: DOMRect) {
  let left = trigger.right - MENU_WIDTH
  left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8))
  let top = trigger.bottom + MENU_GAP
  const estHeight = 200
  if (top + estHeight > window.innerHeight - 8) {
    top = Math.max(8, trigger.top - estHeight - MENU_GAP)
  }
  return { top, left }
}

export function QuoteListActions({ id, label }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  const updatePosition = useCallback(() => {
    const btn = buttonRef.current
    if (!btn) return
    setPos(computeMenuPosition(btn.getBoundingClientRect()))
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    updatePosition()
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  useEffect(() => {
    function handlePointerDown(e: MouseEvent | TouchEvent) {
      const t = e.target as Node
      if (buttonRef.current?.contains(t)) return
      if (menuRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  async function remove() {
    setOpen(false)
    if (!confirm(`¿Eliminar cotización de ${label}?`)) return
    const supabase = createClient()
    const { error } = await supabase.from('quotes').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    router.refresh()
  }

  const menu =
    open &&
    mounted &&
    pos &&
    createPortal(
      <div
        ref={menuRef}
        role="menu"
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: MENU_WIDTH,
          zIndex: 9999,
        }}
        className="overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950/98 py-1 shadow-xl backdrop-blur-md"
      >
        <p className="border-b border-slate-800/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 truncate">
          {label}
        </p>
        <Link
          href={`/admin/cotizaciones/${id}`}
          role="menuitem"
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/90"
          onClick={() => setOpen(false)}
        >
          <Eye className="h-4 w-4 shrink-0 text-indigo-400/90" />
          Ver / PDF
        </Link>
        <Link
          href={`/admin/cotizaciones/${id}#editar-cotizacion`}
          role="menuitem"
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/90"
          onClick={() => setOpen(false)}
        >
          <Pencil className="h-4 w-4 shrink-0 text-slate-400" />
          Editar
        </Link>
        <Link
          href={`/admin/cotizaciones/${id}`}
          role="menuitem"
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/90"
          onClick={() => setOpen(false)}
        >
          <Printer className="h-4 w-4 shrink-0 text-slate-400" />
          Imprimir
        </Link>
        <div className="my-1 h-px bg-slate-800" />
        <button
          type="button"
          role="menuitem"
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-400 hover:bg-red-950/35"
          onClick={remove}
        >
          <Trash2 className="h-4 w-4 shrink-0" />
          Eliminar
        </button>
      </div>,
      document.body
    )

  return (
    <div className="flex justify-end">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        title="Opciones"
        className={clsx(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
          'text-slate-500 hover:bg-slate-800/80 hover:text-slate-200',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50',
          open && 'bg-slate-800 text-slate-100'
        )}
      >
        <MoreVertical className="h-4 w-4" strokeWidth={2} />
        <span className="sr-only">Opciones de cotización</span>
      </button>
      {menu}
    </div>
  )
}
