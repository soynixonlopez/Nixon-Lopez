export type CommercialOfferSettings = {
  storiesPriceUsd: number | null
  storiesQuantity: number | null
  storiesPlatform: string
  storiesContentType: string
  storiesIncludesDesign: boolean
  storiesIncludesCopy: boolean
  storiesIncludesScheduling: boolean
  recommendedAdBudgetUsd: number
}

export const DEFAULT_COMMERCIAL_OFFER: CommercialOfferSettings = {
  storiesPriceUsd: null,
  storiesQuantity: null,
  storiesPlatform: 'Instagram y Facebook',
  storiesContentType: 'Piezas con material proporcionado por el cliente',
  storiesIncludesDesign: true,
  storiesIncludesCopy: true,
  storiesIncludesScheduling: true,
  recommendedAdBudgetUsd: 150,
}

export function adBudgetRecommendationCopy(amount: number) {
  const value = Number.isFinite(amount) && amount > 0 ? amount : 150
  return `Se recomienda una inversión publicitaria inicial de USD ${value} mensuales para distribuir entre las campañas activas de Facebook e Instagram mediante Meta Ads, de acuerdo con la estrategia definida. Este importe es orientativo, puede ajustarse de común acuerdo y no está incluido en los honorarios mensuales de gestión. La inversión definitiva deberá ser aprobada por el cliente antes de activar las campañas.`
}

export function parseCommercialOffer(value: unknown): CommercialOfferSettings {
  if (!value || typeof value !== 'object') return DEFAULT_COMMERCIAL_OFFER
  const row = value as Record<string, unknown>
  const price = row.stories_price_usd == null ? null : Number(row.stories_price_usd)
  const quantity = row.stories_quantity == null ? null : Number(row.stories_quantity)
  const recommended = Number(row.recommended_ad_budget_usd)
  return {
    storiesPriceUsd: price != null && Number.isFinite(price) && price > 0 ? price : null,
    storiesQuantity: quantity != null && Number.isFinite(quantity) && quantity > 0 ? quantity : null,
    storiesPlatform:
      typeof row.stories_platform === 'string' && row.stories_platform.trim()
        ? row.stories_platform.trim()
        : DEFAULT_COMMERCIAL_OFFER.storiesPlatform,
    storiesContentType:
      typeof row.stories_content_type === 'string' && row.stories_content_type.trim()
        ? row.stories_content_type.trim()
        : DEFAULT_COMMERCIAL_OFFER.storiesContentType,
    storiesIncludesDesign: row.stories_includes_design !== false,
    storiesIncludesCopy: row.stories_includes_copy !== false,
    storiesIncludesScheduling: row.stories_includes_scheduling !== false,
    recommendedAdBudgetUsd:
      Number.isFinite(recommended) && recommended > 0
        ? recommended
        : DEFAULT_COMMERCIAL_OFFER.recommendedAdBudgetUsd,
  }
}
