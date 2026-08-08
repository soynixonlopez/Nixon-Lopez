import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ProyectosContent } from '@/components/proyectos/ProyectosContent'
import { getMessages } from '@/i18n/messages'
import { SITE_URL } from '@/lib/site-config'

const defaultMessages = getMessages('es')

export const metadata: Metadata = {
  title: defaultMessages.projectsPage.metaTitle,
  description: defaultMessages.projectsPage.metaDescription,
  alternates: { canonical: `${SITE_URL}/proyectos` },
}

export default function ProyectosPage() {
  return (
    <>
      <Header />
      <ProyectosContent />
      <Footer />
    </>
  )
}
