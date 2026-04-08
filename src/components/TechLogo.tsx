'use client'

import { useState } from 'react'
import { Code, Database, Globe, Bot, Zap } from 'lucide-react'

interface TechLogoProps {
  name: string
  size?: number
  className?: string
  /** Icono en blanco (p. ej. WhatsApp en botones verdes u oscuros). Usa filtro CSS sobre el SVG. */
  light?: boolean
}

const TechLogo: React.FC<TechLogoProps> = ({
  name,
  size = 48,
  className = '',
  light = false,
}) => {
  const [imageError, setImageError] = useState(false)

  const logoMap: Record<string, string> = {
    React: 'react.svg',
    'Next.js': 'nextdotjs.svg',
    TypeScript: 'typescript.svg',
    'Node.js': 'nodedotjs.svg',
    Python: 'python.svg',
    JavaScript: 'javascript.svg',
    Tailwind: 'tailwindcss.svg',
    'Tailwind CSS': 'tailwindcss.svg',
    HTML5: 'html5.svg',
    CSS3: 'css.svg',
    Bootstrap: 'bootstrap.svg',
    Docker: 'docker.svg',
    Supabase: 'supabase.svg',
    MongoDB: 'mongodb.svg',
    PostgreSQL: 'postgresql.svg',
    Firebase: 'firebase.svg',
    OpenAI: 'openai.svg',
    Flutter: 'flutter.svg',
    'React Native': 'react.svg',
    'Android Studio': 'androidstudio.svg',
    Kotlin: 'kotlin.svg',
    Swift: 'swift.svg',
    Xcode: 'xcode.svg',
    n8n: 'n8n.svg',
    Zapier: 'zapier.svg',
    'Hugging Face': 'huggingface.svg',
    Instagram: 'instagram.svg',
    Facebook: 'facebook.svg',
    TikTok: 'tiktok.svg',
    YouTube: 'youtube.svg',
    WhatsApp: 'whatsapp.svg',
    GitHub: 'github.svg',
    'Framer Motion': 'framer.svg',
    AWS: 'amazonaws.svg',
    Git: 'git.svg',
    Figma: 'figma.svg',
    Vercel: 'vercel.svg',
    LangChain: 'langchain.svg',
    Prisma: 'prisma.svg',
    GraphQL: 'graphql.svg',
    Stripe: 'stripe.svg',
  }

  /** Logos oficiales de redes (carpeta dedicada). */
  const socialMediaNames = new Set([
    'Instagram',
    'Facebook',
    'TikTok',
    'YouTube',
    'WhatsApp',
    'GitHub',
  ])

  const logoFile = logoMap[name]

  const getFallbackIcon = () => {
    const lowerName = name.toLowerCase()

    if (
      lowerName.includes('database') ||
      lowerName.includes('sql') ||
      lowerName.includes('mongo') ||
      lowerName.includes('postgres')
    ) {
      return <Database size={size} className={className} />
    }
    if (
      lowerName.includes('ai') ||
      lowerName.includes('ml') ||
      lowerName.includes('openai') ||
      lowerName.includes('hugging')
    ) {
      return <Bot size={size} className={className} />
    }
    if (lowerName.includes('automation') || lowerName.includes('zapier') || lowerName.includes('n8n')) {
      return <Zap size={size} className={className} />
    }
    if (
      lowerName.includes('web') ||
      lowerName.includes('html') ||
      lowerName.includes('css') ||
      lowerName.includes('react') ||
      lowerName.includes('next')
    ) {
      return <Globe size={size} className={className} />
    }

    return <Code size={size} className={className} />
  }

  if (!logoFile || imageError) {
    return getFallbackIcon()
  }

  /**
   * Los SVG de marcas tienen distintas proporciones. Usamos un recuadro máximo
   * (size×size) y <img> con object-contain + tamaño automático para no estirar
   * (Next/Image con width=height forzaba caja cuadrada y algunos logos se veían raros).
   */
  const boxStyle = { width: size, height: size } as const
  const assetDir = socialMediaNames.has(name) ? '/socialmedia' : '/logos'

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={boxStyle}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG locales: proporción nativa, sin rasterizar */}
      <img
        src={`${assetDir}/${logoFile}`}
        alt={name}
        className={`max-h-full max-w-full h-auto w-auto object-contain object-center ${light ? 'brightness-0 invert' : ''}`}
        loading="lazy"
        decoding="async"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

export default TechLogo
