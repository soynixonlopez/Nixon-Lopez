import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NL Services — Desarrollo web e IA',
    short_name: 'NL Services',
    description:
      'NL Services: desarrollo web, ChatBots, e-commerce y automatizaciones con IA en Panamá.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#00D4FF',
    icons: [
      {
        src: '/images/favicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/favicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
