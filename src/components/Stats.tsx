const stats = [
  { number: '100%', label: 'Custom artwork accepted' },
  { number: 'Fast', label: 'Quick turnaround time' },
  { number: '3+', label: 'Product categories' },
]

export default function Stats() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      <div className="grid grid-cols-3 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white py-8 px-6 text-center">
            <p className="font-display text-4xl font-normal mb-2">{stat.number}</p>
            <p className="text-xs font-light text-gray-400 tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
