/**
 * Lista cotizaciones que requieren revisión antes de contrato (solo lectura lógica sobre payloads de ejemplo).
 * Para auditar BD: conectar Supabase en un script aparte con service role.
 * Ejecutar: npx tsx scripts/audit-quotes-commercial.ts
 */
import { assessQuoteForContract } from '../src/lib/contract-terms-from-quote'

const samples = [
  {
    name: 'Legacy sin commercial',
    raw: { totalNumeric: 150, tipoServicio: 'profesional', servicio: 'Web profesional' },
    meta: { totalAmount: 150, serviceId: 'profesional', serviceLabel: 'Web' },
  },
  {
    name: 'Breakdown panel 199',
    raw: {
      configurator: { projectType: 'web-panel', webPlanIds: ['web-panel'] },
      breakdown: { lines: [{ label: 'Panel', amount: 199 }] },
      totalNumeric: 199,
    },
    meta: { totalAmount: 199, serviceId: 'web-panel', serviceLabel: 'Panel' },
  },
]

for (const sample of samples) {
  const a = assessQuoteForContract(sample.raw, sample.meta)
  console.log(`\n${sample.name}`)
  console.log(`  incomplete: ${a.incomplete}`)
  console.log(`  web: ${a.displayWebOnce}  monthly: ${a.displayMonthly}`)
  if (a.warnings.length) console.log(`  warnings: ${a.warnings.join(' | ')}`)
}
