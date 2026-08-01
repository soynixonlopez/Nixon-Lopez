import BootcampBelowFold from '@/components/bootcamp/BootcampBelowFold'
import BootcampFooter from '@/components/bootcamp/BootcampFooter'
import BootcampHeader from '@/components/bootcamp/BootcampHeader'
import Hero from '@/components/bootcamp/Hero'
import { BOOTCAMP_META } from '@/lib/bootcamp'

export const dynamic = 'force-static'

export default function BootcampPage() {
  return (
    <>
      <BootcampHeader />
      <main>
        <Hero />
        <BootcampBelowFold />
      </main>
      <BootcampFooter />

      {/* SEO accesible — copy indexable sin saturar la UI */}
      <div className="sr-only">
        <h2>{BOOTCAMP_META.title}</h2>
        <p>{BOOTCAMP_META.description}</p>
      </div>
    </>
  )
}
