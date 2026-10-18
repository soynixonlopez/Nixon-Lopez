import { createServiceRoleClient } from '@/lib/supabase/service'
import {
  DEFAULT_COMMERCIAL_OFFER,
  parseCommercialOffer,
  type CommercialOfferSettings,
} from '@/lib/commercial-settings'

export async function getCommercialOfferSettings(): Promise<CommercialOfferSettings> {
  const supabase = createServiceRoleClient()
  if (!supabase) return DEFAULT_COMMERCIAL_OFFER
  const { data, error } = await supabase.from('commercial_settings').select('*').eq('id', 1).maybeSingle()
  if (error || !data) return DEFAULT_COMMERCIAL_OFFER
  return parseCommercialOffer(data)
}
