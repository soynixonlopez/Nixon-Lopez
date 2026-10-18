import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/public-config'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@nixonlopez.com'

/** Evita redirección abierta tras login: solo rutas internas relativas bajo el mismo origen. */
function safeAdminRedirectPath(next: string | null): string {
  if (!next || typeof next !== 'string') return '/admin/cotizaciones'
  const t = next.trim()
  if (
    !t.startsWith('/') ||
    t.startsWith('//') ||
    /[\s\\]/.test(t) ||
    /:/.test(t)
  ) {
    return '/admin/cotizaciones'
  }
  return t
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const isAdminLogin = request.nextUrl.pathname.startsWith('/admin/login')
  const isAdminPanel = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminPanel && !isSupabaseConfigured()) {
    if (!isAdminLogin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'config')
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isAdminPanel && !isAdminLogin) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (user.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut()
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'forbidden')
      return NextResponse.redirect(url)
    }
  }

  if (isAdminLogin && user?.email === ADMIN_EMAIL) {
    const next = safeAdminRedirectPath(request.nextUrl.searchParams.get('next')) || '/admin/cotizaciones'
    return NextResponse.redirect(new URL(next, request.url))
  }

  return supabaseResponse
}
