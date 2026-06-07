'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Category = 'All' | 'T-shirts' | 'Hoodies' | 'Cups'



// SVG placeholder illustrations per category
function PlaceholderIllustration({ category, color, accent }: { category: string; color: string; accent: string }) {
  if (category === 'T-shirts') {
    return (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="200" fill={color} />
        <path d="M70 50 L50 70 L70 80 L70 160 L130 160 L130 80 L150 70 L130 50 Q120 40 100 42 Q80 40 70 50Z"
          fill="white" stroke={accent} strokeWidth="1.5" />
        <rect x="82" y="90" width="36" height="36" rx="4" fill={accent} opacity="0.15" />
        <rect x="88" y="96" width="24" height="4" rx="2" fill={accent} opacity="0.5" />
        <rect x="88" y="104" width="18" height="4" rx="2" fill={accent} opacity="0.5" />
        <rect x="88" y="112" width="22" height="4" rx="2" fill={accent} opacity="0.5" />
        <text x="100" y="175" textAnchor="middle" fontSize="9" fill={accent} opacity="0.4" fontFamily="sans-serif">T-SHIRT PRINT</text>
      </svg>
    )
  }
  if (category === 'Hoodies') {
    return (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="200" fill={color} />
        <path d="M65 48 L40 75 L62 85 L60 160 L140 160 L138 85 L160 75 L135 48 Q125 38 115 44 L112 60 Q100 66 88 60 L85 44 Q75 38 65 48Z"
          fill="white" stroke={accent} strokeWidth="1.5" />
        <path d="M88 60 Q100 66 112 60 L110 72 Q100 76 90 72Z" fill={accent} opacity="0.12" stroke={accent} strokeWidth="1" />
        <circle cx="100" cy="110" r="18" fill={accent} opacity="0.1" stroke={accent} strokeWidth="1" strokeDasharray="3 2" />
        <text x="100" y="114" textAnchor="middle" fontSize="8" fill={accent} opacity="0.6" fontFamily="sans-serif" fontWeight="bold">LOGO</text>
        <text x="100" y="175" textAnchor="middle" fontSize="9" fill={accent} opacity="0.4" fontFamily="sans-serif">HOODIE PRINT</text>
      </svg>
    )
  }
  // Cups
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="200" height="200" fill={color} />
      <path d="M65 65 L70 155 L130 155 L135 65 Z" fill="white" stroke={accent} strokeWidth="1.5" />
      <path d="M135 85 Q155 85 155 100 Q155 115 135 115" stroke={accent} strokeWidth="1.5" fill="none" />
      <rect x="72" y="80" width="56" height="50" rx="2" fill={accent} opacity="0.08" />
      <rect x="78" y="88" width="44" height="4" rx="2" fill={accent} opacity="0.4" />
      <rect x="78" y="97" width="34" height="4" rx="2" fill={accent} opacity="0.4" />
      <rect x="78" y="106" width="40" height="4" rx="2" fill={accent} opacity="0.4" />
      <rect x="65" y="155" width="70" height="6" rx="3" fill={accent} opacity="0.15" />
      <text x="100" y="178" textAnchor="middle" fontSize="9" fill={accent} opacity="0.4" fontFamily="sans-serif">CUP DESIGN</text>
    </svg>
  )
}

const CATEGORIES: Category[] = ['All', 'T-shirts', 'Hoodies', 'Cups']

interface GalleryItem {
  id: number
  category: string
  title: string
  desc: string
  color: string
  accent: string
  image: string
  rating: number
  customer: string
  review: string
}

export default function GalleryGrid() {
  const [active, setActive] = useState<Category>('All')
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true)
        const response = await fetch('/api/gallery')
        if (!response.ok) throw new Error('Failed to fetch gallery items')
        const data = await response.json()
        setItems(data.items || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  const filtered = active === 'All'
    ? items
    : items.filter((item) => item.category === active)

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-10">
        <p className="section-label">Our work</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="font-display text-4xl font-normal">Gallery</h1>
        </div>
        <p className="text-sm font-light text-gray-400 mt-3 max-w-lg">
          A sample of what we've made. From vibrant t-shirts to cozy hoodies and custom mugs — see how we bring designs to life with DTF printing.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
              active === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-gray-500 font-light">Loading gallery...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-gray-500 font-light">No items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group card overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer"
            >
              {/* Image area */}
              <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: item.color }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  loading="lazy"
                  className="object-cover"
                />
              </div>

              {/* Caption */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium leading-snug">{item.title}</p>
                    <p className="text-xs font-light text-gray-400 mt-0.5">{item.desc}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: item.rating }).map((_, idx) => (
                        <span key={idx} className="text-[10px]">⭐</span>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      By {item.customer} · “{item.review}”
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full mt-0.5"
                    style={{ color: item.accent, backgroundColor: item.color }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 border border-gray-100 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50">
        <div>
          <p className="font-medium text-gray-900 mb-1">Like what you see?</p>
          <p className="text-sm font-light text-gray-400">Send us your design and we'll get it printed.</p>
        </div>
        <Link href="/order" className="btn-primary shrink-0">
          Start your order →
        </Link>
      </div>
    </section>
  )
}
