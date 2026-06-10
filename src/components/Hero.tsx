'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const Product3DScene = dynamic(() => import('@/components/Product3DScene'), { ssr: false })

const badges = [
  { text: '500+ happy customers', delay: '0ms' },
  { text: '2-3 day turnaround', delay: '150ms' },
  { text: 'Quality guaranteed', delay: '300ms' },
]

export default function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">

      {/* Left: Text */}
      <div className="animate-in">
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
          <Link href="/order" className="btn-primary group float-cta">
            Start your order
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link href="/gallery" className="btn-outline group">
            View gallery
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-medium text-gray-500">
          {badges.map((badge) => (
            <span
              key={badge.text}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 badge-fade-in"
              style={{ animationDelay: badge.delay }}
            >
              <span className="text-green-500">✓</span>
              {badge.text}
            </span>
          ))}
        </div>
      </div>

      {/* Right: 3D T-shirt */}
      <div className="relative w-full h-[520px] md:h-[600px] flex items-center justify-center">
        <div className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full opacity-[0.07] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #185FA5 0%, transparent 70%)' }}
        />
        <Product3DScene />
      </div>

    </section>
  )
}
