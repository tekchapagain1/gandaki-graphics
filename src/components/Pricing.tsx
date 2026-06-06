'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Pricing() {
  const [selectedProduct, setSelectedProduct] = useState('tshirt')

  const products = {
    tshirt: {
      name: 'T-Shirt Printing',
      description: 'High-quality cotton & polyester blends',
      basePrice: 450,
      icon: '👕',
      tiers: [
        { quantity: '1-5', price: 450, total: '450-2250' },
        { quantity: '6-20', price: 400, total: '2400-8000' },
        { quantity: '21-50', price: 350, total: '7350-17500' },
        { quantity: '50+', price: 300, discount: '33% off', total: 'Custom' },
      ],
    },
    hoodie: {
      name: 'Hoodie Printing',
      description: 'Premium cotton-blend hoodies',
      basePrice: 750,
      icon: '🧥',
      tiers: [
        { quantity: '1-5', price: 750, total: '750-3750' },
        { quantity: '6-20', price: 650, total: '3900-13000' },
        { quantity: '21-50', price: 600, total: '12600-30000' },
        { quantity: '50+', price: 500, discount: '33% off', total: 'Custom' },
      ],
    },
    cap: {
      name: 'Cap Printing',
      description: 'Baseball & snapback caps',
      basePrice: 350,
      icon: '🧢',
      tiers: [
        { quantity: '1-5', price: 350, total: '350-1750' },
        { quantity: '6-20', price: 300, total: '1800-6000' },
        { quantity: '21-50', price: 250, total: '5250-12500' },
        { quantity: '50+', price: 200, discount: '43% off', total: 'Custom' },
      ],
    },
    cup: {
      name: 'Mug Printing',
      description: 'Ceramic mugs with full-color prints',
      basePrice: 300,
      icon: '☕',
      tiers: [
        { quantity: '1-5', price: 300, total: '300-1500' },
        { quantity: '6-20', price: 250, total: '1500-5000' },
        { quantity: '21-50', price: 220, total: '4620-11000' },
        { quantity: '50+', price: 180, discount: '40% off', total: 'Custom' },
      ],
    },
  }

  const current = products[selectedProduct as keyof typeof products]

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <p className="section-label">Transparent pricing</p>
      <h2 className="section-title">Simple & affordable</h2>

      {/* Product selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 max-w-2xl mx-auto">
        {Object.entries(products).map(([key, product]) => (
          <button
            key={key}
            onClick={() => setSelectedProduct(key)}
            className={`py-3 px-4 rounded-lg border transition-all text-center font-medium text-sm ${
              selectedProduct === key
                ? 'border-blue-500 bg-blue-50 text-gray-900'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <div className="text-xl mb-1">{product.icon}</div>
            <div className="text-xs md:text-sm">{product.name.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      {/* Selected product details */}
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">{current.icon}</div>
          <h3 className="text-2xl font-medium mb-2">{current.name}</h3>
          <p className="text-gray-500 text-sm">{current.description}</p>
        </div>

        {/* Pricing table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
          {/* Table header */}
          <div className="grid grid-cols-3 gap-px bg-gray-100">
            <div className="bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Quantity</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Price/Unit</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Range</p>
            </div>
          </div>

          {/* Table rows */}
          {current.tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-3 gap-px ${idx < current.tiers.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="bg-white p-4 flex items-center justify-between">
                <span className="text-sm font-medium">{tier.quantity}</span>
                {tier.discount && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    {tier.discount}
                  </span>
                )}
              </div>
              <div className="bg-white p-4">
                <p className="text-sm font-medium">
                  ₹{tier.price.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4">
                <p className="text-sm text-gray-600">{tier.total}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info boxes */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="card p-4 text-center">
            <p className="text-2xl mb-2">✨</p>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">No setup fee</p>
            <p className="text-sm text-gray-700 font-light">Unlimited design changes</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl mb-2">🎨</p>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">No minimum</p>
            <p className="text-sm text-gray-700 font-light">Even just 1 piece</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl mb-2">⚡</p>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">Rush available</p>
            <p className="text-sm text-gray-700 font-light">Expedited turnaround</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-6">
            Want bulk discounts or custom pricing? Let's talk!
          </p>
          <Link href="/order" className="btn-primary">
            Get started now →
          </Link>
        </div>
      </div>

      {/* Footnote */}
      <div className="mt-12 pt-8 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500">
          All prices in <span className="font-medium">Nepali Rupees (₹)</span> • Prices subject to change • Design complexity may affect quotes
        </p>
      </div>
    </section>
  )
}
