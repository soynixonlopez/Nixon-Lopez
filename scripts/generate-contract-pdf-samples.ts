/**
 * Genera PDF de contrato de muestra (sin BD). Salida: .tmp/contract-samples/
 * npx tsx scripts/generate-contract-pdf-samples.ts
 */
import fs from 'fs'
import path from 'path'
import { buildCommercialSnapshot, type ConfiguratorState } from '../src/lib/quote-configurator'
import { enrichQuotePayloadForContract, deriveContractTermsFromQuote } from '../src/lib/contract-terms-from-quote'
import { generateContractPdfBuffer } from '../src/lib/pdf/generateContractPdf'
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

const scenarios: { name: string; state: Partial<ConfiguratorState> }[] = [
  { name: 'web-corporativo-250', state: { projectType: 'corporativo', webPlanIds: ['corporativo'] } },
  {
    name: 'mkt-crecimiento-250-pending-ad',
    state: { projectType: 'mkt-crecimiento', marketingPlan: 'mkt-crecimiento', adBudgetChoice: 'pending' },
  },
  {
    name: 'web-corporativo-plus-mkt',
    state: {
      projectType: 'corporativo',
      webPlanIds: ['corporativo'],
      marketingPlan: 'mkt-crecimiento',
      adBudgetChoice: 'pending',
    },
  },
  { name: 'tienda-299', state: { projectType: 'tienda', webPlanIds: ['tienda'] } },
  {
    name: 'mkt-crecimiento-ad-approved',
    state: { projectType: 'mkt-crecimiento', marketingPlan: 'mkt-crecimiento', adBudgetChoice: 'accepted' },
  },
]

async function main() {
const outDir = path.join(process.cwd(), '.tmp', 'contract-samples')
fs.mkdirSync(outDir, { recursive: true })

for (const scenario of scenarios) {
  const state = baseState(scenario.state)
  const snap = buildCommercialSnapshot(state)
  if (!snap) {
    console.error('FAIL', scenario.name, 'no snapshot')
    process.exitCode = 1
    continue
  }
  const raw = enrichQuotePayloadForContract({ configurator: state, commercial: snap })
  const terms = deriveContractTermsFromQuote(raw, {
    totalAmount: snap.totals.initialFees,
    serviceId: snap.webPlanId ?? snap.marketingPlanId,
    serviceLabel: snap.webLabel ?? snap.marketingLabel ?? 'Servicio',
  })
  const commercial = {
    ...snap,
    revisionRounds: 2,
    paymentMethod: terms?.paymentMethod ?? '',
    advanceNote: terms?.advanceNote ?? '',
    balanceNote: terms?.balanceNote ?? '',
    paymentSchedule: terms?.paymentSchedule ?? '',
    startDate: terms?.startDate ?? '',
    deliveryDate: terms?.deliveryDate ?? '',
    termNote: terms?.termNote ?? '',
    renewalNote: terms?.renewalNote ?? '',
    terminationNote: terms?.terminationNote ?? '',
    marketingStartDate: terms?.marketingStartDate ?? '',
    marketingFirstPayment: terms?.marketingFirstPayment ?? '',
  }
  const contract: ServiceContractRecord = {
    id: 'sample',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    contract_number: `SAMPLE-${scenario.name}`,
    status: 'draft',
    quote_id: null,
    client_name: 'Cliente Prueba PDF',
    client_email: 'cliente@example.com',
    client_tax_id: '8-888-888',
    client_address: 'Ciudad de Panama',
    city: 'Panama',
    service_type: snap.webPlanId ?? snap.marketingPlanId,
    service_label: snap.webLabel ?? snap.marketingLabel ?? 'Servicio',
    total_amount: snap.totals.initialFees,
    currency: 'USD',
    signed_date: null,
    custom_notes: null,
    terms_payload: { commercial, configurator: state, commercial_contract_meta: { incomplete: false, warnings: [] } },
  }
  const pdf = await generateContractPdfBuffer(contract)
  const file = path.join(outDir, `${scenario.name}.pdf`)
  fs.writeFileSync(file, Buffer.from(pdf))
  console.log('OK', file, `web=${snap.totals.oneTime} mkt=${snap.totals.monthly}`)
}
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
