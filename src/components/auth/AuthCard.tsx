'use client'

import { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-48 h-24 rounded-2xl mb-4 shadow-lg overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Airbnb Clone Logo" 
              className="w-full h-full object-contain rounded-2xl"
              style={{
                imageRendering: '-webkit-optimize-contrast',
                filter: 'contrast(1.1) saturate(1.1)'
              }}
            />
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            © 2025 Airbnb Clone. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
