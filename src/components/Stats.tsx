'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { target: 100, suffix: 'k+', label: 'Products printed' },
  { target: 5, suffix: 'k+', label: 'Happy customers' },
  { target: 99, suffix: '%', label: 'On-time delivery' },
]

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLParagraphElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const duration = 1500
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <p ref={ref} className="font-display text-4xl font-normal mb-2">
      {count}{suffix}
    </p>
  )
}

export default function Stats() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      <div className="grid grid-cols-3 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white py-8 px-6 text-center">
            <AnimatedNumber target={stat.target} suffix={stat.suffix} />
            <p className="text-xs font-light text-gray-400 tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
