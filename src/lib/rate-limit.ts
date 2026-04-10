/**
 * Rate limiting en memoria por clave (p. ej. IP + ruta).
 * En serverless cada instancia tiene su propia memoria: mitiga ráfagas, no es un límite global.
 * Para límite global usar Redis (p. ej. Upstash) más adelante.
 */

type RateResult = { ok: true } | { ok: false; retryAfterSec: number }

const buckets = new Map<string, number[]>()

function parseIntEnv(name: string, fallback: number) {
  const v = process.env[name]
  if (!v) return fallback
  const n = parseInt(v, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function getPublicRateLimitWindowMs() {
  return parseIntEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)
}

export function getContactLimit() {
  return parseIntEnv('RATE_LIMIT_CONTACT_MAX', 10)
}

export function getNewsletterLimit() {
  return parseIntEnv('RATE_LIMIT_NEWSLETTER_MAX', 5)
}

export function getQuoteLimit() {
  return parseIntEnv('RATE_LIMIT_QUOTE_MAX', 5)
}

/** IP del cliente (proxy / Vercel / nginx suelen enviar x-forwarded-for). */
export function getClientIp(request: Request): string {
  const xf = request.headers.get('x-forwarded-for')
  if (xf) {
    const first = xf.split(',')[0]?.trim()
    if (first) return first.slice(0, 128)
  }
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp.slice(0, 128)
  return 'unknown'
}

/**
 * Ventana deslizante: como máximo `max` solicitudes en `windowMs` por `key`.
 */
export function checkRateLimit(key: string, max: number, windowMs: number): RateResult {
  const now = Date.now()
  let hits = buckets.get(key) ?? []
  hits = hits.filter((t) => now - t < windowMs)

  if (hits.length >= max) {
    const oldest = hits[0]!
    const retryAfterMs = Math.max(0, windowMs - (now - oldest)) + 500
    return { ok: false, retryAfterSec: Math.ceil(retryAfterMs / 1000) }
  }

  hits.push(now)
  buckets.set(key, hits)

  if (buckets.size > 8000) {
    pruneBuckets(now, windowMs)
  }

  return { ok: true }
}

function pruneBuckets(now: number, windowMs: number) {
  buckets.forEach((arr, k) => {
    const next = arr.filter((t) => now - t < windowMs)
    if (next.length === 0) buckets.delete(k)
    else buckets.set(k, next)
  })
}
