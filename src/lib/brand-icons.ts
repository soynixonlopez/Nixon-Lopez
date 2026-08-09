/** Tonos de icono/tarjeta alineados a la marca (navy / azul / púrpura / verde). */
export const BRAND_ICON_TONES = {
  blue: {
    wrap: 'bg-white/80 text-brand dark:bg-slate-800 dark:text-cyan-300',
    icon: 'text-brand dark:text-cyan-300',
    accent: 'bg-brand',
    ring: 'ring-brand/40 dark:ring-cyan-400/40',
    border: 'border-brand/20 dark:border-cyan-400/25',
    card: 'bg-brand/[0.06] border-brand/15 dark:bg-slate-900/90 dark:border-slate-700',
    button: 'bg-brand hover:bg-brand-light',
  },
  purple: {
    wrap: 'bg-white/80 text-neon-purple dark:bg-slate-800 dark:text-fuchsia-300',
    icon: 'text-neon-purple dark:text-fuchsia-300',
    accent: 'bg-neon-purple',
    ring: 'ring-neon-purple/35 dark:ring-fuchsia-400/40',
    border: 'border-neon-purple/30 dark:border-fuchsia-400/25',
    card: 'bg-neon-purple/[0.08] border-neon-purple/20 dark:bg-slate-900/90 dark:border-slate-700',
    button: 'bg-neon-purple hover:bg-neon-purple/90',
  },
  green: {
    wrap: 'bg-white/80 text-emerald-700 dark:bg-slate-800 dark:text-emerald-300',
    icon: 'text-emerald-600 dark:text-emerald-300',
    accent: 'bg-emerald-600',
    ring: 'ring-emerald-500/35 dark:ring-emerald-400/40',
    border: 'border-emerald-500/30 dark:border-emerald-400/25',
    card: 'bg-emerald-500/[0.08] border-emerald-500/20 dark:bg-slate-900/90 dark:border-slate-700',
    button: 'bg-emerald-600 hover:bg-emerald-500',
  },
  orange: {
    wrap: 'bg-white/80 text-neon-blue dark:bg-slate-800 dark:text-sky-300',
    icon: 'text-neon-blue dark:text-sky-300',
    accent: 'bg-neon-blue',
    ring: 'ring-neon-blue/35 dark:ring-sky-400/40',
    border: 'border-neon-blue/30 dark:border-sky-400/25',
    card: 'bg-neon-blue/[0.08] border-neon-blue/20 dark:bg-slate-900/90 dark:border-slate-700',
    button: 'bg-sky-600 hover:bg-sky-500',
  },
  pink: {
    wrap: 'bg-white/80 text-neon-pink dark:bg-slate-800 dark:text-pink-300',
    icon: 'text-neon-pink dark:text-pink-300',
    accent: 'bg-neon-pink',
    ring: 'ring-neon-pink/35 dark:ring-pink-400/40',
    border: 'border-neon-pink/30 dark:border-pink-400/25',
    card: 'bg-neon-pink/[0.08] border-neon-pink/20 dark:bg-slate-900/90 dark:border-slate-700',
    button: 'bg-neon-pink hover:bg-neon-pink/90',
  },
} as const

export type BrandIconTone = keyof typeof BRAND_ICON_TONES
