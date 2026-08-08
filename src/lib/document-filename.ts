/** Nombres de archivo para PDF de cotización / contrato (descargas y adjuntos). */

export function slugifyFilenamePart(input: string, max = 48): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
}

type DocKind = 'Cotizacion' | 'Contrato'

export function buildClientDocumentFilename(input: {
  kind: DocKind
  clientName: string
  company?: string | null
  ref?: string | null
}): string {
  const client = slugifyFilenamePart(input.clientName.trim()) || 'Cliente'
  const company = input.company?.trim() ? slugifyFilenamePart(input.company.trim()) : ''
  const ref = input.ref?.trim() ? slugifyFilenamePart(input.ref.trim(), 28) : ''
  const parts = [input.kind, client, company || null, ref || null].filter(Boolean)
  return `${parts.join('_')}.pdf`
}

/** Título sugerido al imprimir/guardar PDF desde el navegador. */
export function buildClientDocumentPrintTitle(input: {
  kind: DocKind
  clientName: string
  company?: string | null
  ref?: string | null
}): string {
  const company = input.company?.trim()
  const ref = input.ref?.trim()
  const who = company ? `${input.clientName.trim()} — ${company}` : input.clientName.trim()
  const base = `${input.kind} ${who || 'Cliente'}`
  return ref ? `${base} (${ref})` : base
}

export function contentDispositionAttachment(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7E]/g, '_')
  const encoded = encodeURIComponent(filename)
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`
}

export function contentDispositionInline(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7E]/g, '_')
  const encoded = encodeURIComponent(filename)
  return `inline; filename="${ascii}"; filename*=UTF-8''${encoded}`
}
