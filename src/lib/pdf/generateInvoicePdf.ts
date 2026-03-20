import fs from 'fs'
import path from 'path'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { INVOICE_BRANDING, documentTitle } from '@/lib/invoice-branding'
import type { InvoiceRecord, InvoiceLineRow } from '@/lib/types/invoice'

const PAGE_W = 595.28
const PAGE_H = 841.89
const M = 48
const ACCENT = INVOICE_BRANDING.accentHex

function hexToRgb01(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  }
}

function fmtMoney(n: number, currency: string) {
  return new Intl.NumberFormat('es-PA', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'USD',
    minimumFractionDigits: 2,
  }).format(n)
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleDateString('es-PA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/** y desde arriba (como en diseño) */
function yTop(page: { getHeight: () => number }, fromTop: number) {
  return page.getHeight() - fromTop
}

export async function generateInvoicePdfBuffer(
  invoice: InvoiceRecord,
  lines: InvoiceLineRow[]
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([PAGE_W, PAGE_H])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const ac = hexToRgb01(ACCENT)
  const colorAccent = rgb(ac.r, ac.g, ac.b)
  const colorText = rgb(0.15, 0.18, 0.22)
  const colorMuted = rgb(0.35, 0.38, 0.42)

  let cursorY = 52

  // Logo + nombre comercial + datos (misma jerarquía que la vista HTML)
  const logoPath = path.join(process.cwd(), 'public', INVOICE_BRANDING.logoPath.replace(/^\//, ''))
  try {
    const logoBytes = fs.readFileSync(logoPath)
    const img = await pdf.embedPng(logoBytes)
    const maxW = 200
    const scale = maxW / img.width
    const h = img.height * scale
    page.drawImage(img, {
      x: M,
      y: yTop(page, cursorY + h),
      width: maxW,
      height: h,
    })
    cursorY += h + 8
  } catch {
    cursorY += 4
  }

  const title = documentTitle(invoice.invoice_kind)
  page.drawText(title, {
    x: PAGE_W - M - fontBold.widthOfTextAtSize(title, 22),
    y: yTop(page, 52),
    size: 22,
    font: fontBold,
    color: colorAccent,
  })

  const bizName = INVOICE_BRANDING.businessName
  page.drawText(bizName, {
    x: M,
    y: yTop(page, cursorY),
    size: 13,
    font: fontBold,
    color: colorAccent,
  })
  cursorY += 16

  page.drawText(INVOICE_BRANDING.businessSubtitle, {
    x: M,
    y: yTop(page, cursorY),
    size: 9,
    font,
    color: colorText,
  })
  cursorY += 14
  cursorY += 4

  const addrLines = [
    `RUC: ${INVOICE_BRANDING.ruc}`,
    INVOICE_BRANDING.addressLine1,
    INVOICE_BRANDING.addressLine2,
    INVOICE_BRANDING.country,
    INVOICE_BRANDING.email,
  ]
  if (INVOICE_BRANDING.phone) addrLines.push(`Tel: ${INVOICE_BRANDING.phone}`)

  for (const line of addrLines) {
    page.drawText(line, {
      x: M,
      y: yTop(page, cursorY),
      size: 8,
      font,
      color: colorMuted,
    })
    cursorY += 11
  }

  const blockTop = Math.max(168, cursorY + 28)

  const issued = invoice.issued_at
    ? fmtDate(invoice.issued_at)
    : fmtDate(invoice.created_at)

  const terms =
    invoice.terms?.trim() ||
    (invoice.invoice_kind === 'prefactura'
      ? 'Condiciones según acuerdo comercial.'
      : 'Pago según condiciones acordadas.')

  // Bloque facturar a
  page.drawRectangle({
    x: M,
    y: yTop(page, blockTop + 18),
    width: 240,
    height: 18,
    color: colorAccent,
  })
  page.drawText('FACTURAR A', {
    x: M + 8,
    y: yTop(page, blockTop + 6),
    size: 9,
    font: fontBold,
    color: rgb(1, 1, 1),
  })

  let cy = blockTop + 28
  const clientBlock = [
    invoice.client_name,
    invoice.client_tax_id ? `RUC / ID: ${invoice.client_tax_id}` : '',
    invoice.client_address ?? '',
    invoice.client_email ?? '',
  ].filter(Boolean)

  for (const line of clientBlock) {
    page.drawText(line.length > 55 ? `${line.slice(0, 52)}...` : line, {
      x: M + 6,
      y: yTop(page, cy),
      size: 9,
      font,
      color: colorText,
    })
    cy += 12
  }

  // Metadatos derecha
  const mx = PAGE_W / 2 + 10
  const statusEs = (() => {
    const m: Record<string, string> = {
      draft: 'Borrador',
      sent: 'Enviada',
      partially_paid: 'Pago parcial',
      paid: 'Pagada',
      cancelled: 'Anulada',
    }
    return m[invoice.invoice_status] ?? invoice.invoice_status
  })()

  const meta = [
    ['Nº documento', invoice.invoice_number],
    ['Fecha', issued],
    ['Estado', statusEs],
    ['Términos', terms.length > 42 ? `${terms.slice(0, 40)}…` : terms],
  ]
  let my = blockTop
  for (const [lab, val] of meta) {
    page.drawRectangle({
      x: mx,
      y: yTop(page, my + 36),
      width: PAGE_W - M - mx,
      height: 14,
      color: colorAccent,
    })
    page.drawText(lab, {
      x: mx + 4,
      y: yTop(page, my + 26),
      size: 7,
      font: fontBold,
      color: rgb(1, 1, 1),
    })
    page.drawText(val, {
      x: mx + 4,
      y: yTop(page, my + 44),
      size: 8,
      font,
      color: colorText,
    })
    my += 52
  }

  // Tabla
  const tableTop = Math.max(cy + 16, my + 16, 300)
  const rowH = 16
  const colDesc = M
  const colQty = PAGE_W - M - 200
  const colUnit = PAGE_W - M - 130
  const colAmt = PAGE_W - M - 60

  page.drawRectangle({
    x: M,
    y: yTop(page, tableTop + 18),
    width: PAGE_W - 2 * M,
    height: 18,
    color: colorAccent,
  })
  page.drawText('DESCRIPCIÓN', { x: colDesc + 4, y: yTop(page, tableTop + 6), size: 8, font: fontBold, color: rgb(1, 1, 1) })
  page.drawText('CANT.', { x: colQty, y: yTop(page, tableTop + 6), size: 8, font: fontBold, color: rgb(1, 1, 1) })
  page.drawText('P. UNIT.', { x: colUnit, y: yTop(page, tableTop + 6), size: 8, font: fontBold, color: rgb(1, 1, 1) })
  page.drawText('IMPORTE', { x: colAmt, y: yTop(page, tableTop + 6), size: 8, font: fontBold, color: rgb(1, 1, 1) })

  const sorted = [...lines].sort((a, b) => a.sort_order - b.sort_order)
  let ry = tableTop + 28
  const currency = invoice.currency || 'USD'

  for (const row of sorted) {
    if (ry > PAGE_H - M - 180) break
    const desc = row.description.length > 48 ? `${row.description.slice(0, 45)}…` : row.description
    page.drawText(desc, {
      x: colDesc + 4,
      y: yTop(page, ry),
      size: 8,
      font,
      color: colorText,
    })
    page.drawText(String(row.quantity), {
      x: colQty,
      y: yTop(page, ry),
      size: 8,
      font,
      color: colorText,
    })
    page.drawText(fmtMoney(Number(row.unit_price), currency), {
      x: colUnit,
      y: yTop(page, ry),
      size: 8,
      font,
      color: colorText,
    })
    page.drawText(fmtMoney(Number(row.line_total), currency), {
      x: colAmt,
      y: yTop(page, ry),
      size: 8,
      font,
      color: colorText,
    })
    ry += rowH
  }

  const subtotal = Number(invoice.subtotal ?? 0)
  const taxRate = Number(invoice.tax_rate ?? 0)
  const taxAmount = Number(invoice.tax_amount ?? 0)
  const total = Number(invoice.total_amount ?? 0)
  const paid = Number(invoice.amount_paid ?? 0)

  const totY = Math.min(ry + 24, PAGE_H - M - 120)
  const rightX = PAGE_W - M - 200
  page.drawText(`Subtotal: ${fmtMoney(subtotal, currency)}`, {
    x: rightX,
    y: yTop(page, totY),
    size: 9,
    font,
    color: colorMuted,
  })
  page.drawText(`Impuesto (${taxRate.toFixed(2)}%): ${fmtMoney(taxAmount, currency)}`, {
    x: rightX,
    y: yTop(page, totY + 14),
    size: 9,
    font,
    color: colorMuted,
  })

  page.drawRectangle({
    x: rightX - 8,
    y: yTop(page, totY + 44),
    width: 208,
    height: 26,
    color: colorAccent,
  })
  page.drawText('TOTAL', {
    x: rightX,
    y: yTop(page, totY + 32),
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  })
  const totalStr = fmtMoney(total, currency)
  page.drawText(totalStr, {
    x: PAGE_W - M - fontBold.widthOfTextAtSize(totalStr, 14) - 8,
    y: yTop(page, totY + 30),
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  })

  page.drawText(`Pagado: ${fmtMoney(paid, currency)}  |  Saldo: ${fmtMoney(total - paid, currency)}`, {
    x: rightX,
    y: yTop(page, totY + 58),
    size: 8,
    font,
    color: colorMuted,
  })

  page.drawText('Gracias por su preferencia.', {
    x: M,
    y: yTop(page, PAGE_H - M - 40),
    size: 9,
    font,
    color: colorAccent,
  })
  const legal = INVOICE_BRANDING.legalNote
  page.drawText(legal.length > 110 ? `${legal.slice(0, 107)}…` : legal, {
    x: M,
    y: yTop(page, PAGE_H - M - 26),
    size: 7,
    font,
    color: colorMuted,
  })

  return pdf.save()
}
