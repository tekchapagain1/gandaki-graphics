import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrderForm from '@/components/OrderForm'

export const metadata: Metadata = {
  title: 'Place an Order — Gandaki Graphics',
  description: 'Submit your custom print order — t-shirts, hoodies, or cups. Upload your design file or add notes and we\'ll confirm your order quickly.',
}

export default function OrderPage() {
  return (
    <main>
      <Navbar />
      <OrderForm />
      <Footer />
    </main>
  )
}
