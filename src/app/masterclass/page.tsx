import Benefits from '@/components/masterclass/Benefits'
import CTA from '@/components/masterclass/CTA'
import Hero from '@/components/masterclass/Hero'
import Instructor from '@/components/masterclass/Instructor'
import Learning from '@/components/masterclass/Learning'
import MasterclassHeader from '@/components/masterclass/MasterclassHeader'
import Projects from '@/components/masterclass/Projects'
import RegisterForm from '@/components/masterclass/RegisterForm'

export default function MasterclassPage() {
  return (
    <>
      <MasterclassHeader />
      <main>
        <Hero />
        <Benefits />
        <Learning />
        <Instructor />
        <Projects />
        <RegisterForm />
        <CTA />
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
