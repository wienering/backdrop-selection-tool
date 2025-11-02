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
    <>
      {/* Top Bar with Contact Info */}
      <div className="bg-[#9a9a9a] text-white text-sm py-2 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="mailto:info@photoboothguys.ca" className="flex items-center space-x-2 hover:text-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@photoboothguys.ca</span>
            </a>
            <a href="tel:+16473785332" className="flex items-center space-x-2 hover:text-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(647) 378-5332</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#adadad] backdrop-blur-sm border-b border-gray-400/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin/dashboard" className="text-xl font-bold text-white">
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
                        ? 'border-[#F5A623] text-white'
                        : 'border-transparent text-gray-100 hover:border-gray-300 hover:text-white'
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
                className="hidden sm:block text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                View Site
              </Link>
              <button
                onClick={async () => {
                  await fetch('/api/auth/session', { method: 'DELETE' })
                  window.location.href = '/admin'
                }}
                className="hidden sm:block text-white border border-[#F5A623] bg-transparent hover:bg-[#F5A623]/10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden text-white hover:text-gray-200 p-2 rounded-md"
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
                        ? 'bg-[#9a9a9a] border-[#F5A623] text-white'
                        : 'border-transparent text-gray-100 hover:bg-[#9a9a9a] hover:border-gray-300 hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-gray-400/30 pt-4">
                  <Link
                    href="/"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-100 hover:text-white hover:bg-[#9a9a9a]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View Site
                  </Link>
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/session', { method: 'DELETE' })
                      window.location.href = '/admin'
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-100 hover:text-white hover:bg-[#9a9a9a]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
