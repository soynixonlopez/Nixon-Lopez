import { MASTERCLASS_EVENT } from '@/lib/masterclass'
import {
  buildMasterclassAccessCards,
  buildMasterclassCalendarCta,
  buildMasterclassEmailFooter,
  buildMasterclassEmailHeader,
  buildMasterclassEmailShell,
  buildMasterclassEventDetails,
  buildMasterclassThankYouBlock,
  buildMasterclassValueProps,
  MASTERCLASS_EMAIL_FONT,
} from '@/lib/masterclass-email-branding'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { SITE_URL } from '@/lib/site-config'
import { escapeHtml } from '@/lib/utils'

export type MasterclassConfirmationEmailPayload = {
  nombre: string
}

export function buildMasterclassConfirmationContent({ nombre }: MasterclassConfirmationEmailPayload) {
  const first = escapeHtml(nombre.trim())
  const event = MASTERCLASS_EVENT

  const preheader = `Gracias por registrarte — ${event.dateLabel}. Tu cupo está confirmado. Únete al WhatsApp y guarda el enlace de Meet.`
  const subject = `✅ Gracias por registrarte — ${event.shortName}`

  const inner = `
    ${buildMasterclassEmailHeader({
      badge: '¡Gracias por registrarte!',
      event,
      bannerHref: event.whatsappCommunityUrl,
    })}
    <tr>
      <td style="padding:20px 20px 6px;font-family:${MASTERCLASS_EMAIL_FONT};">
        <p style="margin:0 0 10px;font-size:17px;line-height:1.45;color:#0f172a;">Hola <strong>${first}</strong>,</p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#334155;">Recibimos tu registro para la masterclass gratuita. Aprenderás a crear <strong>sitios web profesionales con Inteligencia Artificial</strong>, sin necesidad de ser programador.</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#64748b;">Para asegurar tu lugar y recibir todo antes del evento, completa estos <strong>2 pasos ahora</strong> (toma menos de 1 minuto):</p>
      </td>
    </tr>
    <tr><td style="padding:0 20px 20px;font-family:${MASTERCLASS_EMAIL_FONT};">
      ${buildMasterclassThankYouBlock(event)}
      ${buildMasterclassValueProps()}
      ${buildMasterclassAccessCards(event, 'confirmation')}
      ${buildMasterclassCalendarCta(event)}
      ${buildMasterclassEventDetails(event)}
      ${buildMasterclassEmailFooter('Recibes este mensaje porque te registraste en la masterclass. Es un correo transaccional.')}
    </td></tr>`

  const html = buildMasterclassEmailShell(inner, preheader, `Confirmación — ${event.shortName}`)

  const text = [
    `${INVOICE_BRANDING.publicName} — Confirmación Masterclass`,
    '',
    `Hola ${nombre.trim()},`,
    '',
    '¡Gracias por registrarte! Tu cupo está confirmado.',
    '',
    `Te esperamos el ${event.dateLabel} a las ${event.timeLabel} (${event.timezoneLabel}).`,
    '',
    'Completa estos 2 pasos:',
    '',
    'WhatsApp:', event.whatsappCommunityUrl,
    'Google Meet:', event.googleMeetUrl,
    'Calendar:', event.googleCalendarUrl,
    '',
    INVOICE_BRANDING.email,
    SITE_URL,
  ].join('\n')

  return { html, text, subject }
}
