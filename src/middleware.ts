import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/** Bloquea rutas/archivos sensibles comunes de scanners. */
const BLOCKED_PATH_PREFIXES = [
  '/.env',
  '/.git',
  '/wp-admin',
  '/wp-login',
  '/xmlrpc.php',
  '/server-status',
  '/.aws',
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase()
  if (BLOCKED_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(p))) {
    return new NextResponse(null, { status: 404 })
  }

  // Auth/sesión solo en panel admin (el resto no paga costo de Supabase en cada request)
  if (pathname.startsWith('/admin')) {
    return await updateSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Incluye admin + probes. Evita assets estáticos de Next.
     * Actualizar Next (>=16.2.6) mitiga bypass de middleware por prefetch.
     */
    '/admin/:path*',
    '/.env',
    '/.env/:path*',
    '/.git/:path*',
    '/wp-admin/:path*',
    '/wp-login.php',
    '/xmlrpc.php',
  ],
}
