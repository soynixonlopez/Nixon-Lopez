import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/admin-constants'

export async function requireAdminApi() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return { ok: false as const, supabase, user: null }
  }

  return { ok: true as const, supabase, user }
}
