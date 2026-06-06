'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What file formats do you accept?',
    answer: 'We accept PNG, PDF, AI, PSD, and JPG files. For best results, we recommend PNG with transparent background at 300 DPI. If you don\'t have a design file, just describe what you want and we can help create one.',
  },
  {
    question: 'Do you have minimum order quantities?',
    answer: 'No minimum! You can order just 1 piece if you want. Whether it\'s a single custom t-shirt or 500 pieces for your event, we handle it with the same care and quality.',
  },
  {
    question: 'What is your typical turnaround time?',
    answer: 'Standard orders take 2-3 business days from order confirmation. This includes design review, production, and quality check. Rush orders are available on request—just let us know when you need it.',
  },
  {
    question: 'Can I reorder the same design?',
    answer: 'Absolutely! We save all your designs and order details. Just place a new order and reference your previous order ID, or contact us directly for quick reorders.',
  },
  {
    question: 'What if I\'m not happy with the print?',
    answer: 'We guarantee quality. If your print doesn\'t meet our standards, we\'ll redo it free of charge. We take pride in every piece that leaves our shop.',
  },
  {
    question: 'Do you offer shipping or delivery?',
    answer: 'We\'re based in Gandaki Province with walk-in pickup available. We can arrange local delivery for a small fee. Shipping to other parts of Nepal is available—contact us for rates.',
  },
  {
    question: 'Can you fix or adjust my design?',
    answer: 'Yes! During the design review call, we can suggest improvements, adjust colors, resize elements, or make other changes. Multiple design revisions are included before printing starts.',
  },
  {
    question: 'What materials can you print on?',
    answer: 'Our DTF technology works on cotton, polyester, and cotton-blend fabrics. We print on t-shirts, hoodies, caps, and even mugs and other products. If you have a specific material in mind, just ask!',
  },
]

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <p className="section-label">Have questions?</p>
      <h2 className="section-title">Frequently asked</h2>

      {/* FAQ items */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
          >
            {/* Question button */}
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 md:py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <span className="font-medium text-gray-900 text-sm md:text-base pr-4">
                {faq.question}
              </span>
              <div
                className={`shrink-0 w-5 h-5 flex items-center justify-center transition-transform ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-600"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {/* Answer */}
            {expandedIndex === index && (
              <div className="px-6 py-4 md:py-5 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-700 font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still have questions CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 text-sm mb-4">
          Didn't find what you're looking for?
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="tel:+9779769499307"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            📞 Call us
          </a>
          <a
            href="mailto:gandakigraphicshome@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-900 text-sm font-medium rounded-lg transition-colors"
          >
            📧 Email
          </a>
          <a
            href="https://wa.me/9779769499307?text=Hi! I have a question about your printing services."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
