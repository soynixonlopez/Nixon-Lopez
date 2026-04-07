'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Download,
  Eye,
  Mail,
  MoreVertical,
  Pencil,
  Printer,
  Send,
  Trash2,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { clsx } from 'clsx'

const MENU_WIDTH = 240
const MENU_GAP = 6

type Props = {
  id: string
  contractNumber: string
  clientName: string
  clientEmail: string | null
}

function computeMenuPosition(trigger: DOMRect) {
  let left = trigger.right - MENU_WIDTH
  left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8))
  let top = trigger.bottom + MENU_GAP
  const estHeight = 320
  if (top + estHeight > window.innerHeight - 8) {
    top = Math.max(8, trigger.top - estHeight - MENU_GAP)
  }
  return { top, left }
}

export function ContractListActions({ id, contractNumber, clientName, clientEmail }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [showEmail, setShowEmail] = useState(false)
  const [emailTo, setEmailTo] = useState(clientEmail ?? '')
  const [emailMsg, setEmailMsg] = useState(
    `Hola,\n\nAdjuntamos el contrato ${contractNumber} para su revisión y firma.\n\nSaludos cordiales.`
  )
  const [busy, setBusy] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

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
    if (!confirm(`¿Eliminar el contrato ${contractNumber}?`)) return
    const supabase = createClient()
    const { error } = await supabase.from('service_contracts').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    router.refresh()
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setSendError(null)
    try {
      const res = await fetch(`/api/admin/contracts/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ to: emailTo.trim(), message: emailMsg }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSendError(typeof data.error === 'string' ? data.error : 'Error al enviar')
        return
      }
      setShowEmail(false)
      router.refresh()
    } catch {
      setSendError('Error de red.')
    } finally {
      setBusy(false)
    }
  }

  const pdfViewUrl = `/api/admin/contracts/${id}/pdf`
  const pdfDownloadUrl = `/api/admin/contracts/${id}/pdf?download=1`

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
          {contractNumber}
        </p>
        <Link
          href={`/admin/contratos/${id}`}
          role="menuitem"
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/90"
          onClick={() => setOpen(false)}
        >
          <Eye className="h-4 w-4 shrink-0 text-indigo-400/90" />
          Ver contrato / imprimir
        </Link>
        <a
          href={pdfViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/90"
          onClick={() => setOpen(false)}
        >
          <Printer className="h-4 w-4 shrink-0 text-slate-400" />
          Abrir PDF
        </a>
        <a
          href={pdfDownloadUrl}
          role="menuitem"
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/90"
          onClick={() => setOpen(false)}
        >
          <Download className="h-4 w-4 shrink-0 text-emerald-400/90" />
          Descargar PDF
        </a>
        <button
          type="button"
          role="menuitem"
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800/90"
          onClick={() => {
            setOpen(false)
            setShowEmail(true)
          }}
        >
          <Mail className="h-4 w-4 shrink-0 text-indigo-400/90" />
          Enviar por correo
        </button>
        <Link
          href={`/admin/contratos/${id}/edit`}
          role="menuitem"
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/90"
          onClick={() => setOpen(false)}
        >
          <Pencil className="h-4 w-4 shrink-0 text-slate-400" />
          Editar
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
    <>
      <div className="flex justify-end">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          title="Acciones"
          className={clsx(
            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
            'text-slate-500 hover:bg-slate-800/80 hover:text-slate-200',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50',
            open && 'bg-slate-800 text-slate-100'
          )}
        >
          <MoreVertical className="h-4 w-4" strokeWidth={2} />
          <span className="sr-only">Acciones del contrato</span>
        </button>
        {menu}
      </div>

      {showEmail && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Enviar contrato</h2>
              <button
                type="button"
                onClick={() => setShowEmail(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Para: <span className="text-slate-300">{clientName}</span>
            </p>
            <form onSubmit={handleSend} className="space-y-4">
              <input
                type="email"
                required
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
              />
              <textarea
                value={emailMsg}
                onChange={(e) => setEmailMsg(e.target.value)}
                rows={6}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm"
              />
              {sendError && <p className="text-sm text-red-400">{sendError}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmail(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {busy ? 'Enviando…' : 'Enviar con PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
