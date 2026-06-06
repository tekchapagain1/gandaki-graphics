'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface Order {
  id: number
  name: string
  phone?: string
  product: string
  size?: string
  color?: string
  quantity: number
  designNotes?: string
  designFileName?: string
  designFilePath?: string
  deadline?: string
  status: string
  createdAt: string
  updatedAt: string
}

interface SecurityLog {
  timestamp: string
  type: 'spam_attempt' | 'rate_limit' | 'validation_fail' | 'suspicious_pattern'
  ip: string
  email?: string
  reason: string
  data?: unknown
}

const STATUS_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  completed: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
}

export default function AdminOrders({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [logsLoading, setLogsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [logsError, setLogsError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [expandedLogIndex, setExpandedLogIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchOrders()
    fetchSecurityLogs()
  }, [statusFilter])

  async function fetchOrders() {
    try {
      setLoading(true)
      const url = new URL('/api/orders', window.location.origin)
      if (statusFilter) url.searchParams.append('status', statusFilter)

      const response = await fetch(url.toString())
      if (!response.ok) {
        if (response.status === 401) {
          onLogout()
          return
        }
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchSecurityLogs() {
    try {
      setLogsLoading(true)
      const response = await fetch('/api/admin/security/logs?limit=100')

      if (!response.ok) {
        if (response.status === 401) {
          onLogout()
          return
        }
        throw new Error('Failed to fetch security logs')
      }

      const data = await response.json()
      setSecurityLogs(data.logs || [])
      setLogsError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setLogsError(message)
    } finally {
      setLogsLoading(false)
    }
  }

  async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
      setUpdatingId(orderId)
      const response = await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update order')

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      alert(message)
    } finally {
      setUpdatingId(null)
    }
  }

  async function deleteOrder(orderId: number) {
    const confirmed = window.confirm('Delete this order permanently? This will also remove any uploaded design file.')
    if (!confirmed) return

    try {
      setDeletingId(orderId)
      const response = await fetch('/api/orders/update', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      if (!response.ok) throw new Error('Failed to delete order')

      setOrders((prev) => prev.filter((o) => o.id !== orderId))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      alert(message)
    } finally {
      setDeletingId(null)
    }
  }

  const statuses = ['pending', 'confirmed', 'completed', 'cancelled']
  const currentColors = STATUS_COLORS[statusFilter || 'pending'] || STATUS_COLORS.pending

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-6 md:px-8 md:py-8 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
                <img src="/gallery/logo.png" alt="Gandaki Graphics" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/60 mb-1">Admin dashboard</p>
                <h1 className="text-2xl md:text-3xl font-semibold">Gandaki Graphics</h1>
                <p className="text-sm text-white/70 mt-1">Manage orders, status, and uploaded design files</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
              <p className="text-sm text-gray-500 mt-1">Manage all customer orders</p>
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
              {orders.length} shown
            </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-gray-400 mb-2">
              Security monitor
            </p>
            <h2 className="text-xl font-semibold text-gray-900">Security logs</h2>
            <p className="text-sm text-gray-500 mt-1">
              Review validation failures, rate limits, and suspicious submissions.
            </p>
          </div>
          <button
            onClick={fetchSecurityLogs}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refresh logs
          </button>
        </div>

        {logsLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading security logs...</p>
          </div>
        ) : logsError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{logsError}</p>
          </div>
        ) : securityLogs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl bg-gray-50">
            <p className="text-gray-500">No security events recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {securityLogs.slice().reverse().map((log, index) => {
              const isOpen = expandedLogIndex === index
              return (
                <div key={`${log.timestamp}-${index}`} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedLogIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`inline-flex shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wide ${
                        log.type === 'rate_limit'
                          ? 'bg-yellow-100 text-yellow-800'
                          : log.type === 'validation_fail'
                            ? 'bg-red-100 text-red-700'
                            : log.type === 'suspicious_pattern'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}>
                        {log.type.replace('_', ' ')}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{log.reason}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(log.timestamp).toLocaleString()} · {log.ip}
                          {log.email ? ` · ${log.email}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {isOpen ? 'Hide details' : 'Show details'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 bg-gray-50 border-t border-gray-100">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <Row label="Timestamp" value={new Date(log.timestamp).toLocaleString()} />
                          <Row label="Type" value={log.type} />
                          <Row label="IP" value={log.ip} />
                          <Row label="Email" value={log.email || '—'} />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Details payload</p>
                          <pre className="text-xs leading-relaxed bg-white border border-gray-200 rounded-lg p-3 overflow-auto text-gray-700">
{JSON.stringify(log.data ?? {}, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({orders.length})
            </button>
            {statuses.map((status) => {
              const count = orders.filter((o) => o.status === status).length
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    statusFilter === status
                      ? `${STATUS_COLORS[status].badge}`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status} ({count})
                </button>
              )
            })}
          </div>

          {/* Orders table */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-500">No orders {statusFilter ? `with status "${statusFilter}"` : 'yet'}</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium text-gray-700">Name</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-700">Product</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-700">Qty</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-700">Status</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-700">Ordered</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.name}</p>
                            <p className="text-xs text-gray-500">{order.phone || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-900">{order.product}</p>
                            {order.size && <p className="text-xs text-gray-500">{order.size}</p>}
                            {order.designFileName && order.designFilePath ? (
                              <a
                                href={order.designFilePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 mt-1 inline-block hover:underline"
                              >
                                File: {order.designFileName}
                              </a>
                            ) : order.designFileName ? (
                              <p className="text-xs text-blue-600 mt-1 truncate">
                                File: {order.designFileName}
                              </p>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{order.quantity}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status].badge}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={updatingId === order.id || deletingId === order.id}
                              className="text-xs border border-gray-200 rounded px-2 py-1 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {statuses.map((s) => (
                                <option key={s} value={s} className="capitalize">
                                  {s}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              disabled={deletingId === order.id}
                              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId === order.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500 text-xs uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-gray-900 text-xs text-right break-all">{value}</span>
    </div>
  )
}
