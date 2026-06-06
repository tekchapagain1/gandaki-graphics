import Link from 'next/link'

export default function Contact() {
  return (
    <section id="contact" className="max-w-5xl mx-auto px-6 py-16">

      {/* CTA Banner */}
      <div className="bg-gray-900 rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div>
          <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-gray-400 mb-3">
            Ready to print?
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-white leading-snug">
            Start your order<br />
            <em className="text-gray-400 not-italic">today.</em>
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link href="/order" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100">
            Start order
          </Link>
          <a
            href="tel:+9779769499307"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 text-sm font-medium rounded-lg transition-colors"
          >
            Call us
          </a>
          <a
            href="mailto:gandakigraphicshome@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 text-sm font-medium rounded-lg transition-colors"
          >
            Send an email
          </a>
        </div>
      </div>

      {/* Contact details */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">Location</p>
          <p className="text-sm font-medium">Gandaki Province, Nepal</p>
          <p className="text-xs text-gray-400 font-light mt-1">Walk-in & pickup available</p>
        </div>
        <div className="card p-5">
          <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">Hours</p>
          <p className="text-sm font-medium">Sun – Fri, 9am – 6pm</p>
          <p className="text-xs text-gray-400 font-light mt-1">Saturday by appointment</p>
        </div>
        <div className="card p-5">
          <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">Turnaround</p>
          <p className="text-sm font-medium">1–3 business days</p>
          <p className="text-xs text-gray-400 font-light mt-1">Rush orders available</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
        <a href="https://instagram.com/gandakigraphics" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">Instagram</a>
        <a href="https://facebook.com/gandakigraphics" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">Facebook</a>
        <a href="https://wa.me/9779769499307?text=Hi%20Gandaki%20Graphics!%20I%20want%20to%20start%20an%20order." target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">WhatsApp</a>
      </div>
    </section>
  )
}
