export type SupabasePublicConfig = {
  url: string
  anonKey: string
}

export function isSupabaseConfigured(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim()
  return Boolean(url && key && url.startsWith('http'))
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim()

  if (!url || !anonKey) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. Créalas en .env.local (prefijo NEXT_PUBLIC_), reinicia el servidor de desarrollo y vuelve a intentar.',
    )
  }

  if (!url.startsWith('http')) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL debe ser la URL completa del proyecto, por ejemplo https://xxxx.supabase.co',
    )
  }

  return { url, anonKey }
}
