import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrderTracking from '@/components/OrderTracking'

export const metadata: Metadata = {
  title: 'Track Order — Gandaki Graphics',
  description: 'Track your custom print order using your order ID and phone number or email.',
}

export default function TrackPage() {
  return (
    <main>
      <Navbar />
      <OrderTracking />
      <Footer />
    </main>
  )
}
