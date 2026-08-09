import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ProyectosContent } from '@/components/proyectos/ProyectosContent'
import { getMessages } from '@/i18n/messages'
import { buildPageMetadata } from '@/lib/seo'

const defaultMessages = getMessages('es')

export const metadata: Metadata = buildPageMetadata({
  title: defaultMessages.projectsPage.metaTitle,
  description: defaultMessages.projectsPage.metaDescription,
  path: '/proyectos',
})

export default function ProyectosPage() {
  return (
    <>
      <Header />
      <ProyectosContent />
      <Footer />
    </>
  )
}
