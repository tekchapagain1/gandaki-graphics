'use client'

import { useState, useEffect, useCallback } from 'react'

const testimonials = [
  {
    name: 'Priya Singh',
    company: 'Event Coordinator',
    quote: 'The print quality is absolutely incredible. Our event t-shirts arrived perfect, and the colors are so vibrant. The customer service was exceptional!',
    product: 'T-shirts (50 pcs)',
    rating: 5,
    image: '👩‍💼',
  },
  {
    name: 'Ramesh Kumar',
    company: 'Local Business Owner',
    quote: 'Fast turnaround and no minimum order. I needed custom hoodies for my team and they delivered in 2 days. Highly recommended!',
    product: 'Hoodies (25 pcs)',
    rating: 5,
    image: '👨‍💼',
  },
  {
    name: 'Anita Sharma',
    company: 'Graphic Designer',
    quote: 'I was impressed with how they handled my complex design file. The DTF printing really brings my artwork to life. Best local printer!',
    product: 'Custom Merchandise',
    rating: 5,
    image: '👩‍🎨',
  },
  {
    name: 'Dev Poudel',
    company: 'Tech Startup',
    quote: 'Used them for our merchandise launch. Professional, reliable, and the prints last forever. We\'re reordering!',
    product: 'T-shirts + Caps (200 pcs)',
    rating: 5,
    image: '👨‍💻',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000)
    return () => clearInterval(timer)
  }, [nextTestimonial])

  const current = testimonials[currentIndex]

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <p className="section-label">What customers say</p>
      <h2 className="section-title">Real testimonials</h2>

      {/* Testimonial card */}
      <div className="card p-8 md:p-12 max-w-2xl mx-auto">
        {/* Stars */}
        <div className="flex gap-1 mb-6">
          {Array.from({ length: current.rating }).map((_, i) => (
            <span key={i} className="text-lg">⭐</span>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-lg font-light text-gray-400 italic mb-8 leading-relaxed">
          "{current.quote}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="text-4xl">{current.image}</div>
          <div>
            <p className="text-sm font-medium text-gray-900">{current.name}</p>
            <p className="text-xs text-gray-400">{current.company}</p>
            <p className="text-xs text-gray-500 font-light mt-1">Ordered: {current.product}</p>
          </div>
        </div>
      </div>

      {/* Navigation dots and arrows */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={prevTestimonial}
          aria-label="Previous testimonial"
          className="p-2 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-gray-900 w-6' : 'bg-gray-200 w-2'
              }`}
              aria-label={`Testimonial ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextTestimonial}
          aria-label="Next testimonial"
          className="p-2 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Stats line */}
      <p className="text-center text-sm text-gray-400 mt-8">
        <span className="font-medium text-gray-900">500+</span> happy customers • <span className="font-medium text-gray-900">98%</span> would recommend
      </p>
    </section>
  )
}
