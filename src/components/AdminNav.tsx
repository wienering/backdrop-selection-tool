'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/dashboard/attendants', label: 'Attendants', icon: '👥' },
    { href: '/admin/dashboard/backdrops', label: 'Backdrops', icon: '🖼️' },
    { href: '/admin/dashboard/submissions', label: 'Submissions', icon: '📋' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900">
                Photobooth Guys Backdrops
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="hidden sm:block text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              View Site
            </Link>
            <button
              onClick={async () => {
                await fetch('/api/auth/session', { method: 'DELETE' })
                window.location.href = '/admin'
              }}
              className="hidden sm:block text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden text-gray-500 hover:text-gray-700 p-2 rounded-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname === item.href
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <Link
                  href="/"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View Site
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/session', { method: 'DELETE' })
                    window.location.href = '/admin'
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
