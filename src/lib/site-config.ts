/** URL canónica del sitio (SEO, JSON-LD, enlaces absolutos). Dominio primario en Vercel: www. */
export const SITE_URL = 'https://www.nixonlopez.com' as const

export const SITE_NAME = 'Nixon Lopez Services'
export const SITE_NAME_FULL =
  'Nixon Lopez Services — Desarrollo web, IA y automatización en Panamá'

/** Perfil social principal visible en About (sameAs / marca personal). */
export const SITE_SAME_AS = [
  'https://www.linkedin.com/in/nixonlopez',
  'https://github.com/soynixonlopez',
  'https://www.instagram.com/nixonlopes.dev/',
  'https://facebook.com/soynixonlopez',
  'https://tiktok.com/@soynixonlopez',
  'https://www.youtube.com/@soynixonlopez',
] as const

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
