import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrderForm from '@/components/OrderForm'

export const metadata: Metadata = {
  title: 'Place an Order — Gandaki Graphics',
  description: 'Submit your custom print order — t-shirts, hoodies, or cups. Send your design via WhatsApp and we\'ll get back to you fast.',
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
