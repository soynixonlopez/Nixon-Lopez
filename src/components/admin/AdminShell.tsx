'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
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
  Newspaper,
  PanelsTopLeft,
  ScrollText,
} from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { createClient } from '@/lib/supabase/client'
import { adminUi } from '@/lib/admin-ui'
import { clsx } from 'clsx'

const STORAGE_KEY = 'admin-sidebar-collapsed'

const navSections = [
  {
    id: 'admin',
    label: 'Administración',
    items: [
      { href: '/admin/cotizaciones', label: 'Cotizaciones', icon: FileText },
      { href: '/admin/contratos', label: 'Contratos', icon: ScrollText },
      { href: '/admin/proyectos', label: 'Proyectos', icon: FolderKanban },
      { href: '/admin/facturas', label: 'Facturas', icon: Receipt },
    ],
  },
  {
    id: 'web',
    label: 'Sitio web',
    items: [
      { href: '/admin/landings', label: 'Landings', icon: PanelsTopLeft },
      { href: '/admin/portafolio', label: 'Portafolio web', icon: Images },
      { href: '/admin/blog', label: 'Blog', icon: Newspaper },
      { href: '/admin/masterclass', label: 'Masterclass', icon: GraduationCap },
    ],
  },
] as const

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

  const sidebarWidth = collapsed ? 'lg:w-[72px]' : 'lg:w-64'
  const contentOffset = collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'

  return (
    <div
      className={clsx(
        'admin-theme min-h-screen print:block print:min-h-0 print:h-auto print:overflow-visible print:bg-white',
        adminUi.shellBg,
        'text-slate-900'
      )}
    >
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex h-dvh max-h-dvh w-64 max-w-[min(100vw-1rem,16rem)] flex-col',
          adminUi.sidebar,
          'transition-[width,transform] duration-300 ease-out print:hidden',
          sidebarWidth,
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div
          className={clsx(
            'flex min-h-[3.75rem] shrink-0 items-center justify-between gap-2 px-3 py-2.5',
            adminUi.sidebarHeader
          )}
        >
          <Link
            href="/admin/cotizaciones"
            className={clsx(
              'flex min-w-0 flex-1 items-center',
              collapsed && 'lg:justify-center'
            )}
            onClick={() => setOpen(false)}
            title="Cotizaciones"
            aria-label="Nixon Lopez Services — administración"
          >
            <BrandLogo
              variant="official"
              alt="Nixon Lopez Services"
              sizes="200px"
              priority
              markOnly={collapsed}
              className={clsx(collapsed ? 'lg:justify-center' : '')}
            />
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

        <nav className="min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto overscroll-contain p-2 sm:p-3">
          {navSections.map((section) => (
            <div key={section.id}>
              <p
                className={clsx(
                  'mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400',
                  collapsed && 'lg:px-0 lg:text-center lg:tracking-normal'
                )}
                title={collapsed ? section.label : undefined}
              >
                <span className={clsx(collapsed && 'lg:hidden')}>{section.label}</span>
                <span className={clsx('hidden', collapsed && 'lg:inline')}>
                  {section.id === 'admin' ? 'Admin' : 'Web'}
                </span>
              </p>
              <div className="space-y-1">
                {section.items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`)
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
              </div>
            </div>
          ))}
        </nav>

        <div className={clsx('shrink-0 p-2 sm:p-3', adminUi.sidebarHeader, 'border-b-0 border-t')}>
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

      <div
        className={clsx(
          'relative flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ease-out print:block print:h-auto print:min-h-0 print:overflow-visible print:pl-0',
          contentOffset
        )}
      >
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
          <BrandLogo
            variant="official"
            alt="Nixon Lopez Services"
            sizes="160px"
            className="max-w-[160px]"
          />
        </header>

        <main className="relative z-10 w-full min-w-0 flex-1 overflow-x-hidden p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 md:p-8 print:block print:h-auto print:max-h-none print:flex-none print:overflow-visible print:bg-white print:p-0">
          {children}
        </main>
      </div>
    </div>
  )
}
