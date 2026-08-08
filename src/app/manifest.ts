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
    theme_color: '#00C2FF',
    icons: [
      {
        src: '/images/favicon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/favicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/favicon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
