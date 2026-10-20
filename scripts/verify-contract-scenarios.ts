/**
 * Verificación de escenarios comerciales / contractuales.
 * Ejecutar: npx tsx scripts/verify-contract-scenarios.ts
 */
import { buildCommercialSnapshot, type ConfiguratorState } from '../src/lib/quote-configurator'
import {
  assessQuoteForContract,
  deriveContractTermsFromQuote,
  enrichQuotePayloadForContract,
} from '../src/lib/contract-terms-from-quote'
import { buildCommercialContractClauses, commercialTermsReady, readCommercialSnapshot } from '../src/lib/contract-commercial'
import { buildContractIntroSegments } from '../src/lib/contracts'
import type { WebPlanId, MarketingPlanId } from '../src/lib/service-catalog'
import { WEB_PLANS, MARKETING_PLANS } from '../src/lib/service-catalog'
import type { ServiceContractRecord } from '../src/lib/types/contract'

function baseState(partial: Partial<ConfiguratorState>): ConfiguratorState {
  return {
    projectType: 'profesional',
    webPlanIds: [],
    marketingPlan: null,
    business: null,
    timeline: 'normal',
    extraPages: 0,
    features: [],
    channels: ['instagram', 'facebook'],
    productCount: null,
    serviceCount: null,
    scopeNotes: '',
    comments: '',
    hasDomain: 'si',
    hasHosting: 'si',
    emailCount: 0,
    taxRate: null,
    adBudgetChoice: 'none',
    adBudgetUsd: 0,
    customizeVolume: false,
    customPosts: null,
    customReels: null,
    customCampaigns: null,
    storiesPerWeek: 3,
    revisionRounds: 2,
    startDate: '',
    deliveryDate: '',
    paymentMethod: '',
    advanceNote: '',
    balanceNote: '',
    paymentSchedule: '',
    termNote: '',
    renewalNote: '',
    terminationNote: '',
    marketingStartDate: '',
    marketingFirstPayment: '',
    ...partial,
  } as ConfiguratorState
}

function mockContract(commercial: ReturnType<typeof buildCommercialSnapshot>): ServiceContractRecord {
  return {
    id: 'test',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    contract_number: 'NL-TEST-001',
    status: 'draft',
    quote_id: null,
    client_name: 'Cliente Prueba',
    client_email: 'cliente@test.com',
    client_tax_id: '8-888-888',
    client_address: 'Ciudad de Panama',
    city: 'Panama',
    service_type: commercial?.webPlanId ?? commercial?.marketingPlanId ?? null,
    service_label: commercial?.webLabel ?? commercial?.marketingLabel ?? 'Servicio',
    total_amount: commercial?.totals.oneTime ?? commercial?.totals.monthly ?? 0,
    currency: 'USD',
    signed_date: null,
    custom_notes: null,
    terms_payload: commercial ? { commercial, configurator: {} } : null,
  }
}

type Scenario = { name: string; run: () => { ok: boolean; detail?: string } }

const scenarios: Scenario[] = []

for (const plan of WEB_PLANS) {
  scenarios.push({
    name: `Web ${plan.label} USD ${plan.basePrice}`,
    run() {
      const state = baseState({ projectType: plan.id as WebPlanId, webPlanIds: [plan.id as WebPlanId] })
      const snap = buildCommercialSnapshot(state)
      if (!snap || snap.totals.oneTime !== plan.basePrice) {
        return { ok: false, detail: `oneTime=${snap?.totals.oneTime}` }
      }
      const raw = enrichQuotePayloadForContract({ configurator: state, commercial: snap })
      const terms = deriveContractTermsFromQuote(raw)
      if (!terms || terms.revisionRounds !== '2') return { ok: false, detail: 'terms/revision' }
      const advance = plan.basePrice / 2
      if (!terms.advanceNote.includes(advance.toFixed(2))) return { ok: false, detail: 'anticipo 50%' }
      const contract = mockContract(snap)
      contract.terms_payload = {
        ...contract.terms_payload,
        commercial: { ...snap, ...terms, revisionRounds: 2, paymentMethod: terms.paymentMethod },
      }
      const commercial = readCommercialSnapshot(contract.terms_payload)
      if (!commercial) return { ok: false, detail: 'snapshot' }
      const clauses = buildCommercialContractClauses(contract, commercial, buildContractIntroSegments(contract))
      const hasCourtesySection = clauses.blocks.some((b) => /COMPLEMENTARIAS/i.test(b.title))
      const hasRevision = clauses.blocks.some((b) => /REVISI/i.test(b.title))
      const hasEconomic = clauses.blocks.some((b) => /RESUMEN ECON/i.test(b.title))
      if (!hasRevision || !hasEconomic) return { ok: false, detail: 'clauses' }
      if ((snap.courtesyAddons?.length ?? 0) > 0 && !hasCourtesySection) {
        return { ok: false, detail: 'cortesia' }
      }
      return { ok: true }
    },
  })
}

for (const plan of MARKETING_PLANS) {
  scenarios.push({
    name: `Marketing ${plan.label}`,
    run() {
      const state = baseState({
        projectType: plan.id as MarketingPlanId,
        marketingPlan: plan.id as MarketingPlanId,
        adBudgetChoice: (plan.campaignsIncluded ?? 0) > 0 ? 'pending' : 'none',
      })
      const snap = buildCommercialSnapshot(state)
      if (!snap || snap.totals.monthly !== plan.basePrice) {
        return { ok: false, detail: `monthly=${snap?.totals.monthly}` }
      }
      if (!snap.storiesIncluded || (snap.storiesPerWeek ?? 0) !== 3) {
        return { ok: false, detail: 'historias' }
      }
      if ((plan.reelsPerMonth ?? 0) === 0 && (snap.reelsPerMonth ?? 0) > 0) {
        return { ok: false, detail: 'reels extra' }
      }
      const clauses = buildCommercialContractClauses(
        mockContract(snap),
        snap,
        buildContractIntroSegments(mockContract(snap)),
      )
      const hasMkt = clauses.blocks.some((b) => /APARTADO B/i.test(b.title))
      const noWebRevision = !clauses.blocks.some((b) => /RONDAS DE REVISI/i.test(b.title))
      if (!hasMkt) return { ok: false, detail: 'apartado B' }
      if (plan.id === 'mkt-presencia') {
        const adClause = clauses.blocks.some((b) => /PUBLICITARIO|Meta/i.test(JSON.stringify(b)))
        if (!adClause) return { ok: false, detail: 'presencia sin pauta copy' }
      }
      return { ok: true, detail: plan.id === 'mkt-presencia' ? undefined : noWebRevision ? undefined : 'ok' }
    },
  })
}

scenarios.push({
  name: 'Web + marketing combinado',
  run() {
    const state = baseState({
      projectType: 'profesional',
      webPlanIds: ['profesional'],
      marketingPlan: 'mkt-crecimiento',
      adBudgetChoice: 'pending',
    })
    const snap = buildCommercialSnapshot(state)
    if (!snap?.webPlanId || !snap.marketingPlanId) return { ok: false, detail: 'combo' }
    const clauses = buildCommercialContractClauses(
      mockContract(snap),
      snap,
      buildContractIntroSegments(mockContract(snap)),
    )
    const a = clauses.blocks.some((b) => /APARTADO A/i.test(b.title))
    const b = clauses.blocks.some((b) => /APARTADO B/i.test(b.title))
    const ind = clauses.blocks.some((b) => /INDEPENDIENTES/i.test(b.title))
    return { ok: a && b && ind }
  },
})

scenarios.push({
  name: 'Pauta aprobada vs pendiente',
  run() {
    const pending = buildCommercialSnapshot(
      baseState({
        projectType: 'mkt-crecimiento',
        marketingPlan: 'mkt-crecimiento',
        adBudgetChoice: 'pending',
      }),
    )
    const approved = buildCommercialSnapshot(
      baseState({
        projectType: 'mkt-crecimiento',
        marketingPlan: 'mkt-crecimiento',
        adBudgetChoice: 'accepted',
      }),
    )
    if (!pending || !approved) return { ok: false }
    if ((pending.totals.approvedAdBudget ?? 0) !== 0) return { ok: false, detail: 'pending' }
    if ((approved.totals.approvedAdBudget ?? 0) <= 0) return { ok: false, detail: 'approved' }
    return { ok: true }
  },
})

scenarios.push({
  name: 'Panel USD 199 no se reemplaza por profesional USD 150',
  run() {
    const raw = {
      configurator: {
        projectType: 'web-panel',
        webPlanIds: ['web-panel'],
        features: [],
        hasDomain: 'si',
        hasHosting: 'si',
        emailCount: 0,
        channels: ['instagram', 'facebook'],
      },
      breakdown: {
        lines: [{ label: 'Sitio Web con Panel de Administración', amount: 199 }],
      },
      totalNumeric: 199,
      commercial: {
        webPlanId: 'profesional',
        webPlans: [{ id: 'profesional', label: 'Profesional', basePrice: 150 }],
        totals: { lines: [{ id: 'project-profesional', label: 'x', amount: 150, billing: 'once' }], oneTime: 150, monthly: 0, external: 0, initialFees: 150, nextMonthly: 0, approvedAdBudget: 0, pendingAdBudget: 0, recommendedAdBudget: 0, projectedInitial: 150, projectedMonthly: 0, taxRate: null, taxAmount: 0, storiesPending: false },
      },
    }
    const a = assessQuoteForContract(raw, { totalAmount: 199, serviceId: 'web-panel', serviceLabel: 'Panel' })
    if (!a.aligned || a.incomplete) return { ok: false, detail: 'incomplete' }
    if (a.displayWebOnce !== 199) return { ok: false, detail: `oneTime=${a.displayWebOnce}` }
    if (a.aligned.webPlanId !== 'web-panel') return { ok: false, detail: `plan=${a.aligned.webPlanId}` }
    const terms = deriveContractTermsFromQuote(raw, { totalAmount: 199, serviceId: 'web-panel' })
    if (!terms?.advanceNote.includes('99.50')) return { ok: false, detail: 'anticipo' }
    return { ok: true }
  },
})

scenarios.push({
  name: 'Reservas: Pasarela en nombre no es gasto externo',
  run() {
    const raw = {
      configurator: {
        projectType: 'reservas',
        webPlanIds: ['reservas'],
        features: ['payment-gateway'],
        hasDomain: 'si',
        hasHosting: 'si',
        emailCount: 0,
        channels: ['instagram', 'facebook'],
      },
      breakdown: {
        lines: [
          { label: 'Sistema Web de Reservas con Pasarela de Pago', amount: 450 },
          { label: 'Ajuste comercial', amount: -5 },
        ],
      },
      totalNumeric: 445,
      servicio: 'Sistema Web de Reservas con Pasarela de Pago',
      tipoServicio: 'reservas',
    }
    const a = assessQuoteForContract(raw, {
      totalAmount: 445,
      serviceId: 'reservas',
      serviceLabel: 'Sistema Web de Reservas con Pasarela de Pago',
    })
    if (a.incomplete) return { ok: false, detail: `incomplete warnings=${a.warnings.join(';')}` }
    if (a.displayWebOnce < 444.99 || a.displayWebOnce > 445.01) {
      return { ok: false, detail: `oneTime=${a.displayWebOnce}` }
    }
    const single = deriveContractTermsFromQuote(raw, { totalAmount: 445, serviceId: 'reservas' }, { webInstallmentPlan: 'single' })
    if (!single?.advanceNote.includes('445.00')) return { ok: false, detail: 'single' }
    const thirds = deriveContractTermsFromQuote(raw, { totalAmount: 445, serviceId: 'reservas' }, { webInstallmentPlan: 'three-thirds' })
    if (!thirds?.paymentSchedule.includes('Cuota 3')) return { ok: false, detail: 'thirds' }
    return { ok: true }
  },
})

scenarios.push({
  name: 'Términos listos con snapshot congelado',
  run() {
    const state = baseState({ projectType: 'web-panel', webPlanIds: ['web-panel'] })
    const snap = buildCommercialSnapshot(state)!
    const raw = enrichQuotePayloadForContract({ configurator: state })
    const derived = deriveContractTermsFromQuote(raw)!
    const merged = {
      ...snap,
      ...derived,
      revisionRounds: 2,
      paymentMethod: derived.paymentMethod,
      advanceNote: derived.advanceNote,
      balanceNote: derived.balanceNote,
      paymentSchedule: derived.paymentSchedule,
      startDate: derived.startDate,
      deliveryDate: derived.deliveryDate,
      termNote: derived.termNote,
      renewalNote: derived.renewalNote,
      terminationNote: derived.terminationNote,
    }
    if (!commercialTermsReady(merged)) return { ok: false, detail: 'not ready' }
    return { ok: true }
  },
})

let passed = 0
let failed = 0
for (const s of scenarios) {
  const result = s.run()
  if (result.ok) {
    passed++
    console.log(`OK  ${s.name}`)
  } else {
    failed++
    console.log(`FAIL ${s.name}${result.detail ? ` — ${result.detail}` : ''}`)
  }
}

console.log(`\n${passed} passed, ${failed} failed (${scenarios.length} total)`)
process.exit(failed > 0 ? 1 : 0)
