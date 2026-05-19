import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GalleryGrid from '@/components/GalleryGrid'

export const metadata: Metadata = {
  title: 'Gallery — Gandaki Graphics',
  description: 'Browse our custom DTF print work — t-shirts, hoodies, and cup designs printed in Gandaki Province.',
}

export default function GalleryPage() {
  return (
    <main>
      <Navbar />
      <GalleryGrid />
      <Footer />
    </main>
  )
}
