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
  invoiceNumber: string
}

function computeMenuPosition(trigger: DOMRect) {
  let left = trigger.right - MENU_WIDTH
  left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8))
  let top = trigger.bottom + MENU_GAP
  const estHeight = 240
  if (top + estHeight > window.innerHeight - 8) {
    top = Math.max(8, trigger.top - estHeight - MENU_GAP)
  }
  return { top, left }
}

/**
 * Menú en portal + position:fixed para no quedar dentro del overflow de la tabla
 * (evita scrollbars raros y recortes).
 */
export function InvoiceListActions({ id, invoiceNumber }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    function handleScrollOrResize() {
      setOpen(false)
    }
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
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
    if (!confirm(`¿Eliminar ${invoiceNumber}? No se puede deshacer.`)) return
    const supabase = createClient()
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    router.refresh()
  }

  const menuContent =
    open &&
    mounted &&
    pos &&
    createPortal(
      <div
        ref={menuRef}
        id={`invoice-menu-${id}`}
        role="menu"
        aria-orientation="vertical"
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: MENU_WIDTH,
          zIndex: 9999,
        }}
        className={clsx(
          'overflow-hidden rounded-lg border py-1',
          'border-slate-700/80 bg-slate-950/98 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.65)]',
          'backdrop-blur-md'
        )}
      >
        <p className="border-b border-slate-800/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Factura {invoiceNumber}
        </p>
        <div className="py-0.5" role="none">
          <Link
            href={`/admin/facturas/${id}`}
            role="menuitem"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800/90"
            onClick={() => setOpen(false)}
          >
            <Eye className="h-4 w-4 shrink-0 text-indigo-400/90" aria-hidden />
            Ver documento
          </Link>
          <Link
            href={`/admin/facturas/${id}/edit`}
            role="menuitem"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800/90"
            onClick={() => setOpen(false)}
          >
            <Pencil className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            Editar
          </Link>
          <Link
            href={`/admin/facturas/${id}`}
            role="menuitem"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800/90"
            onClick={() => setOpen(false)}
          >
            <Printer className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            Imprimir / PDF
          </Link>
        </div>
        <div className="border-t border-slate-800/90 py-0.5" role="none">
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-400/95 transition-colors hover:bg-red-950/35"
            onClick={remove}
          >
            <Trash2 className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            Eliminar
          </button>
        </div>
      </div>,
      document.body
    )

  return (
    <div className="flex justify-end">
      <button
        ref={buttonRef}
        type="button"
        id={`invoice-menu-trigger-${id}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={`invoice-menu-${id}`}
        title="Opciones"
        className={clsx(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
          'text-slate-500 hover:bg-slate-800/80 hover:text-slate-200',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50',
          open && 'bg-slate-800 text-slate-100'
        )}
      >
        <MoreVertical className="h-4 w-4" strokeWidth={2} aria-hidden />
        <span className="sr-only">Abrir menú de opciones para {invoiceNumber}</span>
      </button>
      {menuContent}
    </div>
  )
}
