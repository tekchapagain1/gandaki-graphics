import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Stats from '@/components/Stats'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import ProcessTimeline from '@/components/ProcessTimeline'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
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
      <Testimonials />
      <div className="border-t border-gray-100 max-w-5xl mx-auto" />
      <ProcessTimeline />
      <div className="border-t border-gray-100 max-w-5xl mx-auto" />
      <Pricing />
      <div className="border-t border-gray-100 max-w-5xl mx-auto" />
      <FAQ />
      <div className="border-t border-gray-100 max-w-5xl mx-auto" />
      <HowItWorks />
      <Contact />
      <Footer />
    </main>
  )
}
