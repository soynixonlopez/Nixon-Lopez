'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Receipt,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Home,
  Images,
  PanelsTopLeft,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { adminUi } from '@/lib/admin-ui'
import { clsx } from 'clsx'

const STORAGE_KEY = 'admin-sidebar-collapsed'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/cotizaciones', label: 'Cotizaciones', icon: FileText },
  { href: '/admin/masterclass', label: 'Masterclass', icon: GraduationCap },
  { href: '/admin/contratos', label: 'Contratos', icon: FileText },
  { href: '/admin/proyectos', label: 'Proyectos', icon: FolderKanban },
  { href: '/admin/landings', label: 'Landings', icon: PanelsTopLeft },
  { href: '/admin/portafolio', label: 'Portafolio web', icon: Images },
  { href: '/admin/facturas', label: 'Facturas', icon: Receipt },
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
    <div
      className={clsx(
        'admin-theme flex min-h-screen print:block print:min-h-0 print:h-auto print:overflow-visible print:bg-white',
        adminUi.shellBg,
        'text-slate-900'
      )}
    >
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex flex-col',
          adminUi.sidebar,
          'transition-[width,transform] duration-300 ease-out print:hidden',
          'w-64 max-w-[min(100vw-1rem,16rem)]',
          collapsed ? 'lg:w-[72px]' : 'lg:w-64',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:max-w-none lg:flex-shrink-0 lg:translate-x-0'
        )}
      >
        <div
          className={clsx(
            'flex min-h-[3.5rem] items-center justify-between gap-2 p-3',
            adminUi.sidebarHeader
          )}
        >
          <Link
            href="/admin"
            className="flex min-w-0 flex-1 items-center gap-2 font-bold"
            onClick={() => setOpen(false)}
            title="Inicio del panel"
            aria-label="Nixon Lopez Services — panel de administración"
          >
            {collapsed ? (
              <Image
                src="/images/faviconweb.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded object-contain"
                aria-hidden
              />
            ) : (
              <Image
                src="/images/logoweb.png"
                alt="Nixon López — logo"
                width={1306}
                height={199}
                className="h-6 w-auto max-w-[min(100%,9rem)] object-contain object-left"
                priority
              />
            )}
          </Link>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              className={clsx(
                'hidden items-center justify-center rounded-lg border border-transparent p-2 lg:inline-flex',
                'text-slate-500 transition-colors hover:border-slate-200 hover:bg-slate-100 hover:text-brand',
                adminUi.focusRing
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
              className="inline-flex rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-x-hidden overflow-y-auto p-2 sm:p-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                title={collapsed ? label : undefined}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  collapsed && 'lg:justify-center lg:px-2',
                  active ? adminUi.navActive : adminUi.navIdle
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className={clsx('truncate', collapsed && 'lg:sr-only')}>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={clsx('p-2 sm:p-3', adminUi.sidebarHeader, 'border-b-0 border-t')}>
          <button
            type="button"
            onClick={logout}
            title={collapsed ? 'Cerrar sesión' : undefined}
            className={clsx(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900',
              collapsed && 'lg:justify-center lg:px-2'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            <span className={clsx(collapsed && 'lg:sr-only')}>Cerrar sesión</span>
          </button>
          <Link
            href="/"
            className="mt-2 block rounded-lg py-2 text-center text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand"
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

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-[2px] lg:hidden print:hidden"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="relative flex min-w-0 flex-1 flex-col print:block print:h-auto print:min-h-0 print:overflow-visible">
        <header
          className={clsx(
            'sticky top-0 z-20 flex items-center gap-3 px-4 py-3 lg:hidden print:hidden',
            adminUi.headerMobile
          )}
        >
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-slate-100"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6 text-brand" />
          </button>
          <span className="font-semibold text-brand">Panel Nixon López</span>
        </header>

        <main className="relative z-10 flex-1 w-full min-w-0 overflow-x-hidden overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 md:p-8 print:block print:h-auto print:max-h-none print:flex-none print:overflow-visible print:bg-white print:p-0">
          {children}
        </main>
      </div>
    </div>
  )
}
