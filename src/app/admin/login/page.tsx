'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/admin-constants'
import { Lock, Mail } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const err = searchParams.get('error')
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
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
      const next = searchParams.get('next') || '/admin'
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logoweb.png"
            alt="Nixon López — logo"
            width={1306}
            height={199}
            className="h-8 w-auto max-w-full object-contain sm:h-9"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Acceso administrador</h1>
        <p className="text-slate-400 text-sm text-center mb-6">
          Solo el correo autorizado puede entrar.
        </p>
        {err === 'forbidden' && (
          <p className="text-red-400 text-sm text-center mb-4">
            Este correo no tiene permiso para el panel.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Correo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                required
                autoComplete="current-password"
              />
            </div>
          </div>
          {message && <p className="text-red-400 text-sm">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-95 disabled:opacity-50"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <Link href="/" className="block text-center text-sm text-slate-500 mt-6 hover:text-slate-300">
          ← Volver al sitio
        </Link>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <LoginForm />
    </Suspense>
  )
}
