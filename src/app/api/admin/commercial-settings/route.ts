import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth-api'
import { parseCommercialOffer } from '@/lib/commercial-settings'

export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }
  const row = body as Record<string, unknown>
  const priceRaw = row.storiesPriceUsd
  const price = priceRaw === '' || priceRaw == null ? null : Number(priceRaw)
  const quantityRaw = row.storiesQuantity
  const quantity = quantityRaw === '' || quantityRaw == null ? null : Number(quantityRaw)
  const recommended = Number(row.recommendedAdBudgetUsd)
  if (price != null && (!Number.isFinite(price) || price <= 0)) {
    return NextResponse.json({ error: 'El precio de historias debe ser mayor que cero o quedar vacío.' }, { status: 400 })
  }
  if (!Number.isFinite(recommended) || recommended <= 0) {
    return NextResponse.json({ error: 'El presupuesto publicitario recomendado debe ser mayor que cero.' }, { status: 400 })
  }

  const payload = {
    id: 1,
    stories_price_usd: price,
    stories_quantity: quantity != null && Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : null,
    stories_platform: typeof row.storiesPlatform === 'string' ? row.storiesPlatform.trim() : '',
    stories_content_type: typeof row.storiesContentType === 'string' ? row.storiesContentType.trim() : '',
    stories_includes_design: row.storiesIncludesDesign !== false,
    stories_includes_copy: row.storiesIncludesCopy !== false,
    stories_includes_scheduling: row.storiesIncludesScheduling !== false,
    recommended_ad_budget_usd: recommended,
  }

  const { data, error } = await auth.supabase
    .from('commercial_settings')
    .upsert(payload)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json(
      {
        error:
          error.code === '42P01'
            ? 'Falta la tabla commercial_settings. Aplica la migración 20261017190000_commercial_settings.sql.'
            : error.message,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ settings: parseCommercialOffer(data) })
}
