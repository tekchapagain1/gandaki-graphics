const services = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
    name: 'T-shirt Printing',
    description:
      'Vivid full-color prints on any t-shirt style. Upload your artwork and we handle the rest — from single pieces to bulk orders.',
    tag: 'DTF Technology',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M3 12h18M3 18h18" />
        <rect x="5" y="3" width="14" height="18" rx="2" />
      </svg>
    ),
    name: 'Hoodie Printing',
    description:
      'Bold, durable prints on hoodies and sweatshirts. Perfect for teams, events, brands, or personal use. Any design, any color.',
    tag: 'Any artwork',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    ),
    name: 'Cup & Mug Design',
    description:
      'Custom cup prints for gifting, corporate branding, or events. Crisp, lasting designs that make every sip memorable.',
    tag: 'Gift-ready',
  },
]

export default function Services() {
  return (
    <section id="services" className="max-w-5xl mx-auto px-6 py-16">
      <p className="section-label">What we offer</p>
      <h2 className="section-title">Our services</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="card p-6 flex flex-col gap-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
          >
            {/* Icon */}
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
              {service.icon}
            </div>

            {/* Content */}
            <div>
              <h3 className="text-[15px] font-medium mb-2">{service.name}</h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed mb-3">
                {service.description}
              </p>
              <span
                className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ color: '#185FA5', backgroundColor: '#E6F1FB' }}
              >
                {service.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
