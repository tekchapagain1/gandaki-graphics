import Navbar from '@/components/Navbar'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Pricing | Gandaki Graphics',
  description: 'Transparent pricing for custom DTF printing. No setup fees, no minimums.',
}

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <Pricing />
      <Footer />
    </main>
  )
}
