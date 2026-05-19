const steps = [
  {
    number: '1',
    title: 'Send your design',
    description: 'Share your artwork via our order form or WhatsApp. Any file format accepted.',
  },
  {
    number: '2',
    title: 'Choose your product',
    description: 'T-shirt, hoodie, or cup — pick your item, size, and quantity.',
  },
  {
    number: '3',
    title: 'We print it',
    description: 'Our professional DTF machine prints with precision and vibrant color.',
  },
  {
    number: '4',
    title: 'You receive it',
    description: 'Pick up in person or get it delivered — ready to wear or gift.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-16">
      <p className="section-label">Simple process</p>
      <h2 className="section-title">How it works</h2>

      <div className="grid md:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden">
        {steps.map((step, index) => (
          <div key={step.number} className="bg-white p-6 flex flex-col gap-4">
            {/* Step number */}
            <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
              {step.number}
            </div>

            {/* Content */}
            <div>
              <h3 className="text-sm font-medium mb-2">{step.title}</h3>
              <p className="text-xs font-light text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Arrow (not last) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-gray-300">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
