import Image from 'next/image'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { CONTRACT_PAYMENT_BANK, CONTRACT_PAYMENT_YAPPY } from '@/lib/contract-payment'
import { buildContractClauses, type ContractClauseBlock } from '@/lib/contracts'
import type { ServiceContractRecord } from '@/lib/types/contract'

function KeyField({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-bold underline decoration-slate-800 underline-offset-2">{children}</span>
  )
}

export function ContractPrintView({ contract }: { contract: ServiceContractRecord }) {
  const c = buildContractClauses(contract)
  const clientTax = contract.client_tax_id?.trim() || ''

  return (
    <article
      id="contract-print-root"
      className="mx-auto w-full max-w-[210mm] bg-white text-slate-900 border border-slate-200 shadow-xl print:shadow-none print:border-0 print:max-w-none print:overflow-visible"
    >
      <header className="px-8 pt-8 pb-6 border-b border-slate-200">
        <div className="flex items-start justify-between gap-6">
          <div className="relative h-16 w-56">
            <Image
              src={INVOICE_BRANDING.logoPath}
              alt={INVOICE_BRANDING.logoAlt}
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="text-right">
            <p className="text-lg font-bold leading-tight sm:text-xl" style={{ color: INVOICE_BRANDING.accentHex }}>
              CONTRATO DE PRESTACIÓN
              <br />
              DE SERVICIOS TECNOLÓGICOS
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {c.serviceSubtitle}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Contrato No.: <KeyField>{contract.contract_number}</KeyField>
            </p>
          </div>
        </div>
      </header>

      <main className="space-y-5 px-8 py-6 text-sm leading-relaxed">
        <p className="text-justify">
          {c.introSegments.map((seg, idx) =>
            seg.kind === 'key' ? (
              <KeyField key={idx}>{seg.value}</KeyField>
            ) : (
              <span key={idx}>{seg.value}</span>
            )
          )}
        </p>

        {c.blocks.map((block) => (
          <ClauseBlockView key={block.title} block={block} />
        ))}

        {/* Datos de pago junto a la cláusula de costo: se muestran al final del bloque de pago si no están ya */}
        <section className="print:break-inside-avoid">
          <h3 className="mb-2 font-bold uppercase text-slate-800">Datos para el pago</h3>
          <div className="space-y-4">
            <PaymentTable
              title={CONTRACT_PAYMENT_BANK.title}
              rows={[
                { label: 'Banco', value: CONTRACT_PAYMENT_BANK.bankName },
                { label: 'Tipo de cuenta', value: CONTRACT_PAYMENT_BANK.accountType },
                { label: 'Titular', value: CONTRACT_PAYMENT_BANK.holder, emphasize: true },
                { label: 'No. de cuenta', value: CONTRACT_PAYMENT_BANK.accountNumber, emphasize: true },
              ]}
            />
            <PaymentTable
              title={CONTRACT_PAYMENT_YAPPY.title}
              rows={[
                { label: 'Nombre en Yappy', value: CONTRACT_PAYMENT_YAPPY.displayName, emphasize: true },
                { label: 'Teléfono', value: CONTRACT_PAYMENT_YAPPY.phone, emphasize: true },
              ]}
            />
          </div>
        </section>
      </main>

      <footer className="px-8 pb-10 pt-4 text-sm">
        <p className="text-justify">
          En la ciudad de <KeyField>{contract.city || '________________'}</KeyField>, a los ____ días del mes de
          __________ del año ______.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="font-semibold">EL PRESTADOR</p>
              <p>
                <KeyField>{INVOICE_BRANDING.publicName}</KeyField>
              </p>
              <p className="mt-1 text-xs text-slate-600">
                RUC <KeyField>{INVOICE_BRANDING.ruc}</KeyField>
              </p>
            </div>
            <div>
              <div className="min-h-[2.25rem] border-b border-slate-900" aria-hidden />
              <p className="mt-1 text-xs text-slate-600">Firma</p>
            </div>
            <div>
              <div className="min-h-[2.25rem] border-b border-slate-900" aria-hidden />
              <p className="mt-1 text-xs text-slate-600">Nombre (letra de molde)</p>
              <p className="mt-2 font-bold">
                <KeyField>{INVOICE_BRANDING.signatoryLegalName}</KeyField>
              </p>
              <p className="mt-2 text-xs text-slate-600">Fecha: ____________________</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <p className="font-semibold">EL CLIENTE</p>
              <p>
                <KeyField>{contract.client_name}</KeyField>
              </p>
              {contract.client_address ? (
                <p className="mt-1 text-xs text-slate-600">
                  Domicilio: <KeyField>{contract.client_address}</KeyField>
                </p>
              ) : null}
              {clientTax ? (
                <p className="mt-1 text-xs text-slate-600">
                  Cédula / RUC: <KeyField>{clientTax}</KeyField>
                </p>
              ) : null}
            </div>
            <div>
              <div className="min-h-[2.25rem] border-b border-slate-900" aria-hidden />
              <p className="mt-1 text-xs text-slate-600">Firma</p>
            </div>
            <div>
              <div className="min-h-[2.25rem] border-b border-slate-900" aria-hidden />
              <p className="mt-1 text-xs text-slate-600">Nombre (letra de molde)</p>
              <p className="mt-2 font-bold">
                <KeyField>{contract.client_name}</KeyField>
              </p>
              <p className="mt-2 text-xs text-slate-600">Fecha: ____________________</p>
            </div>
          </div>
        </div>
      </footer>
    </article>
  )
}

function ClauseBlockView({ block }: { block: ContractClauseBlock }) {
  return (
    <section className="print:break-inside-avoid">
      <h3 className="mb-1 font-bold uppercase text-slate-800">{block.title}</h3>
      {block.paragraphs?.map((p) => (
        <p key={p.slice(0, 48)} className="mb-2 text-justify">
          {p}
        </p>
      ))}
      {block.bullets?.length ? (
        <ul className="mb-2 list-disc space-y-1 pl-5">
          {block.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {block.afterBullets?.map((p) => (
        <p key={p.slice(0, 48)} className="mb-2 text-justify">
          {p}
        </p>
      ))}
      {block.subsections?.map((sub) => (
        <div key={sub.heading} className="mt-2">
          <p className="font-semibold text-slate-800">{sub.heading}</p>
          {sub.paragraphs?.map((p) => (
            <p key={p.slice(0, 40)} className="mb-1 text-justify">
              {p}
            </p>
          ))}
          {sub.bullets?.length ? (
            <ul className="list-disc space-y-1 pl-5">
              {sub.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </section>
  )
}

function PaymentTable({
  title,
  rows,
}: {
  title: string
  rows: { label: string; value: string; emphasize?: boolean }[]
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-300 print:overflow-visible">
      <p className="bg-slate-100 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-800">
        {title}
      </p>
      <table className="w-full border-collapse text-xs">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-slate-200">
              <td className="w-[38%] px-3 py-2 align-top font-medium text-slate-600">{r.label}</td>
              <td className="px-3 py-2 text-slate-900">
                {r.emphasize ? <KeyField>{r.value}</KeyField> : r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
