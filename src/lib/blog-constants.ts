export const BLOG_IMAGE = {
  maxUploadBytes: 8 * 1024 * 1024,
  bucket: 'blog',
  maxWidth: 1600,
  webpQuality: 82,
  allowedMime: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'] as const,
} as const

export const BLOG_CATEGORIES = [
  'Desarrollo Web',
  'SEO',
  'Tecnología',
  'Proyectos',
  'Negocios',
] as const
