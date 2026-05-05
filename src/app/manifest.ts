import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nixon Lopez Services — Desarrollo web e IA',
    short_name: 'Nixon Lopez Services',
    description:
      'Nixon Lopez Services: desarrollo web, ChatBots, e-commerce y automatizaciones con IA en Panamá.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#00D4FF',
    icons: [
      {
        src: '/images/faviconweb.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/faviconweb.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
