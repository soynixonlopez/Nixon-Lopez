import { priceCommercial } from '../src/lib/service-catalog.ts'
import { calculateQuote, INITIAL_CONFIGURATOR_STATE } from '../src/lib/quote-configurator.ts'
import { mergeCourtesyCatalog, resolveCourtesyAddonsForWebPlans } from '../src/lib/courtesy-addons.ts'

const ctx = { courtesyCatalog: mergeCourtesyCatalog([]) }
const cases = [
  {
    name: 'Landing $99 + cortesías',
    state: {
      ...INITIAL_CONFIGURATOR_STATE,
      projectType: 'landing',
      webPlanIds: ['landing'],
      features: ['whatsapp', 'formulario', 'galeria'],
    },
    expectOneTime: 99 + 20,
  },
  {
    name: 'Corporativo $250 sin extras',
    state: {
      ...INITIAL_CONFIGURATOR_STATE,
      projectType: 'corporativo',
      webPlanIds: ['corporativo'],
      features: ['whatsapp', 'formulario'],
    },
    expectOneTime: 250,
  },
  {
    name: 'Tienda $299 cortesía mapa no cobra',
    state: {
      ...INITIAL_CONFIGURATOR_STATE,
      projectType: 'tienda',
      webPlanIds: ['tienda'],
      features: ['whatsapp', 'mapa'],
    },
    expectOneTime: 299,
  },
  {
    name: 'Web $250 + marketing $250',
    state: {
      ...INITIAL_CONFIGURATOR_STATE,
      projectType: 'corporativo',
      webPlanIds: ['corporativo'],
      marketingPlan: 'mkt-crecimiento',
      features: [],
    },
    expectOneTime: 250,
    expectMonthly: 250,
  },
  {
    name: 'Solo marketing',
    state: {
      ...INITIAL_CONFIGURATOR_STATE,
      marketingPlan: 'mkt-presencia',
      features: [],
    },
    expectOneTime: 0,
    expectMonthly: 150,
  },
]

let failed = 0
for (const item of cases) {
  const quote = calculateQuote(item.state, ctx)
  const okOne = quote.oneTime === item.expectOneTime
  const okMonthly = item.expectMonthly == null || quote.monthlyAmount === item.expectMonthly
  const courtesy = resolveCourtesyAddonsForWebPlans(item.state.webPlanIds, ctx.courtesyCatalog)
  const courtesyCharge = quote.lines.filter((line) => line.id.startsWith('feature-') && courtesy.some((c) => line.id.includes(c.id)))
  if (!okOne || !okMonthly || courtesyCharge.length > 0) {
    failed += 1
    console.error('FAIL', item.name, { oneTime: quote.oneTime, monthly: quote.monthlyAmount, lines: quote.lines })
  } else {
    console.log('OK', item.name, { oneTime: quote.oneTime, monthly: quote.monthlyAmount, courtesy: courtesy.length })
  }
}

const priced = priceCommercial({
  webPlanId: 'landing',
  marketingPlanId: null,
  extraPages: 0,
  featureLines: [
    { id: 'whatsapp', label: 'WhatsApp', amount: 0, includedInPlan: true },
    { id: 'galeria', label: 'Galería', amount: 20, includedInPlan: false },
  ],
  includeStories: false,
  storiesPerMonth: 0,
  storiesUnitPrice: 0,
  adBudgetAccepted: false,
  adBudgetUsd: 0,
  adsSetupPrice: 0,
  hasDomain: 'si',
  hasHosting: 'si',
  emailCount: 0,
  taxRate: null,
})
if (priced.oneTime !== 99 + 20) {
  failed += 1
  console.error('FAIL priceCommercial courtesy filter', priced.oneTime)
} else {
  console.log('OK priceCommercial splits courtesy vs billable')
}

process.exit(failed > 0 ? 1 : 0)
