'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Receipt,
  PlusCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { clsx } from 'clsx'

const STORAGE_KEY = 'admin-sidebar-collapsed'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/cotizaciones', label: 'Cotizaciones', icon: FileText },
  { href: '/admin/cotizacion-nueva', label: 'Nueva cotización', icon: PlusCircle },
  { href: '/admin/proyectos', label: 'Proyectos', icon: FolderKanban },
  { href: '/admin/facturas', label: 'Facturas', icon: Receipt },
  { href: '/admin/facturas/nueva', label: 'Nueva factura', icon: PlusCircle },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      /* ignore */
    }
  }, [])

  function toggleCollapse() {
    setCollapsed((c) => {
      const next = !c
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur',
          'transition-[width,transform] duration-300 ease-out print:hidden',
          'w-64 max-w-[min(100vw-1rem,16rem)]',
          collapsed ? 'lg:w-[72px]' : 'lg:w-64',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:max-w-none lg:flex-shrink-0'
        )}
      >
        {/* Cabecera sidebar */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 p-3 min-h-[3.5rem]">
          <Link
            href="/admin"
            className="min-w-0 flex-1 font-bold"
            onClick={() => setOpen(false)}
            title="Inicio del panel"
            aria-label="Nixon Admin — inicio del panel"
          >
            <span className="gradient-text text-lg leading-tight block truncate">
              <span className="lg:hidden">Nixon Admin</span>
              <span className="hidden lg:inline text-center" aria-hidden="true">
                {collapsed ? (
                  <span className="text-2xl font-bold tracking-tight">N</span>
                ) : (
                  'Nixon Admin'
                )}
              </span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              className={clsx(
                'hidden lg:inline-flex items-center justify-center rounded-lg border border-transparent p-2',
                'text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/40'
              )}
              onClick={toggleCollapse}
              aria-expanded={!collapsed}
              aria-label={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
              title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <button
              type="button"
              className="inline-flex p-2 rounded-lg hover:bg-slate-800 lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                title={collapsed ? label : undefined}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  collapsed && 'lg:justify-center lg:px-2 lg:py-2.5',
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className={clsx('truncate', collapsed && 'lg:sr-only')}>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 p-2 sm:p-3">
          <button
            type="button"
            onClick={logout}
            title={collapsed ? 'Cerrar sesión' : undefined}
            className={clsx(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white',
              collapsed && 'lg:justify-center lg:px-2'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            <span className={clsx(collapsed && 'lg:sr-only')}>Cerrar sesión</span>
          </button>
          <Link
            href="/"
            className="mt-2 block rounded-lg py-2 text-center text-xs text-slate-500 transition-colors hover:bg-slate-800/80 hover:text-slate-300"
            title="Volver al sitio público"
            onClick={() => setOpen(false)}
          >
            <span className="lg:hidden">← Volver al sitio</span>
            <span className="hidden lg:inline">
              {collapsed ? (
                <Home className="mx-auto h-4 w-4 opacity-80" aria-hidden />
              ) : (
                '← Volver al sitio'
              )}
            </span>
          </Link>
        </div>
      </aside>

      {/* Overlay móvil / tablet drawer */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[1px] lg:hidden print:hidden"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur lg:hidden print:hidden">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-slate-800"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold">Panel</span>
        </header>
        <main className="flex-1 overflow-x-auto p-4 sm:p-6 md:p-8 print:p-0 print:bg-white">{children}</main>
      </div>
    </div>
  )
}
