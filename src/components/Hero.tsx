import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">

      {/* Left: Text */}
      <div>
        <span
          className="inline-block text-[10px] font-medium tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-6"
          style={{ color: '#185FA5', backgroundColor: '#E6F1FB' }}
        >
          DTF Printing — Gandaki Province
        </span>

        <h1 className="font-display text-5xl md:text-6xl font-normal leading-[1.15] mb-6">
          Your design,{' '}
          <em className="text-gray-400 not-italic font-normal">perfectly</em>
          <br />printed.
        </h1>

        <p className="text-sm font-light leading-relaxed text-gray-500 mb-8 max-w-sm">
          From custom t-shirts and hoodies to branded cups — we bring your
          artwork to life with professional Direct-to-Film printing.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/order" className="btn-primary">
            Order now →
          </Link>
          <Link href="/gallery" className="btn-outline">
            View gallery
          </Link>
        </div>
      </div>

      {/* Right: Visual card */}
      <div className="relative">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 aspect-[4/3] flex flex-col justify-end overflow-hidden relative">

          {/* Background icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <svg
              width="160"
              height="160"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              className="text-gray-900 opacity-[0.05]"
            >
              {/* T-shirt outline */}
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
            </svg>
          </div>

          {/* Featured image (place a file at public/images/featured.jpg) */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <Image
              src="/gallery/logo.png"
              alt="Featured product"
              fill
              loading="lazy"
              className="object-contain p-4 md:p-8"
            />
          </div>

          {/* Floating tag */}
          <div className="absolute top-4 right-4 bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm z-10">
            <p className="text-xs font-medium text-gray-900">DTF Print</p>
            <p className="text-[11px] text-gray-400 font-light">Full-color, any design</p>
          </div>

          {/* Card label */}
          <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-gray-400 mb-1 relative z-10">
            Featured product
          </p>
          <p className="font-display text-xl font-normal relative z-10">
            Custom Apparel<br />& Cup Printing
          </p>
        </div>

        {/* Decorative dot grid */}
        <div
          className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #9ca3af 1px, transparent 1px)',
            backgroundSize: '8px 8px',
          }}
        />
      </div>

    </section>
  )
}
