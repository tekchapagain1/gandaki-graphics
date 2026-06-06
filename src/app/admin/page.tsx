'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLogin from '@/components/AdminLogin'
import AdminOrders from '@/components/AdminOrders'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user has an active session
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const response = await fetch('/api/orders', {
        method: 'GET',
      })

      if (response.ok) {
        setIsAuthenticated(true)
      }
    } catch (err) {
      console.log('Not authenticated')
    } finally {
      setIsChecking(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAuthenticated(false)
      router.push('/admin')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (isChecking) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isAuthenticated ? (
          <AdminOrders onLogout={handleLogout} />
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <AdminLogin
              onLoginSuccess={() => {
                setIsAuthenticated(true)
              }}
            />
          </div>
        )}
      </div>
    </main>
  )
}
