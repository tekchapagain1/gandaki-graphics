'use client'

import { useRef, useState } from 'react'

export default function ProcessTimeline() {
  const steps = [
    {
      number: 1,
      title: 'Submit Order',
      description: 'Fill out the order form with your details and design',
      time: '2-4 hours',
      icon: '📋',
    },
    {
      number: 2,
      title: 'Design Review',
      description: 'We call you to confirm design, colors, and specifications',
      time: '1-2 hours',
      icon: '✅',
    },
    {
      number: 3,
      title: 'Production',
      description: 'We print your design using our professional DTF technology',
      time: '1-2 days',
      icon: '🖨️',
    },
    {
      number: 4,
      title: 'Quality Check',
      description: 'Every print inspected for color accuracy and durability',
      time: '1 day',
      icon: '🔍',
    },
    {
      number: 5,
      title: 'Ready for Pickup',
      description: 'Order ready at our location or arranged for delivery',
      time: 'Same day',
      icon: '📦',
    },
  ]

  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <p className="section-label">Simple process</p>
      <h2 className="section-title">How we work</h2>

      {/* Desktop timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-gray-200" />

          {/* Steps */}
          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Circle with icon */}
                <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-2xl mb-4 shadow-sm">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
                    Step {step.number}
                  </p>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-3">{step.description}</p>
                  <p className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                    {step.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile timeline */}
      <div className="md:hidden space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-500 flex items-center justify-center text-xl mb-2">
                {step.icon}
              </div>
              {idx < steps.length - 1 && (
                <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-blue-100" />
              )}
            </div>
            <div className="flex-1 pt-2">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-0.5">
                Step {step.number}
              </p>
              <h3 className="text-sm font-medium text-gray-900 mb-1">{step.title}</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed mb-2">{step.description}</p>
              <p className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                {step.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video showcase */}
      <div className="mt-16">
        <div className="text-center mb-6">
          <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
            See it in action
          </p>
          <h3 className="font-display text-2xl font-normal">
            Watch the DTF printing process
          </h3>
        </div>

        <div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden bg-gray-900 shadow-xl group cursor-pointer" onClick={togglePlay}>
          <video
            ref={videoRef}
            src="/videos/dtf-printing.mp4"
            poster="/gallery/tshirt1.png"
            playsInline
            preload="metadata"
            className="w-full aspect-video object-cover"
            onEnded={() => setPlaying(false)}
          />

          {/* Play button overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${playing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                <polygon points="8,5 19,12 8,19" fill="#185FA5" />
              </svg>
            </div>
          </div>

          {/* Bottom gradient with text */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <p className="text-white text-sm font-medium">Our DTF printer in action</p>
            <p className="text-white/60 text-xs">See how your designs come to life</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Watch the full DTF printing process — from blank fabric to finished print
        </p>
      </div>

      {/* Total time info */}
      <div className="mt-12 text-center">
        <div className="inline-block bg-blue-50 border border-blue-100 rounded-lg px-6 py-4">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Average turnaround:</span>
          </p>
          <p className="text-2xl font-medium text-gray-900">
            2-3 <span className="text-lg font-normal text-gray-500">business days</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Rush orders available on request
          </p>
        </div>
      </div>
    </section>
  )
}
