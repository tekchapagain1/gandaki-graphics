import Link from 'next/link'
import Image from 'next/image'

const values = [
  {
    title: 'Quality first',
    desc: 'Every print goes through quality checks before it leaves our hands. If it\'s not right, we redo it.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: 'Fast turnaround',
    desc: 'Standard orders ready in 2–3 business days. Rush orders available for when you need it sooner.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'Any design',
    desc: 'DTF technology means no colour limits, no minimum order, and no design too complex. Send us anything.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
  },
  {
    title: 'Local & trusted',
    desc: 'Based right here in Gandaki Province. We\'re a local business that takes pride in serving our community.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
]

const specs = [
  { label: 'Technology', value: 'Direct-to-Film (DTF)' },
  { label: 'Print area', value: 'Up to A3 size' },
  { label: 'Colours', value: 'Full CMYK + white' },
  { label: 'Materials', value: 'Cotton, polyester, blends' },
  { label: 'Minimum order', value: 'No minimum — even 1 piece' },
  { label: 'File formats', value: 'PNG, PDF, AI, PSD, JPG' },
]

export default function AboutContent() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="section-label">Our story</p>
          <h1 className="font-display text-5xl font-normal leading-tight mb-6">
            Printing ideas<br />
            <em className="text-gray-400 not-italic">into reality.</em>
          </h1>
          <p className="text-sm font-light text-gray-500 leading-relaxed mb-4">
            Gandaki Graphics was founded with one goal — to bring professional-grade custom printing to Gandaki Province. What started as a passion for design and quality craftsmanship has grown into a trusted local printing business.
          </p>
          <p className="text-sm font-light text-gray-500 leading-relaxed mb-8">
            We use Direct-to-Film (DTF) printing technology, which produces vivid, durable prints on virtually any fabric or surface. From a single custom t-shirt to a bulk event order — we handle it all with the same care and precision.
          </p>
          <Link href="/order" className="btn-primary">
            Start a print order →
          </Link>
        </div>

        {/* Visual: machine illustration */}
        <div className="relative">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 aspect-square flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[220px]">
              {/* DTF Printer illustration */}
              <rect x="20" y="80" width="220" height="120" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
              <rect x="20" y="80" width="220" height="32" rx="8" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1.5" />
              <rect x="32" y="92" width="8" height="8" rx="2" fill="#185FA5" opacity="0.6" />
              <rect x="46" y="92" width="8" height="8" rx="2" fill="#16a34a" opacity="0.5" />
              <rect x="60" y="92" width="8" height="8" rx="2" fill="#e5e7eb" />
              <rect x="150" y="90" width="72" height="12" rx="3" fill="#e5e7eb" />
              {/* Print head rail */}
              <rect x="40" y="128" width="180" height="6" rx="3" fill="#e5e7eb" />
              {/* Print head */}
              <rect x="90" y="120" width="32" height="20" rx="4" fill="#185FA5" opacity="0.15" stroke="#185FA5" strokeWidth="1"/>
              <rect x="99" y="140" width="14" height="8" rx="2" fill="#185FA5" opacity="0.2" />
              {/* Film/paper output */}
              <rect x="40" y="160" width="180" height="28" rx="4" fill="#fafafa" stroke="#e5e7eb" strokeWidth="1" />
              <rect x="52" y="168" width="60" height="4" rx="2" fill="#185FA5" opacity="0.15" />
              <rect x="52" y="176" width="40" height="4" rx="2" fill="#185FA5" opacity="0.1" />
              {/* Output tray */}
              <rect x="30" y="188" width="200" height="10" rx="3" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1" />
              {/* Label */}
              <text x="130" y="230" textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="sans-serif" letterSpacing="2">DTF PRINTER</text>
            </svg>
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-3 -right-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-xs font-medium text-gray-900">Professional DTF</p>
            <p className="text-[11px] text-gray-400 font-light">Full-color printing</p>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* Values */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="section-label">What we stand for</p>
        <h2 className="section-title">Our values</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {values.map((v) => (
            <div key={v.title} className="card p-6 flex gap-4 hover:border-gray-200 transition-colors">
              <div className="w-10 h-10 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 mt-0.5">
                {v.icon}
              </div>
              <div>
                <p className="text-sm font-medium mb-1.5">{v.title}</p>
                <p className="text-sm font-light text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* Machine specs */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="section-label">Technical details</p>
        <h2 className="section-title">Print capabilities</h2>
        <div className="grid md:grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {specs.map((spec) => (
            <div key={spec.label} className="bg-white px-6 py-4 flex justify-between items-center gap-4">
              <p className="text-sm font-light text-gray-400">{spec.label}</p>
              <p className="text-sm font-medium text-gray-900 text-right">{spec.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-100" />

{/* Owner */}
<section className="max-w-5xl mx-auto px-6 py-16">
  <p className="section-label">The person behind it</p>
  <h2 className="section-title">Meet the owner</h2>
  <div className="flex items-center gap-6 card p-6 max-w-sm">

<Image
  src="/gallery/owner.png"
  alt="Sujan Poudel"
  width={96}
  height={128}
  loading="lazy"
  className="border border-blue-100 object-cover rounded-2xl"
/>
    <div>
      <p className="text-base font-medium">Sujan Poudel</p>
      <p className="text-sm font-light text-gray-400 mt-0.5">Founder & Owner, Gandaki Graphics</p>
      <p className="text-xs font-light text-gray-400 mt-2 leading-relaxed">
        Based in Gandaki Province, passionate about quality printing and helping local businesses and individuals bring their designs to life.
      </p>
    </div>
  </div>
</section>

      <div className="border-t border-gray-100" />

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-normal mb-4">
          Ready to bring your design to life?
        </h2>
        <p className="text-sm font-light text-gray-400 mb-8 max-w-md mx-auto">
          Order online, or come visit us in Gandaki Province. We'd love to help with your next project.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/order" className="btn-primary">Start your order →</Link>
          <Link href="/contact" className="btn-outline">Get in touch</Link>
        </div>
      </section>
    </div>
  )
}
