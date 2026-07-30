import Hero from '@/components/masterclass/Hero'
import MasterclassBelowFold from '@/components/masterclass/MasterclassBelowFold'
import MasterclassHeader from '@/components/masterclass/MasterclassHeader'
import MasterclassScrollToRegister from '@/components/masterclass/MasterclassScrollToRegister'

/** Landing estática — el formulario habla con la API en cliente */
export const dynamic = 'force-static'

export default function MasterclassPage() {
  return (
    <>
      <MasterclassHeader />
      <MasterclassScrollToRegister />
      <main>
        <Hero />
        <MasterclassBelowFold />
      </main>
      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Nixon López. Todos los derechos reservados.</p>
        <p className="mt-1">
          <a href="/politica-de-privacidad" className="hover:text-slate-300">
            Política de privacidad
          </a>
        </p>
      </footer>
    </>
  )
}
