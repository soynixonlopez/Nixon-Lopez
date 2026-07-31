import { MASTERCLASS_EVENT } from '@/lib/masterclass'
import {
  buildMasterclassAccessCards,
  buildMasterclassCalendarCta,
  buildMasterclassEmailFooter,
  buildMasterclassEmailHeader,
  buildMasterclassEmailShell,
  buildMasterclassEventDetails,
  buildMasterclassUrgencyTip,
  buildMasterclassValueProps,
  daysUntilMasterclassEvent,
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
  const days = daysUntilMasterclassEvent(event.startDateIso)

  const preheader = `Cupo confirmado — ${event.dateLabel}. Únete al WhatsApp y guarda el enlace de Google Meet.`
  const subject = `✅ Cupo confirmado — ${event.shortName}`

  const inner = `
    ${buildMasterclassEmailHeader({ badge: 'Cupo confirmado', event })}
    <tr>
      <td style="padding:24px 24px 8px;font-family:system-ui,-apple-system,sans-serif;">
        <p style="margin:0 0 12px;font-size:17px;line-height:1.5;color:#0f172a;">Hola <strong>${first}</strong>,</p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#334155;"><strong>¡Felicitaciones!</strong> Tu cupo para la masterclass gratuita está confirmado. Aprenderás a crear <strong>sitios web profesionales con Inteligencia Artificial</strong> — sin ser programador.</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#64748b;">Completa estos <strong>2 pasos ahora</strong> (toma menos de 1 minuto) para no perderte nada:</p>
      </td>
    </tr>
    <tr><td style="padding:0 24px 24px;font-family:system-ui,-apple-system,sans-serif;">
      ${buildMasterclassUrgencyTip(days)}
      ${buildMasterclassValueProps()}
      ${buildMasterclassAccessCards(event)}
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
    '¡Tu registro fue exitoso! Completa estos 2 pasos:',
    '',
    'WhatsApp:', event.whatsappCommunityUrl,
    'Google Meet:', event.googleMeetUrl,
    'Calendar:', event.googleCalendarUrl,
    '',
    `${event.dateLabel} · ${event.timeLabel} (${event.timezoneLabel})`,
    '',
    INVOICE_BRANDING.email,
    SITE_URL,
  ].join('\n')

  return { html, text, subject }
}
