'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Code, Database, Globe, Bot, Zap } from 'lucide-react'

interface TechLogoProps {
  name: string
  size?: number
  className?: string
}

const TechLogo: React.FC<TechLogoProps> = ({ 
  name, 
  size = 48, 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false)
  
  // Mapeo de nombres a archivos de logo
  const logoMap: Record<string, string> = {
    'React': 'react.svg',
    'Next.js': 'nextdotjs.svg',
    'TypeScript': 'typescript.svg',
    'Node.js': 'nodedotjs.svg',
    'Python': 'python.svg',
    'JavaScript': 'javascript.svg',
    'Tailwind': 'tailwindcss.svg',
    'Tailwind CSS': 'tailwindcss.svg',
    'HTML5': 'html5.svg',
    'CSS3': 'css.svg',
    'Bootstrap': 'bootstrap.svg',
    'Docker': 'docker.svg',
    'Supabase': 'supabase.svg',
    'MongoDB': 'mongodb.svg',
    'PostgreSQL': 'postgresql.svg',
    'Firebase': 'firebase.svg',
    'OpenAI': 'openai.svg',
    'Flutter': 'flutter.svg',
    'React Native': 'react.svg',
    'Android Studio': 'androidstudio.svg',
    'Kotlin': 'kotlin.svg',
    'Swift': 'swift.svg',
    'Xcode': 'xcode.svg',
    'n8n': 'n8n.svg',
    'Zapier': 'zapier.svg',
    'Hugging Face': 'huggingface.svg',
    // Redes sociales
    'Instagram': 'instagram.svg',
    'Facebook': 'facebook.svg',
    'TikTok': 'tiktok.svg',
    'YouTube': 'youtube.svg',
    'WhatsApp': 'whatsapp.svg'
  }

  const logoFile = logoMap[name]
  
  // Colores oficiales de todas las tecnologías y redes sociales
  const brandColors: Record<string, string> = {
    // Redes Sociales
    'Instagram': '#E4405F', // Rosa de Instagram
    'Facebook': '#1877F2',  // Azul de Facebook
    'TikTok': '#ffffff',    // Negro de TikTok
    'YouTube': '#FF0000',   // Rojo de YouTube
    'WhatsApp': '#25D366',  // Verde de WhatsApp
    
    // Frameworks y Librerías
    'React': '#61DAFB',     // Azul cian de React
    'Next.js': '#000000',   // Negro de Next.js
    'Node.js': '#339933',   // Verde de Node.js
    'TypeScript': '#3178C6', // Azul de TypeScript
    'JavaScript': '#F7DF1E', // Amarillo de JavaScript
    'Python': '#3776AB',    // Azul de Python
    'Flutter': '#02569B',   // Azul de Flutter
    'Swift': '#FA7343',     // Naranja de Swift
    'Kotlin': '#7F52FF',    // Púrpura de Kotlin
    
    // Bases de Datos
    'MongoDB': '#47A248',   // Verde de MongoDB
    'PostgreSQL': '#336791', // Azul de PostgreSQL
    'Supabase': '#3ECF8E',  // Verde de Supabase
    'Firebase': '#FFCA28',  // Amarillo de Firebase
    
    // Herramientas y Servicios
    'Docker': '#2496ED',    // Azul de Docker
    'Bootstrap': '#7952B3', // Púrpura de Bootstrap
    'Tailwind CSS': '#06B6D4', // Cian de Tailwind
    'HTML5': '#E34F26',     // Naranja de HTML5
    'CSS3': '#1572B6',      // Azul de CSS3
    'Android Studio': '#3DDC84', // Verde de Android Studio
    'Xcode': '#147EFB',     // Azul de Xcode
    
    // IA y Automatización
    'OpenAI': '#412991',    // Púrpura de OpenAI
    'Hugging Face': '#FF6B35', // Naranja de Hugging Face
    'N8N': '#EA4B71',       // Rosa de N8N
    'Zapier': '#FF4A00',    // Naranja de Zapier
    'TensorFlow': '#FF6F00' // Naranja de TensorFlow
  }
  
  // Función para obtener el icono de fallback apropiado
  const getFallbackIcon = () => {
    const lowerName = name.toLowerCase()
    
    // Categorías de tecnologías
    if (lowerName.includes('database') || lowerName.includes('sql') || lowerName.includes('mongo') || lowerName.includes('postgres')) {
      return <Database size={size} className={className} />
    }
    if (lowerName.includes('ai') || lowerName.includes('ml') || lowerName.includes('openai') || lowerName.includes('hugging')) {
      return <Bot size={size} className={className} />
    }
    if (lowerName.includes('automation') || lowerName.includes('zapier') || lowerName.includes('n8n')) {
      return <Zap size={size} className={className} />
    }
    if (lowerName.includes('web') || lowerName.includes('html') || lowerName.includes('css') || lowerName.includes('react') || lowerName.includes('next')) {
      return <Globe size={size} className={className} />
    }
    
    // Fallback genérico
    return <Code size={size} className={className} />
  }

  if (!logoFile || imageError) {
    // Si no hay logo o hay error, usar el icono de fallback apropiado
    return getFallbackIcon()
  }

  // Determinar si tiene color oficial definido
  const hasBrandColor = brandColors[name]
  const finalClassName = `transition-transform duration-300 ${className}`

  return (
    <div className="relative">
      {hasBrandColor ? (
        <div 
          className={finalClassName}
          style={{ 
            width: size, 
            height: size,
            backgroundColor: brandColors[name],
            mask: `url(/logos/${logoFile}) no-repeat center`,
            maskSize: 'contain',
            WebkitMask: `url(/logos/${logoFile}) no-repeat center`,
            WebkitMaskSize: 'contain'
          }}
        />
      ) : (
        <Image
          src={`/logos/${logoFile}`}
          alt={name}
          width={size}
          height={size}
          className={finalClassName}
          onError={() => setImageError(true)}
          priority={false}
        />
      )}
    </div>
  )
}

export default TechLogo
