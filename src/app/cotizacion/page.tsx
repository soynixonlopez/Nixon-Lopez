import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { QuoteConfigurator } from '@/components/quote/configurator/QuoteConfigurator'

type Props = {
  searchParams: Promise<{ service?: string }>
}

export default async function CotizacionPage({ searchParams }: Props) {
  const params = await searchParams
  const initialServiceId = typeof params.service === 'string' ? params.service.trim() || null : null

  return (
    <>
      <Header />
      <QuoteConfigurator initialServiceId={initialServiceId} />
      <Footer />
    </>
  )
}
