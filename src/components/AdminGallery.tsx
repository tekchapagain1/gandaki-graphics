'use client'

import { useState, useEffect } from 'react'

interface GalleryItem {
  id: number
  category: string
  title: string
  desc: string
  color: string
  accent: string
  image: string
  rating: number
  customer: string
  review: string
  createdAt: string
}

const CATEGORIES = ['T-shirts', 'Hoodies', 'Cups']

const COLOR_PRESETS = [
  { name: 'Warm Cream / Gray', color: '#F1EFE8', accent: '#5F5E5A' },
  { name: 'Soft Blue / Navy', color: '#E6F1FB', accent: '#185FA5' },
  { name: 'Mint Green / Emerald', color: '#E1F5EE', accent: '#0F6E56' },
  { name: 'Muted Yellow / Brown', color: '#FAEEDA', accent: '#854F0B' },
  { name: 'Light Red / Crimson', color: '#FCEBEB', accent: '#A32D2D' },
  { name: 'Soft Pink / Magenta', color: '#FBEAF0', accent: '#993556' },
  { name: 'Lime Green / Dark Green', color: '#EAF3DE', accent: '#3B6D11' },
]

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [editId, setEditId] = useState<number | null>(null)
  const [category, setCategory] = useState('T-shirts')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [color, setColor] = useState('#F1EFE8')
  const [accent, setAccent] = useState('#5F5E5A')
  const [customer, setCustomer] = useState('')
  const [review, setReview] = useState('')
  const [rating, setRating] = useState(5)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('') // Fallback URL/path

  useEffect(() => {
    fetchGallery()
  }, [])

  async function fetchGallery() {
    try {
      setLoading(true)
      const response = await fetch('/api/gallery')
      if (!response.ok) throw new Error('Failed to fetch gallery items')
      const data = await response.json()
      setItems(data.items || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  function handleEditClick(item: GalleryItem) {
    setEditId(item.id)
    setCategory(item.category)
    setTitle(item.title)
    setDesc(item.desc)
    setColor(item.color)
    setAccent(item.accent)
    setCustomer(item.customer)
    setReview(item.review)
    setRating(item.rating)
    setImageUrl(item.image)
    setImageFile(null) // Reset file upload
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditId(null)
    setCategory('T-shirts')
    setTitle('')
    setDesc('')
    setColor('#F1EFE8')
    setAccent('#5F5E5A')
    setCustomer('')
    setReview('')
    setRating(5)
    setImageFile(null)
    setImageUrl('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !desc || !customer || !review) {
      alert('Please fill out all required fields.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('category', category)
      formData.append('title', title)
      formData.append('desc', desc)
      formData.append('color', color)
      formData.append('accent', accent)
      formData.append('customer', customer)
      formData.append('review', review)
      formData.append('rating', String(rating))

      if (imageFile) {
        formData.append('imageFile', imageFile)
      } else if (imageUrl) {
        formData.append('image', imageUrl)
      }

      const url = editId ? `/api/gallery/${editId}` : '/api/gallery'
      const method = editId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save gallery item')

      alert(editId ? 'Gallery item updated successfully!' : 'Gallery item created successfully!')
      resetForm()
      fetchGallery()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this gallery item permanently?')
    if (!confirmed) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete gallery item')
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
      if (editId === id) resetForm()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start">
      {/* Left 2 Cols: Form Editor */}
      <div className="lg:col-span-2 card p-6 md:p-8 bg-white border border-gray-200 shadow-sm sticky top-24">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {editId ? 'Edit Gallery Item' : 'Add Gallery Item'}
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            {editId ? `Updating ID #${editId}` : 'Create a new portfolio item for the public gallery'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-400 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Graphic Tee"
                className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. Chest print"
                className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. Sarah M."
                className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value, 10))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-400 transition-colors"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} {'⭐'.repeat(r)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Customer Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="e.g. Highly satisfied with the DTF print quality!"
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors resize-none"
              required
            />
          </div>

          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Aesthetic Colors</p>
            
            {/* Color Presets */}
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => {
                    setColor(preset.color)
                    setAccent(preset.accent)
                  }}
                  className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center relative hover:scale-110 transition-transform shadow-xs"
                  title={preset.name}
                  style={{ background: preset.color }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: preset.accent }} />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                  Background
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0 shrink-0"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-md px-2 py-1 uppercase font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                  Accent
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0 shrink-0"
                  />
                  <input
                    type="text"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-md px-2 py-1 uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            />
            {editId && imageUrl && !imageFile && (
              <p className="text-xs text-gray-400 mt-1.5 italic truncate">
                Current image: {imageUrl}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary justify-center text-sm py-2 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editId ? 'Update Item' : 'Create Item'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Right 3 Cols: Items list */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">Gallery Items</h3>
            <p className="text-xs text-gray-500 mt-0.5">Manage live portfolio items</p>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {items.length} items
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">Loading gallery items...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-white">
            <p className="text-gray-500">No gallery items found. Click add to start.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs flex flex-col group hover:shadow-sm transition-shadow"
              >
                {/* Visual Area (Simulating Gallery Preview) */}
                <div
                  className="aspect-video relative flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: item.color }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // fallback representation if image fails to load
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ color: item.accent, backgroundColor: `${item.color}cc` }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white px-2 py-1 rounded text-[10px] font-mono">
                    ID #{item.id}
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-400 font-light mt-0.5">{item.desc}</p>

                    <div className="flex items-center gap-0.5 mt-2">
                      {Array.from({ length: item.rating }).map((_, idx) => (
                        <span key={idx} className="text-[10px]">⭐</span>
                      ))}
                    </div>

                    <p className="text-[11px] text-gray-500 italic mt-2 leading-relaxed">
                      By {item.customer} · “{item.review}”
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="flex-1 text-center py-1.5 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="py-1.5 px-3 rounded-lg border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
