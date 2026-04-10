/**
 * Datos fiscales y de marca para facturas / cotizaciones.
 */
export const INVOICE_BRANDING = {
  /** Texto alternativo del logo (accesibilidad) */
  logoAlt: 'NL Services — Desarrollo web e IA',
  /** Nombre comercial bajo el logo en documentos */
  businessName: 'NL Services',
  /** Nombre corto para correos y asuntos */
  publicName: 'NL Services',
  /** Línea de actividad bajo el nombre comercial */
  businessSubtitle: 'Desarrollo web, automatización e IA',
  /** RUC Panamá */
  ruc: '10-711-1351 DV.0',
  addressLine1: 'Panama City, Calle 50',
  addressLine2: 'Edificio Mirador 50',
  country: 'República de Panamá',
  /** Logo en /public (ruta absoluta para <Image> y PDF) */
  logoPath: '/images/logonlservices.png',
  email: 'info@nixonlopez.com',
  /** Deja vacío para ocultar en el PDF/vista */
  phone: '',
  website: 'https://nixonlopez.dev',
  /** Color principal (encabezados, barra total) — slate-800 / azul corporativo */
  accentHex: '#1e3a5f',
  /** Texto legal corto (pie de documento) */
  legalNote:
    'Documento emitido a efectos informativos y de cobro. Conserve este comprobante para sus registros.',
  /** Firmante que representa al prestador en contratos impresos / PDF */
  signatoryLegalName: 'Nixon Jill Lopez Hernandez',
} as const

export function documentTitle(kind: 'prefactura' | 'final') {
  return kind === 'prefactura' ? 'PREFACTURA' : 'FACTURA'
}
