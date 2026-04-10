import Image from 'next/image'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { CONTRACT_PAYMENT_BANK, CONTRACT_PAYMENT_YAPPY } from '@/lib/contract-payment'
import { buildContractClauses } from '@/lib/contracts'
import type { ServiceContractRecord } from '@/lib/types/contract'

function KeyField({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-bold underline decoration-slate-800 underline-offset-2">{children}</span>
  )
}

export function ContractPrintView({ contract }: { contract: ServiceContractRecord }) {
  const c = buildContractClauses(contract)
  return (
    <article className="mx-auto w-full max-w-[210mm] bg-white text-slate-900 border border-slate-200 shadow-xl print:shadow-none print:border-0">
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
            <p className="text-2xl font-bold" style={{ color: INVOICE_BRANDING.accentHex }}>
              CONTRATO DE SERVICIOS
            </p>
            <p className="text-xs text-slate-500 mt-1">
              No. <KeyField>{contract.contract_number}</KeyField>
            </p>
          </div>
        </div>
      </header>

      <main className="px-8 py-6 space-y-5 text-sm leading-relaxed">
        <p className="text-justify">
          {c.introSegments.map((seg, i) =>
            seg.kind === 'key' ? (
              <KeyField key={i}>{seg.value}</KeyField>
            ) : (
              <span key={i}>{seg.value}</span>
            )
          )}
        </p>

        <Clause title="PRIMERA: OBJETO DEL CONTRATO">
          <p className="text-justify">{c.primera}</p>
        </Clause>

        <Clause title="SEGUNDA: ALCANCE DEL SERVICIO">
          <p className="font-semibold text-slate-800">El servicio incluye:</p>
          <ul className="list-disc pl-5 space-y-1">
            {c.segundaIncluye.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
          <p className="font-semibold text-slate-800 mt-2">No incluye:</p>
          <ul className="list-disc pl-5 space-y-1">
            {c.segundaNoIncluye.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </Clause>

        <Clause title="TERCERA: COSTO Y FORMA DE PAGO">
          <ul className="list-disc pl-5 space-y-1">
            {c.tercera.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
          <div className="mt-4 space-y-4">
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
        </Clause>

        <Clause title="CUARTA: DOMINIO, HOSTING Y CORREO">
          <ul className="list-disc pl-5 space-y-1">
            {c.cuarta.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </Clause>

        <Clause title="QUINTA: PLAZO DE ENTREGA">
          <p className="text-justify">{c.quinta}</p>
        </Clause>

        <Clause title="SEXTA: PROPIEDAD INTELECTUAL">
          <ul className="list-disc pl-5 space-y-1">
            <li>Una vez realizado el pago total, EL CLIENTE será propietario del producto final entregado.</li>
            <li>EL PRESTADOR podrá mostrar el proyecto en su portafolio profesional.</li>
            <li>El código base reutilizable seguirá siendo propiedad intelectual del PRESTADOR.</li>
          </ul>
        </Clause>

        <Clause title="SEPTIMA: MANTENIMIENTO Y SOPORTE">
          <p className="text-justify">
            El mantenimiento mensual o bimestral tendrá un costo de USD $20 e incluye actualizaciones técnicas, supervisión básica, ajustes menores y soporte preventivo.
          </p>
        </Clause>

        <Clause title="OCTAVA: CANCELACION">
          <ul className="list-disc pl-5 space-y-1">
            <li>Si EL CLIENTE cancela el proyecto, el anticipo no será reembolsable.</li>
            <li>Si EL PRESTADOR cancela sin causa justificada, deberá devolver el anticipo recibido.</li>
          </ul>
        </Clause>

        <Clause title="NOVENA: LEGISLACION APLICABLE">
          <p className="text-justify">
            El presente contrato se rige por las leyes de la República de Panamá. Cualquier disputa será resuelta ante los tribunales competentes de Panamá.
          </p>
        </Clause>

        {contract.custom_notes ? (
          <Clause title="OBSERVACIONES ADICIONALES">
            <p className="whitespace-pre-wrap">{contract.custom_notes}</p>
          </Clause>
        ) : null}
      </main>

      <footer className="px-8 pb-10 pt-4 text-sm">
        <p className="text-justify">
          En la ciudad de <KeyField>{contract.city || '________________'}</KeyField>, a los ____ días del mes de
          __________ del año ______.
        </p>
        <div className="grid sm:grid-cols-2 gap-8 mt-10">
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
              <div className="border-b border-slate-900 min-h-[2.25rem]" aria-hidden />
              <p className="mt-1 text-xs text-slate-600">Firma</p>
            </div>
            <div>
              <div className="border-b border-slate-900 min-h-[2.25rem]" aria-hidden />
              <p className="mt-1 text-xs text-slate-600">Nombre (letra de molde)</p>
              <p className="mt-2 font-bold">
                <KeyField>{INVOICE_BRANDING.signatoryLegalName}</KeyField>
              </p>
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
            </div>
            <div>
              <div className="border-b border-slate-900 min-h-[2.25rem]" aria-hidden />
              <p className="mt-1 text-xs text-slate-600">Firma</p>
            </div>
            <div>
              <div className="border-b border-slate-900 min-h-[2.25rem]" aria-hidden />
              <p className="mt-1 text-xs text-slate-600">Nombre (letra de molde)</p>
              <p className="mt-2 font-bold">
                <KeyField>{contract.client_name}</KeyField>
              </p>
              <p className="mt-2 text-sm">
                Cédula / RUC: <KeyField>{contract.client_tax_id || '________________________'}</KeyField>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </article>
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
    <div className="rounded-lg border border-slate-300 overflow-hidden">
      <p className="bg-slate-100 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-800">{title}</p>
      <table className="w-full text-xs border-collapse">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-slate-200">
              <td className="w-[38%] px-3 py-2 align-top text-slate-600 font-medium">{r.label}</td>
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

function Clause({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-bold uppercase text-slate-800 mb-1">{title}</h3>
      {children}
    </section>
  )
}
