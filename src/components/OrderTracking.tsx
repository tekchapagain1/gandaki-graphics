'use client'

import { useState } from 'react'
import Link from 'next/link'

type TimelineStep = {
  label: string
  completed: boolean
  time: string
}

type TrackingOrder = {
  id: number
  orderCode?: string | null
  name: string
  email?: string | null
  phone?: string | null
  product: string
  size?: string | null
  color?: string | null
  quantity: number
  designNotes?: string | null
  designFileName?: string | null
  deadline?: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export default function OrderTracking() {
  const [orderRef, setOrderRef] = useState('')
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<TrackingOrder | null>(null)
  const [timeline, setTimeline] = useState<TimelineStep[]>([])

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)
    setTimeline([])

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderRef, emailOrPhone }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to track order')
      }

      setOrder(data.order)
      setTimeline(data.timeline || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <p className="section-label">Track your order</p>
          <h1 className="font-display text-5xl md:text-6xl font-normal leading-tight mb-4">
            Know exactly
            <br />
            where it stands.
          </h1>
          <p className="text-sm font-light text-gray-500 max-w-lg mb-8 leading-relaxed">
            Enter your order code and the phone number or email you used at checkout. We&apos;ll show you the current status, summary, and next step.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: 'Order code', text: 'Use the code from your confirmation message.' },
              { title: 'Contact match', text: 'Pair it with the phone or email you used.' },
              { title: 'Live status', text: 'See pending, confirmed, or completed.' },
              { title: 'Order summary', text: 'Review item, quantity, and deadline.' },
            ].map((item) => (
              <div key={item.title} className="card p-4">
                <p className="text-sm font-medium text-gray-900 mb-1">{item.title}</p>
                <p className="text-xs font-light text-gray-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 md:p-8 shadow-sm">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Order code
              </label>
              <input
                type="text"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value.toUpperCase())}
                placeholder="e.g. GG-1A2B3C"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-light text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Phone or email
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="e.g. 9800000000 or asha@example.com"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-light text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !orderRef || !emailOrPhone}
              className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking status...' : 'Track order'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!error && !order && (
            <div className="mt-5 rounded-xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Tip: You can find your order code in the confirmation message after placing your order.
              </p>
            </div>
          )}

          {order && (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 mb-2">
                      Current status
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-900 capitalize">
                      {order.status}
                    </h2>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full capitalize ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : order.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {order.orderCode || `ORD-${order.id}`}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Last updated {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <InfoCard label="Product" value={order.product} />
                <InfoCard label="Quantity" value={String(order.quantity)} />
                <InfoCard label="Size" value={order.size || '—'} />
                <InfoCard label="Deadline" value={order.deadline || '—'} />
                <InfoCard label="Contact" value={order.phone || order.email || '—'} />
                <InfoCard label="Design file" value={order.designFileName || 'Not uploaded'} />
              </div>

              <div className="card p-5">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
                  Progress timeline
                </p>
                <div className="space-y-4">
                  {timeline.map((step, index) => (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            step.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="w-px flex-1 min-h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <p className="text-sm font-medium text-gray-900">{step.label}</p>
                        <p className="text-xs text-gray-400 mt-1">{step.time ? new Date(step.time).toLocaleString() : 'Waiting for update'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/order" className="btn-outline">
          Place a new order
        </Link>
      </div>
    </section>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
    </div>
  )
}
