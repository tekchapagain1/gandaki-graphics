'use client'

import { useState } from 'react'
import Link from 'next/link'

type Product = 'T-shirt' | 'Hoodie' | 'Cup' | ''
type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size' | ''

interface FormData {
  name: string
  email: string
  phone: string
  product: Product
  size: Size
  color: string
  quantity: string
  designNotes: string
  deadline: string
  designFile: File | null
}

const PRODUCTS: { value: Product; label: string; icon: string }[] = [
  { value: 'T-shirt', label: 'T-shirt', icon: '👕' },
  { value: 'Hoodie', label: 'Hoodie', icon: '🧥' },
  { value: 'Cup', label: 'Cup / Mug', icon: '☕' },
]

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'application/postscript',
  'application/vnd.adobe.photoshop',
  'application/octet-stream',
]

export default function OrderForm() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    product: '',
    size: '',
    color: '',
    quantity: '',
    designNotes: '',
    deadline: '',
    designFile: null,
  })

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  function update(field: keyof Omit<FormData, 'designFile'>, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleFileChange(file: File | null) {
    setFileError(null)

    if (!file) {
      setForm((prev) => ({ ...prev, designFile: null }))
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setFileError('Design files must be 50MB or smaller.')
      return
    }

    if (file.type && !ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError('Please upload PNG, JPG, PDF, PSD, AI, or WebP files.')
      return
    }

    setForm((prev) => ({ ...prev, designFile: file }))
  }

  async function handleSubmit() {
    setSubmitAttempted(true)
    if (!form.name || !form.phone || !form.email || !form.product || !form.quantity) return

    setIsLoading(true)
    setError(null)

    try {
      const payload = new FormData()
      payload.append('name', form.name)
      payload.append('email', form.email)
      payload.append('phone', form.phone)
      payload.append('product', form.product)
      payload.append('size', form.size)
      payload.append('color', form.color)
      payload.append('quantity', form.quantity)
      payload.append('designNotes', form.designNotes)
      payload.append('deadline', form.deadline)

      if (form.designFile) {
        payload.append('designFile', form.designFile)
      }

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        body: payload,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save order')
      }

      const data = await response.json()
      console.log('Order saved:', data.orderId)

      setSubmitted(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const isValid =
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.product !== '' &&
    form.quantity.trim() !== ''

  const validationIssues = getValidationIssues(form, fileError)
  const shouldShowValidationPanel = submitAttempted && validationIssues.length > 0

  if (submitted) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-display text-3xl font-normal mb-3">Order Received! ✓</h2>
        <p className="text-sm font-light text-gray-400 mb-8 max-w-md mx-auto">
          Thank you for your order. We&apos;ve received your details and will contact you soon via the phone number you provided to confirm and discuss your design.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-sm mx-auto">
          <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium text-gray-900 text-right">{form.product}</span>
            </div>
            {form.product !== 'Cup' && form.size && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium text-gray-900 text-right">{form.size}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-medium text-gray-900 text-right">{form.quantity}</span>
            </div>
            {form.color && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Color:</span>
                <span className="font-medium text-gray-900 text-right">{form.color}</span>
              </div>
            )}
            {form.designFile && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Design file:</span>
                <span className="font-medium text-gray-900 text-right truncate">{form.designFile.name}</span>
              </div>
            )}
            {form.deadline && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Deadline:</span>
                <span className="font-medium text-gray-900 text-right">{form.deadline}</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-8">
          We&apos;ll send a confirmation to <span className="font-medium">{form.email}</span> and call <span className="font-medium">{form.phone}</span> to confirm your order details.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => setSubmitted(false)}
            className="btn-outline"
          >
            Place another order
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
      <div className="mb-10">
        <p className="section-label">Custom printing</p>
        <h1 className="font-display text-4xl font-normal mb-3">Place an order</h1>
        <p className="text-sm font-light text-gray-400 max-w-md">
          Fill in your order details below. We&apos;ll save your order and contact you to confirm and discuss your design.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-3 flex flex-col gap-8">
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
                  Email address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. asha@example.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-light text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Phone number <span className="text-red-400">*</span>
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
                  Design file <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <label className="flex flex-col gap-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-4 cursor-pointer hover:border-gray-400 hover:bg-white transition-colors">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf,.psd,.ai,.webp"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 text-gray-500">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Upload a design file</p>
                      <p className="text-xs font-light text-gray-400 mt-0.5">
                        PNG, JPG, PDF, PSD, AI, or WebP up to 50MB.
                      </p>
                      {form.designFile ? (
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <p className="text-xs text-green-700 font-medium truncate">
                            Selected: {form.designFile.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleFileChange(null)}
                            className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 mt-2">Drop in your artwork or skip this step and send it later.</p>
                      )}
                    </div>
                  </div>
                </label>
                {fileError && <p className="text-xs text-red-600 mt-2">{fileError}</p>}
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

          <button
            type="button"
            disabled={!isValid || isLoading}
            onClick={handleSubmit}
            className={`flex items-center justify-center gap-3 w-full py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
              isValid && !isLoading
                ? 'bg-green-500 hover:bg-green-400 text-white cursor-pointer'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                Saving order...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Submit Order
              </>
            )}
          </button>

          {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-700 font-medium">{error}</p>
          </div>
        )}

          {!isValid && !error && !submitAttempted && (
            <p className="text-xs text-gray-400 text-center -mt-4">
              Fill in name, product type, and quantity to continue.
            </p>
          )}
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
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
              {form.designFile && <SummaryRow label="Design file" value={form.designFile.name} />}
              {form.deadline && <SummaryRow label="Deadline" value={form.deadline} />}
            </div>

            {form.designNotes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 mb-1">Design notes</p>
                <p className="text-xs font-light text-gray-600 leading-relaxed">{form.designNotes}</p>
              </div>
            )}
          </div>

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

      <aside
        className={`fixed right-4 top-24 z-40 hidden lg:block w-72 transition-all duration-300 ${
          shouldShowValidationPanel
            ? 'translate-x-0 opacity-100 pointer-events-auto'
            : 'translate-x-[120%] opacity-0 pointer-events-none'
        }`}
        aria-live="polite"
      >
        <div className="rounded-2xl border border-red-200 bg-white shadow-2xl overflow-hidden">
          <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-500">Fix these first</p>
              <p className="text-sm font-medium text-gray-900 mt-1">Order form needs attention</p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitAttempted(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Dismiss validation panel"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {validationIssues.map((issue) => (
                <li key={issue} className="flex gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          shouldShowValidationPanel
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!shouldShowValidationPanel}
      >
        <button
          type="button"
          aria-label="Dismiss validation panel backdrop"
          className="absolute inset-0 bg-black/25"
          onClick={() => setSubmitAttempted(false)}
        />
        <div
          className={`absolute inset-x-0 bottom-0 transition-transform duration-300 ${
            shouldShowValidationPanel ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="mx-3 mb-3 rounded-t-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden max-h-[75vh]">
            <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center justify-between gap-3 sticky top-0">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-500">Fix these first</p>
                <p className="text-sm font-medium text-gray-900 mt-1">Order form needs attention</p>
              </div>
              <button
                type="button"
                onClick={() => setSubmitAttempted(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Dismiss validation panel"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(75vh-64px)]">
              <ul className="space-y-2">
                {validationIssues.map((issue) => (
                  <li key={issue} className="flex gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
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

function getValidationIssues(form: FormData, fileError: string | null) {
  const issues: string[] = []

  if (!form.name.trim()) issues.push('Add your full name.')
  if (!form.email.trim()) {
    issues.push('Add your email address.')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    issues.push('Enter a valid email address.')
  }

  const cleanedPhone = form.phone.replace(/[-.\s()]/g, '')
  if (!cleanedPhone) {
    issues.push('Add your phone number.')
  } else if (!/^\d{10}$/.test(cleanedPhone)) {
    issues.push('Phone number must be 10 digits.')
  }

  if (!form.product) issues.push('Choose a product.')
  if (form.product && form.product !== 'Cup' && !form.size) issues.push('Choose a size for the selected product.')

  if (!form.quantity.trim()) {
    issues.push('Enter a quantity.')
  } else {
    const qty = Number(form.quantity)
    if (!Number.isInteger(qty) || qty < 1) {
      issues.push('Quantity must be at least 1.')
    }
  }

  if (form.deadline) {
    const deadline = new Date(form.deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (deadline < today) {
      issues.push('Deadline cannot be in the past.')
    }
  }

  if (fileError) issues.push(fileError)

  return issues
}
