import type { MasterclassEventConfig } from '@/lib/masterclass'
import {
  buildMasterclassAccessCards,
  buildMasterclassCalendarCta,
  buildMasterclassCustomMessageBlock,
  buildMasterclassEmailFooter,
  buildMasterclassEmailHeader,
  buildMasterclassEmailShell,
  buildMasterclassEventDetails,
  buildMasterclassUrgencyTip,
  buildMasterclassValueProps,
  daysUntilMasterclassEvent,
  MASTERCLASS_EMAIL_FONT,
} from '@/lib/masterclass-email-branding'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { SITE_URL } from '@/lib/site-config'
import { escapeHtml } from '@/lib/utils'

export type MasterclassReminderEmailPayload = {
  nombre: string
  event: MasterclassEventConfig
  customMessage?: string
}

function urgencyBadge(event: MasterclassEventConfig): string {
  const days = daysUntilMasterclassEvent(event.startDateIso)
  if (days === 0) return '¡Es hoy!'
  if (days === 1) return '¡Es mañana!'
  if (days !== null && days > 1 && days <= 7) return `Faltan ${days} días`
  return 'Recordatorio'
}

function urgencyLead(event: MasterclassEventConfig): string {
  const days = daysUntilMasterclassEvent(event.startDateIso)
  const dateLabel = escapeHtml(event.dateLabel)
  const timeLabel = escapeHtml(event.timeLabel)

  if (days === 0) {
    return `Hoy es el día. Tu masterclass de <strong>sitios web con IA</strong> es ${dateLabel} a las ${timeLabel}.`
  }
  if (days === 1) {
    return `Mañana es el gran día. Tu cupo ya está reservado para la masterclass del <strong>${dateLabel}</strong> a las ${timeLabel}.`
  }
  return `Te esperamos el <strong>${dateLabel}</strong> a las ${timeLabel}. Tu cupo sigue activo — no pierdas esta sesión gratuita.`
}

export function buildMasterclassReminderContent({
  nombre,
  event,
  customMessage,
}: MasterclassReminderEmailPayload) {
  const first = escapeHtml(nombre.trim())
  const days = daysUntilMasterclassEvent(event.startDateIso)
  const badge = urgencyBadge(event)

  const preheader = `Mañana: masterclass gratuita ${event.dateLabel} — enlaces de Google Meet y WhatsApp dentro.`
  const subject =
    days === 1 ?
      `⏰ Mañana ${event.dateLabel}: masterclass de IA — tus enlaces aquí`
    : days === 0 ?
      `🔴 Hoy: tu masterclass empieza pronto — Meet + WhatsApp`
    : `⏰ Recordatorio — ${event.shortName} (${event.dateLabel})`

  const inner = `
    ${buildMasterclassEmailHeader({ badge, event })}
    <tr>
      <td style="padding:20px 20px 6px;font-family:${MASTERCLASS_EMAIL_FONT};">
        <p style="margin:0 0 10px;font-size:17px;line-height:1.45;color:#0f172a;">Hola <strong>${first}</strong>,</p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#334155;">${urgencyLead(event)}</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#64748b;">Si se te olvidaron los enlaces o no entraste al grupo, aquí está todo lo que necesitas para conectarte sin estrés:</p>
      </td>
    </tr>
    <tr><td style="padding:0 20px 20px;font-family:${MASTERCLASS_EMAIL_FONT};">
      ${buildMasterclassCustomMessageBlock(customMessage ?? '')}
      ${buildMasterclassUrgencyTip(days)}
      ${buildMasterclassValueProps()}
      ${buildMasterclassAccessCards(event)}
      ${buildMasterclassCalendarCta(event)}
      ${buildMasterclassEventDetails(event)}
      ${buildMasterclassEmailFooter('Recibes este recordatorio porque te registraste en la masterclass.')}
    </td></tr>`

  const html = buildMasterclassEmailShell(inner, preheader, `Recordatorio — ${event.shortName}`)

  const text = [
    `${INVOICE_BRANDING.publicName} — Recordatorio Masterclass`,
    '',
    `Hola ${nombre.trim()},`,
    '',
    days === 1 ?
      `MAÑANA — ${event.dateLabel} a las ${event.timeLabel} (${event.timezoneLabel}).`
    : `${event.dateLabel} a las ${event.timeLabel} (${event.timezoneLabel}).`,
    '',
    customMessage?.trim() ?? '',
    '',
    'WhatsApp:', event.whatsappCommunityUrl,
    'Google Meet:', event.googleMeetUrl,
    'Calendar:', event.googleCalendarUrl,
    '',
    INVOICE_BRANDING.email,
    SITE_URL,
  ]
    .filter(Boolean)
    .join('\n')

  return { html, text, subject }
}
