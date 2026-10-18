export function AdminSupabaseSetupNotice({ detail }: { detail?: string }) {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-950">
      <p className="font-semibold">Supabase no está configurado en este entorno</p>
      <p className="mt-2 leading-relaxed">
        Añade <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
        <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en{' '}
        <code className="text-xs">.env.local</code>, reinicia el servidor y vuelve a entrar al panel.
      </p>
      {detail ? <p className="mt-2 text-xs text-amber-900/90">{detail}</p> : null}
    </div>
  )
}
