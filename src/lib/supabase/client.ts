import { createBrowserClient } from '@supabase/ssr'

function getPublicConfig() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim()

  if (!url || !key) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local. Deben llevar el prefijo NEXT_PUBLIC_ y reinicia el servidor (por ejemplo, "pnpm dev") después de guardar.'
    )
  }

  if (!url.startsWith('http')) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL debe ser la URL completa, por ejemplo: https://xxxx.supabase.co'
    )
  }

  return { url, key }
}

export function createClient() {
  const { url, key } = getPublicConfig()
  return createBrowserClient(url, key)
}
