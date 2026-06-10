'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 transition-transform group-hover:scale-105">
            <img
              src="/gallery/logo.png"
              alt="Gandaki Graphics"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-base font-medium tracking-wide">
              Gandaki Graphics
            </span>
            <span className="text-[10px] font-light tracking-[0.18em] uppercase text-gray-400">
              Custom DTF Printing
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          <Link href="/#services" className="hover:text-gray-900 transition-colors">Services</Link>
          <Link href="/gallery" className="hover:text-gray-900 transition-colors">Gallery</Link>
          <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="/track" className="hover:text-gray-900 transition-colors">Track order</Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link href="/order" className="btn-primary">
            Order now →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-900 transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-900 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-900 transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4 text-sm text-gray-600">
          <Link href="/#services" onClick={() => setMobileOpen(false)} className="hover:text-gray-900">Services</Link>
          <Link href="/gallery" onClick={() => setMobileOpen(false)} className="hover:text-gray-900">Gallery</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="hover:text-gray-900">Pricing</Link>
          <Link href="/track" onClick={() => setMobileOpen(false)} className="hover:text-gray-900">Track order</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="hover:text-gray-900">About</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="hover:text-gray-900">Contact</Link>
          <Link href="/order" onClick={() => setMobileOpen(false)} className="btn-primary w-fit">
            Order now →
          </Link>
        </div>
      )}
    </nav>
  )
}
