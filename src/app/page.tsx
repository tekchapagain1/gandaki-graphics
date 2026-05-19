import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Stats from '@/components/Stats'
import HowItWorks from '@/components/HowItWorks'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <div className="border-t border-gray-100" />
      <Services />
      <Stats />
      <div className="border-t border-gray-100 max-w-5xl mx-auto" />
      <HowItWorks />
      <Contact />
      <Footer />
    </main>
  )
}
