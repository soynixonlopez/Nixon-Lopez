import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Escapa texto de usuario antes de interpolarlo en HTML de correos (evita inyección HTML). */
export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Mensaje claro cuando la API devuelve 429.
 * `retryAfterHeader` es el valor de la cabecera `Retry-After` (segundos).
 */
export function rateLimitFriendlyMessage(retryAfterHeader: string | null): string {
  const raw = retryAfterHeader?.trim()
  const sec = raw ? parseInt(raw, 10) : NaN
  if (!Number.isFinite(sec) || sec <= 0) {
    return 'Has enviado varias solicitudes en poco tiempo. Espera unos minutos e inténtalo de nuevo.'
  }
  if (sec <= 90) {
    return `Has alcanzado el límite de envíos. Vuelve a intentarlo en aproximadamente ${sec} segundos.`
  }
  const min = Math.ceil(sec / 60)
  return `Has alcanzado el límite de envíos. Vuelve a intentarlo en unos ${min} minuto${min > 1 ? 's' : ''}.`
}

