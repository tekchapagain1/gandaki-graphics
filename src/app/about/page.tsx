import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AboutContent from '@/components/AboutContent'

export const metadata: Metadata = {
  title: 'About — Gandaki Graphics',
  description: 'Learn about Gandaki Graphics — professional DTF printing in Gandaki Province, Nepal. Our story, our machine, and our commitment to quality.',
}

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutContent />
      <Footer />
    </main>
  )
}
