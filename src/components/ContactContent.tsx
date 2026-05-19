'use client'

const WHATSAPP_NUMBER = '9779814137314'
const WHATSAPP_MESSAGE = 'Hi Gandaki Graphics! I have a question about custom printing.'
const EMAIL = 'gandakigraphicshome@gmail.com'
const PHONE = '+977 981-4137314'
const ADDRESS = '10 New Rd, Pokhara 33700'
const MAPS_URL = 'https://maps.app.goo.gl/pUARbW21djEWtkKb6'

const faqs = [
  {
    q: 'What file format should I send?',
    a: 'PNG with transparent background is best. PDF, AI, and PSD also work well. Minimum 300 DPI for sharp results.',
  },
  {
    q: 'Do you have a minimum order quantity?',
    a: 'No minimum! We print even a single piece. Bulk orders (10+) may qualify for discounts — ask us.',
  },
  {
    q: 'How long does printing take?',
    a: 'Standard orders are ready in 2–3 business days. Rush orders (same or next day) are available for an additional fee.',
  },
  {
    q: 'Can you print on dark-coloured fabric?',
    a: 'Yes — DTF printing works on dark fabrics because we print a white base layer first. All colours come out vivid.',
  },
  {
    q: 'Do you do delivery?',
    a: 'Yes, we can arrange delivery within Gandaki Province. You can also pick up directly from our shop.',
  },
  {
    q: 'Can I see a sample before bulk printing?',
    a: 'Absolutely. We recommend ordering a sample piece before committing to large quantities.',
  },
]

export default function ContactContent() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <div>
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="section-label">Get in touch</p>
        <h1 className="font-display text-5xl font-normal mb-4">Contact us</h1>
        <p className="text-sm font-light text-gray-400 max-w-md">
          Questions, quotes, or just want to say hi — reach us on WhatsApp for the fastest reply.
        </p>
      </section>

      {/* Main grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-5 gap-10">

        {/* Left: contact methods */}
        <div className="md:col-span-3 flex flex-col gap-4">

          {/* WhatsApp — primary */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 p-6 bg-green-500 hover:bg-green-400 rounded-2xl transition-colors"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.885 3.49" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm mb-0.5">WhatsApp — fastest reply</p>
              <p className="text-green-100 text-xs font-light">{PHONE}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-70 group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Email */}
          <a
            href={`mailto:${EMAIL}`}
            className="group flex items-center gap-5 p-5 card hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-0.5">Email</p>
              <p className="text-xs font-light text-gray-400">{EMAIL}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Phone */}
          <a
            href={`tel:${PHONE.replace(/\s/g, '')}`}
            className="group flex items-center gap-5 p-5 card hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.44 2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-0.5">Phone</p>
              <p className="text-xs font-light text-gray-400">{PHONE}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Location */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 p-5 card hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-0.5">Location</p>
              <p className="text-xs font-light text-gray-400">{ADDRESS}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right: hours + info */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Hours */}
          <div className="card p-5">
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">Business hours</p>
            <div className="flex flex-col gap-2.5">
              {[
                { day: 'Sunday – Friday', hours: '9:00 AM – 6:00 PM' },
                { day: 'Saturday', hours: 'By appointment' },
                { day: 'Public holidays', hours: 'Closed' },
              ].map((row) => (
                <div key={row.day} className="flex justify-between gap-2 text-sm">
                  <span className="text-gray-400 font-light">{row.day}</span>
                  <span className="font-medium text-gray-900">{row.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Turnaround */}
          <div className="card p-5">
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">Turnaround time</p>
            <div className="flex flex-col gap-2.5">
              {[
                { type: 'Standard order', time: '2–3 business days' },
                { type: 'Rush order', time: 'Same / next day' },
                { type: 'Bulk order (50+)', time: '4–5 business days' },
              ].map((row) => (
                <div key={row.type} className="flex justify-between gap-2 text-sm">
                  <span className="text-gray-400 font-light">{row.type}</span>
                  <span className="font-medium text-gray-900">{row.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick tip */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <p className="text-xs font-medium text-blue-800 mb-2 tracking-wide uppercase">Pro tip</p>
            <p className="text-xs font-light text-blue-700 leading-relaxed">
              WhatsApp is the quickest way to reach us. Send your design file directly in the chat for the fastest quote.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="section-label">Common questions</p>
        <h2 className="section-title">FAQ</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="card p-5">
              <p className="text-sm font-medium mb-2 leading-snug">{faq.q}</p>
              <p className="text-sm font-light text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
