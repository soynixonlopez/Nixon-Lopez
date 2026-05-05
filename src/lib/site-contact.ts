/** WhatsApp de contacto en sitio público (mismo número que Hero / servicios). */
export const WHATSAPP_E164 = '50768252312' as const

/**
 * Enlace wa.me para enviar el contrato firmado a Nixon López.
 * Prefija el mensaje para que el cliente solo revise y pulse “Enviar”.
 */
export function buildWhatsAppContractHandoffUrl(params: {
  clientFullName: string
  quoteRef: string
}): string {
  const text = [
    'Hola Nixon,',
    '',
    `Soy ${params.clientFullName}. Completo el contrato en PDF según la cotización ${params.quoteRef} y lo envío firmado para continuar con el proyecto.`,
    '',
    'Quedo atento/a a tus indicaciones.',
  ].join('\n')
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(text)}`
}
