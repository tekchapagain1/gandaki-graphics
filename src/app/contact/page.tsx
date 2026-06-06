import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactContent from '@/components/ContactContent'

export const metadata: Metadata = {
  title: 'Contact — Gandaki Graphics',
  description: 'Get in touch with Gandaki Graphics. Visit us in Gandaki Province or reach us by phone, email, or social links.',
}

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <ContactContent />
      <Footer />
    </main>
  )
}
