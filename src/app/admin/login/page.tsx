'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/admin-constants'
import { adminUi } from '@/lib/admin-ui'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const err = searchParams.get('error')
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
        return
      }
      const next = searchParams.get('next') || '/admin/cotizaciones'
      window.location.href = next
    } catch (err) {
      const text =
        err instanceof Error ? err.message : 'Error de conexión con Supabase.'
      setMessage(
        text.includes('Faltan NEXT_PUBLIC') || text.includes('NEXT_PUBLIC_SUPABASE_URL')
          ? text
          : `${text} Si ves "Failed to fetch": revisa en .env.local que existan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (con prefijo NEXT_PUBLIC_), sin comillas ni espacios al final, URL tipo https://xxx.supabase.co, y reinicia el servidor. Comprueba también que el proyecto en Supabase no esté pausado.`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`admin-login-page admin-theme relative flex min-h-[100dvh] items-center justify-center overflow-hidden p-4 sm:p-6`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-neon-blue/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-1/4 h-80 w-80 rounded-full bg-neon-purple/12 blur-3xl"
        aria-hidden
      />

      <div className="relative w-full max-w-[420px]">
        <div className={adminUi.loginCard}>
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/logoweb.png"
              alt="Nixon López — logo"
              width={1306}
              height={199}
              className="h-9 w-auto max-w-full object-contain sm:h-10"
              priority
            />
          </div>

          <h1 className="mb-2 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.65rem]">
            Acceso administrador
          </h1>
          <p className="mb-8 text-center text-sm leading-relaxed text-slate-600">
            Solo el correo autorizado puede entrar.
          </p>

          {err === 'forbidden' && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-600">
              Este correo no tiene permiso para el panel.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-xs font-medium text-slate-600">
                Correo
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${adminUi.loginInput} pl-12`}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-xs font-medium text-slate-600">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${adminUi.loginInput} pl-12 pr-12`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            {message && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {message}
              </p>
            )}

            <button type="submit" disabled={loading} className={adminUi.loginBtn}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <Link
            href="/"
            className="mt-8 block text-center text-sm text-slate-500 transition-colors hover:text-brand"
          >
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className={`flex min-h-[100dvh] items-center justify-center ${adminUi.loginPage}`}>
          <div className="h-8 w-8 animate-pulse rounded-full bg-brand/20" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
