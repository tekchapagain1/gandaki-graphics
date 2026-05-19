'use client'

import { useState } from 'react'
import Link from 'next/link'

// ✏️ Replace with your actual WhatsApp number (country code + number, no + or spaces)
const WHATSAPP_NUMBER = '9779769499307'

type Product = 'T-shirt' | 'Hoodie' | 'Cup' | ''
type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size' | ''

interface FormData {
  name: string
  phone: string
  product: Product
  size: Size
  color: string
  quantity: string
  designNotes: string
  deadline: string
}

const PRODUCTS: { value: Product; label: string; icon: string }[] = [
  { value: 'T-shirt', label: 'T-shirt', icon: '👕' },
  { value: 'Hoodie', label: 'Hoodie', icon: '🧥' },
  { value: 'Cup', label: 'Cup / Mug', icon: '☕' },
]

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']

export default function OrderForm() {
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    product: '',
    size: '',
    color: '',
    quantity: '',
    designNotes: '',
    deadline: '',
  })

  const [submitted, setSubmitted] = useState(false)

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function buildWhatsAppMessage(): string {
    const lines = [
      '🖨️ *New Print Order — Gandaki Graphics*',
      '',
      `👤 *Name:* ${form.name}`,
      `📞 *Phone:* ${form.phone || 'Not provided'}`,
      `📦 *Product:* ${form.product}`,
      form.product !== 'Cup' ? `📐 *Size:* ${form.size}` : '',
      `🎨 *Color preference:* ${form.color || 'No preference'}`,
      `🔢 *Quantity:* ${form.quantity}`,
      `📝 *Design notes:* ${form.designNotes || 'None'}`,
      `📅 *Deadline:* ${form.deadline || 'Flexible'}`,
      '',
      '_Please share your design file in this chat. Thank you!_',
    ]
    return lines.filter((l) => l !== null && l !== undefined && !(l === '' && false)).join('\n')
  }

  function handleSubmit() {
    if (!form.name || !form.product || !form.quantity) return
    const msg = buildWhatsAppMessage()
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    setSubmitted(true)
  }

  const isValid = form.name.trim() !== '' && form.product !== '' && form.quantity.trim() !== ''

  if (submitted) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-display text-3xl font-normal mb-3">Opening WhatsApp…</h2>
        <p className="text-sm font-light text-gray-400 mb-8 max-w-sm mx-auto">
          Your order details have been prepared. Send the message in WhatsApp and attach your design file — we'll confirm your order shortly.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setSubmitted(false)}
            className="btn-outline"
          >
            Edit order
          </button>
          <Link href="/gallery" className="btn-primary">
            View gallery →
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-10">
        <p className="section-label">Custom printing</p>
        <h1 className="font-display text-4xl font-normal mb-3">Place an order</h1>
        <p className="text-sm font-light text-gray-400 max-w-md">
          Fill in your order details below. We'll open WhatsApp with everything pre-filled — just attach your design file and send.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-10">

        {/* Form — left (3 cols) */}
        <div className="md:col-span-3 flex flex-col gap-8">

          {/* Step 1: Contact */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
              1 — Your details
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Asha Gurung"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-light text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Phone number (optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9800000000"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-light text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Product */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
              2 — Product type <span className="text-red-400">*</span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              {PRODUCTS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => {
                    update('product', p.value)
                    if (p.value === 'Cup') update('size', 'One Size')
                    else update('size', '')
                  }}
                  className={`flex flex-col items-center gap-2 py-4 px-3 border rounded-xl text-sm font-medium transition-all duration-150 ${
                    form.product === p.value
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <span className="text-2xl">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Size (hidden for Cup) */}
          {form.product && form.product !== 'Cup' && (
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
                3 — Size <span className="text-red-400">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {SIZES.filter((s) => s !== 'One Size').map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => update('size', size)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-150 ${
                      form.size === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
              {form.product && form.product !== 'Cup' ? '4' : '3'} — Print details
            </p>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Quantity <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    value={form.quantity}
                    onChange={(e) => update('quantity', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-light text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Preferred color / fabric
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Black, White"
                    value={form.color}
                    onChange={(e) => update('color', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-light text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Design notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your design, placement, any special requests…"
                  value={form.designNotes}
                  onChange={(e) => update('designNotes', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-light text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => update('deadline', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-light text-gray-600 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={!isValid}
            onClick={handleSubmit}
            className={`flex items-center justify-center gap-3 w-full py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
              isValid
                ? 'bg-green-500 hover:bg-green-400 text-white cursor-pointer'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.885 3.49" />
            </svg>
            Send order via WhatsApp
          </button>

          {!isValid && (
            <p className="text-xs text-gray-400 text-center -mt-4">
              Fill in name, product type, and quantity to continue.
            </p>
          )}
        </div>

        {/* Sidebar — right (2 cols) */}
        <div className="md:col-span-2 flex flex-col gap-4">

          {/* Order summary */}
          <div className="card p-5 sticky top-24">
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
              Order summary
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <SummaryRow label="Name" value={form.name || '—'} />
              <SummaryRow label="Product" value={form.product || '—'} />
              {form.product && form.product !== 'Cup' && (
                <SummaryRow label="Size" value={form.size || '—'} />
              )}
              <SummaryRow label="Color" value={form.color || '—'} />
              <SummaryRow label="Quantity" value={form.quantity || '—'} />
              {form.deadline && (
                <SummaryRow label="Deadline" value={form.deadline} />
              )}
            </div>

            {form.designNotes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 mb-1">Design notes</p>
                <p className="text-xs font-light text-gray-600 leading-relaxed">{form.designNotes}</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <p className="text-xs font-medium text-blue-800 mb-3 tracking-wide uppercase">Tips for best results</p>
            <ul className="flex flex-col gap-2">
              {[
                'Use PNG or PDF files for sharpest prints',
                'Minimum 300 DPI resolution recommended',
                'Transparent background works best',
                'Mention if you need a specific print position',
              ].map((tip) => (
                <li key={tip} className="flex gap-2 text-xs font-light text-blue-700 leading-relaxed">
                  <span className="shrink-0 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Turnaround */}
          <div className="card p-5">
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">Turnaround</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Standard</span>
                <span className="font-medium">2–3 business days</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Rush (extra fee)</span>
                <span className="font-medium">Same / next day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-400 font-light shrink-0">{label}</span>
      <span className="text-gray-900 font-medium text-right truncate">{value}</span>
    </div>
  )
}
