"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/lib/authService'
import { getCurrentUser } from '@/lib/userService'
import { useToast } from '@/components/ui/AppToastProvider'

interface AdminNavbarSimpleProps {
  onMenuClick: () => void
}

export default function AdminNavbarSimple({ onMenuClick }: AdminNavbarSimpleProps) {
  const router = useRouter()
  const [showProfile, setShowProfile] = useState(false)
  const [currentUser, setCurrentUser] = useState<Record<string, any> | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    const storedUser = getCurrentUser()
    if (storedUser) {
      const user = (storedUser as any).user || storedUser; // Force update for Vercel
      setCurrentUser(user);
    }
  }, [])

  const handleSignOut = () => {
    const result = logout()
    if (result.success) {
      setShowProfile(false)
      router.push('/login')
    } else {
      showToast(result.message || 'Có lỗi xảy ra khi đăng xuất', 'error')
    }
  }

  const userName = currentUser?.name || currentUser?.email || 'Admin User'
  const userRole = currentUser?.role || 'Administrator'
  const userAvatar = currentUser?.avatar || ''
  const userInitial = userName?.charAt(0)?.toUpperCase() || 'A'

  return (
    <nav className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-20">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, Admin!</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover border border-blue-100"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {userInitial}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <Link
                      href="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                    >
                      Account Settings
                    </Link>
                    <hr className="my-1" />
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                    >
                      Back to Website
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {showProfile && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfile(false)
          }}
        />
      )}
    </nav>
  )
}
