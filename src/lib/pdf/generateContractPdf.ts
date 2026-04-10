import fs from 'fs'
import path from 'path'
import { PDFDocument, PDFPage, StandardFonts, rgb } from 'pdf-lib'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { CONTRACT_PAYMENT_BANK, CONTRACT_PAYMENT_YAPPY } from '@/lib/contract-payment'
import { buildContractClauses, buildContractIntroSegments, type ContractIntroSegment } from '@/lib/contracts'
import type { ServiceContractRecord } from '@/lib/types/contract'

const W = 595.28
const H = 841.89
const M = 48

function hexToRgb01(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  }
}

function wrapText(text: string, maxWidth: number, font: any, size: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      line = test
    } else {
      if (line) lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

type WordRun = { text: string; key: boolean }

function introSegmentsToWords(segments: ContractIntroSegment[]): WordRun[] {
  const out: WordRun[] = []
  for (const seg of segments) {
    const re = /\S+\s*/g
    let m: RegExpExecArray | null
    while ((m = re.exec(seg.value)) !== null) {
      out.push({ text: m[0], key: seg.kind === 'key' })
    }
  }
  return out
}

function drawWrappedRichIntro(
  initialPage: PDFPage,
  pdf: PDFDocument,
  words: WordRun[],
  startX: number,
  startY: number,
  maxWidth: number,
  font: any,
  bold: any,
  size: number,
  lineGap: number,
  textColor: any,
  minY: number
): { page: PDFPage; y: number } {
  let x = startX
  let y = startY
  let currentPage = initialPage

  const ensureSpace = () => {
    if (y < minY) {
      currentPage = pdf.addPage([W, H])
      y = H - M
      x = startX
    }
  }

  for (const w of words) {
    const f = w.key ? bold : font
    let wordWidth = f.widthOfTextAtSize(w.text, size)
    if (x === startX && wordWidth > maxWidth) {
      const lines = wrapText(w.text.trim(), maxWidth, f, size)
      for (const line of lines) {
        ensureSpace()
        const lw = f.widthOfTextAtSize(line, size)
        currentPage.drawText(line, { x: startX, y, size, font: f, color: textColor })
        if (w.key) {
          currentPage.drawLine({
            start: { x: startX, y: y - 1.2 },
            end: { x: startX + lw, y: y - 1.2 },
            thickness: 0.45,
            color: textColor,
          })
        }
        y -= lineGap
      }
      x = startX
      continue
    }
    if (x + wordWidth > startX + maxWidth && x > startX) {
      x = startX
      y -= lineGap
      ensureSpace()
      wordWidth = f.widthOfTextAtSize(w.text, size)
    }
    ensureSpace()
    currentPage.drawText(w.text, { x, y, size, font: f, color: textColor })
    if (w.key) {
      currentPage.drawLine({
        start: { x, y: y - 1.2 },
        end: { x: x + wordWidth, y: y - 1.2 },
        thickness: 0.45,
        color: textColor,
      })
    }
    x += wordWidth
  }

  return { page: currentPage, y }
}

export async function generateContractPdfBuffer(contract: ServiceContractRecord): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const a = hexToRgb01(INVOICE_BRANDING.accentHex)
  const accent = rgb(a.r, a.g, a.b)
  const text = rgb(0.12, 0.15, 0.2)
  const muted = rgb(0.38, 0.42, 0.48)
  const clauses = buildContractClauses(contract)
  const introWords = introSegmentsToWords(buildContractIntroSegments(contract))

  let page = pdf.addPage([W, H])
  let y = H - M

  const logoPath = path.join(process.cwd(), 'public', INVOICE_BRANDING.logoPath.replace(/^\//, ''))
  try {
    const bytes = fs.readFileSync(logoPath)
    const img = await pdf.embedPng(bytes)
    const maxW = 170
    const scale = maxW / img.width
    const ih = img.height * scale
    page.drawImage(img, { x: M, y: y - ih, width: maxW, height: ih })
  } catch {
    // ignore logo embedding failure
  }
  page.drawText('CONTRATO DE PRESTACION DE SERVICIOS TECNOLOGICOS', {
    x: W - M - bold.widthOfTextAtSize('CONTRATO DE PRESTACION DE SERVICIOS TECNOLOGICOS', 11),
    y: y - 8,
    size: 11,
    font: bold,
    color: accent,
  })
  page.drawText(`No. ${contract.contract_number}`, {
    x: W - M - bold.widthOfTextAtSize(`No. ${contract.contract_number}`, 10),
    y: y - 24,
    size: 10,
    font: bold,
    color: muted,
  })
  y -= 70

  const maxWidth = W - M * 2
  const drawParagraph = (p: string, size = 10, spacing = 14) => {
    const lines = wrapText(p, maxWidth, font, size)
    for (const line of lines) {
      if (y < M + 80) {
        page = pdf.addPage([W, H])
        y = H - M
      }
      page.drawText(line, { x: M, y, size, font, color: text })
      y -= spacing
    }
    y -= 6
  }

  const drawTitle = (t: string) => {
    if (y < M + 100) {
      page = pdf.addPage([W, H])
      y = H - M
    }
    page.drawText(t, { x: M, y, size: 10, font: bold, color: accent })
    y -= 16
  }

  const drawBullets = (items: string[]) => {
    for (const it of items) drawParagraph(`- ${it}`)
  }

  const drawPaymentBlock = (title: string, rows: { label: string; value: string; key?: boolean }[]) => {
    if (y < M + 120) {
      page = pdf.addPage([W, H])
      y = H - M
    }
    page.drawText(title.toUpperCase(), { x: M, y, size: 9, font: bold, color: accent })
    y -= 12
    const labelW = 130
    for (const r of rows) {
      if (y < M + 60) {
        page = pdf.addPage([W, H])
        y = H - M
      }
      page.drawText(`${r.label}:`, { x: M, y, size: 9, font: bold, color: muted })
      const vf = r.key ? bold : font
      const vw = vf.widthOfTextAtSize(r.value, 9)
      page.drawText(r.value, { x: M + labelW, y, size: 9, font: vf, color: text })
      if (r.key) {
        page.drawLine({
          start: { x: M + labelW, y: y - 1 },
          end: { x: M + labelW + vw, y: y - 1 },
          thickness: 0.4,
          color: text,
        })
      }
      y -= 12
    }
    y -= 8
  }

  {
    const r = drawWrappedRichIntro(page, pdf, introWords, M, y, maxWidth, font, bold, 10, 13, text, M + 72)
    page = r.page
    y = r.y - 10
  }

  drawTitle('PRIMERA: OBJETO DEL CONTRATO')
  drawParagraph(clauses.primera)
  drawTitle('SEGUNDA: ALCANCE DEL SERVICIO')
  drawParagraph('El servicio incluye:')
  drawBullets(clauses.segundaIncluye)
  drawParagraph('No incluye:')
  drawBullets(clauses.segundaNoIncluye)
  drawTitle('TERCERA: COSTO Y FORMA DE PAGO')
  drawBullets(clauses.tercera)
  drawPaymentBlock(CONTRACT_PAYMENT_BANK.title, [
    { label: 'Banco', value: CONTRACT_PAYMENT_BANK.bankName },
    { label: 'Tipo de cuenta', value: CONTRACT_PAYMENT_BANK.accountType },
    { label: 'Titular', value: CONTRACT_PAYMENT_BANK.holder, key: true },
    { label: 'No. de cuenta', value: CONTRACT_PAYMENT_BANK.accountNumber, key: true },
  ])
  drawPaymentBlock(CONTRACT_PAYMENT_YAPPY.title, [
    { label: 'Nombre en Yappy', value: CONTRACT_PAYMENT_YAPPY.displayName, key: true },
    { label: 'Telefono', value: CONTRACT_PAYMENT_YAPPY.phone, key: true },
  ])
  drawTitle('CUARTA: DOMINIO, HOSTING Y CORREO')
  drawBullets(clauses.cuarta)
  drawTitle('QUINTA: PLAZO DE ENTREGA')
  drawParagraph(clauses.quinta)
  drawTitle('SEXTA: PROPIEDAD INTELECTUAL')
  drawBullets([
    'Una vez realizado el pago total, EL CLIENTE sera propietario del producto final entregado.',
    'EL PRESTADOR podra mostrar el proyecto en su portafolio profesional.',
    'El codigo base reutilizable seguira siendo propiedad intelectual del PRESTADOR.',
  ])
  drawTitle('SEPTIMA: MANTENIMIENTO Y SOPORTE')
  drawParagraph(
    'El mantenimiento mensual o bimestral tendra un costo de USD $20 e incluye actualizaciones tecnicas, supervision basica, ajustes menores y soporte preventivo.'
  )
  drawTitle('OCTAVA: CANCELACION')
  drawBullets([
    'Si EL CLIENTE cancela el proyecto, el anticipo no sera reembolsable.',
    'Si EL PRESTADOR cancela sin causa justificada, debera devolver el anticipo recibido.',
  ])
  drawTitle('NOVENA: LEGISLACION APLICABLE')
  drawParagraph(
    'El presente contrato se rige por las leyes de la Republica de Panama. Cualquier disputa sera resuelta ante los tribunales competentes de Panama.'
  )
  if (contract.custom_notes) {
    drawTitle('OBSERVACIONES ADICIONALES')
    drawParagraph(contract.custom_notes)
  }

  if (y < M + 200) {
    page = pdf.addPage([W, H])
    y = H - M
  }
  drawTitle('FIRMA DE LAS PARTES')
  const cityLine = `En la ciudad de ${contract.city || '________________'}, a los ____ dias del mes de __________ del ano ______.`
  drawParagraph(cityLine)
  y -= 8

  const colL = M
  const colR = W / 2 + 28
  const sigW = W / 2 - M - 40
  const clientName = contract.client_name
  const prestadorNombre = INVOICE_BRANDING.signatoryLegalName

  const drawHLine = (x0: number, yLine: number) => {
    page.drawLine({
      start: { x: x0, y: yLine },
      end: { x: x0 + sigW, y: yLine },
      thickness: 0.65,
      color: text,
    })
  }

  page.drawText('EL PRESTADOR', { x: colL, y, size: 10, font: bold, color: text })
  page.drawText('EL CLIENTE', { x: colR, y, size: 10, font: bold, color: text })
  y -= 18
  page.drawText(INVOICE_BRANDING.publicName, { x: colL, y, size: 10, font: bold, color: text })
  page.drawText(clientName, { x: colR, y, size: 10, font: bold, color: text })
  y -= 12
  page.drawText(`RUC ${INVOICE_BRANDING.ruc}`, { x: colL, y, size: 9, font, color: muted })
  let yAfterRucRow = y
  if (contract.client_address?.trim()) {
    const addr = contract.client_address.trim()
    const addrLines = wrapText(addr, sigW, font, 8).slice(0, 2)
    let yAddr = y
    for (let i = 0; i < addrLines.length; i++) {
      page.drawText(addrLines[i], { x: colR, y: yAddr, size: 8, font, color: muted })
      if (i < addrLines.length - 1) yAddr -= 10
    }
    yAfterRucRow = yAddr
  }
  y = yAfterRucRow - 14

  // Línea 1: firma (ambas partes)
  drawHLine(colL, y)
  drawHLine(colR, y)
  y -= 9
  page.drawText('Firma', { x: colL, y, size: 8, font, color: muted })
  page.drawText('Firma', { x: colR, y, size: 8, font, color: muted })
  y -= 20

  // Línea 2: nombre en letra de molde (espacio para escribir + referencia impresa debajo)
  drawHLine(colL, y)
  drawHLine(colR, y)
  y -= 9
  page.drawText('Nombre (letra de molde)', { x: colL, y, size: 8, font, color: muted })
  page.drawText('Nombre (letra de molde)', { x: colR, y, size: 8, font, color: muted })
  y -= 12

  const nameLinesP = wrapText(prestadorNombre, sigW, bold, 9)
  const nameLinesC = wrapText(clientName, sigW, bold, 9)
  for (let i = 0; i < Math.max(nameLinesP.length, nameLinesC.length); i++) {
    if (y < M + 48) {
      page = pdf.addPage([W, H])
      y = H - M
    }
    if (nameLinesP[i]) {
      page.drawText(nameLinesP[i], { x: colL, y, size: 9, font: bold, color: text })
    }
    if (nameLinesC[i]) {
      page.drawText(nameLinesC[i], { x: colR, y, size: 9, font: bold, color: text })
    }
    y -= 11
  }
  y -= 4
  page.drawText(
    `Cedula / RUC: ${contract.client_tax_id || '________________________'}`,
    { x: colR, y, size: 9, font, color: text }
  )

  return pdf.save()
}
