/** Tonos de icono/tarjeta alineados a la marca (navy / azul / púrpura / verde). */
export const BRAND_ICON_TONES = {
  blue: {
    wrap: 'bg-white/80 text-brand',
    icon: 'text-brand',
    accent: 'bg-brand',
    ring: 'ring-brand/40',
    border: 'border-brand/20',
    card: 'bg-brand/[0.06] border-brand/15',
    button: 'bg-brand hover:bg-brand-light',
  },
  purple: {
    wrap: 'bg-white/80 text-neon-purple',
    icon: 'text-neon-purple',
    accent: 'bg-neon-purple',
    ring: 'ring-neon-purple/35',
    border: 'border-neon-purple/30',
    card: 'bg-neon-purple/[0.08] border-neon-purple/20',
    button: 'bg-neon-purple hover:bg-neon-purple/90',
  },
  green: {
    wrap: 'bg-white/80 text-emerald-700',
    icon: 'text-emerald-600',
    accent: 'bg-emerald-600',
    ring: 'ring-emerald-500/35',
    border: 'border-emerald-500/30',
    card: 'bg-emerald-500/[0.08] border-emerald-500/20',
    button: 'bg-emerald-600 hover:bg-emerald-500',
  },
  orange: {
    wrap: 'bg-white/80 text-neon-blue',
    icon: 'text-neon-blue',
    accent: 'bg-neon-blue',
    ring: 'ring-neon-blue/35',
    border: 'border-neon-blue/30',
    card: 'bg-neon-blue/[0.08] border-neon-blue/20',
    button: 'bg-sky-600 hover:bg-sky-500',
  },
  pink: {
    wrap: 'bg-white/80 text-neon-pink',
    icon: 'text-neon-pink',
    accent: 'bg-neon-pink',
    ring: 'ring-neon-pink/35',
    border: 'border-neon-pink/30',
    card: 'bg-neon-pink/[0.08] border-neon-pink/20',
    button: 'bg-neon-pink hover:bg-neon-pink/90',
  },
} as const

export type BrandIconTone = keyof typeof BRAND_ICON_TONES
