'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PageHeader({ showAdminLogin = false }: { showAdminLogin?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Top Bar with Contact Info */}
      <div className="bg-[#9a9a9a] text-white text-xs sm:text-sm py-2 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="mailto:info@photoboothguys.ca" className="flex items-center space-x-2 hover:text-gray-200 transition-colors">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">info@photoboothguys.ca</span>
            </a>
            <a href="tel:+16473785332" className="flex items-center space-x-2 hover:text-gray-200 transition-colors">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0">
                <h1 className="text-lg sm:text-xl font-bold text-white">Photobooth Guys Backdrops</h1>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="https://www.photoboothguys.ca/" className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors">Services</a>
                <a href="https://www.photoboothguys.ca/photo-booth-prices/" className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors">Photo Booth Prices</a>
                <a href="https://www.photoboothguys.ca/book-now/" className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors">Book Now</a>
                <a href="https://www.photoboothguys.ca/photobooth-questions/" className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors">FAQ</a>
                <a href="https://www.photoboothguys.ca/blog/" className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors">Blog</a>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {showAdminLogin ? (
                <Link 
                  href="/admin" 
                  className="hidden sm:inline-block text-white border border-[#F5A623] bg-transparent hover:bg-[#F5A623]/10 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
                >
                  Admin Login
                </Link>
              ) : (
                <Link 
                  href="/" 
                  className="hidden sm:inline-block text-white border border-[#F5A623] bg-transparent hover:bg-[#F5A623]/10 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
                >
                  Home
                </Link>
              )}
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!mobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#9a9a9a]">
              <a href="https://www.photoboothguys.ca/" className="text-white hover:text-gray-200 block px-3 py-2 text-base font-medium">Services</a>
              <a href="https://www.photoboothguys.ca/photo-booth-prices/" className="text-white hover:text-gray-200 block px-3 py-2 text-base font-medium">Photo Booth Prices</a>
              <a href="https://www.photoboothguys.ca/book-now/" className="text-white hover:text-gray-200 block px-3 py-2 text-base font-medium">Book Now</a>
              <a href="https://www.photoboothguys.ca/photobooth-questions/" className="text-white hover:text-gray-200 block px-3 py-2 text-base font-medium">FAQ</a>
              <a href="https://www.photoboothguys.ca/blog/" className="text-white hover:text-gray-200 block px-3 py-2 text-base font-medium">Blog</a>
              {showAdminLogin ? (
                <Link 
                  href="/admin" 
                  className="text-white border border-[#F5A623] bg-transparent hover:bg-[#F5A623]/10 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Admin Login
                </Link>
              ) : (
                <Link 
                  href="/" 
                  className="text-white border border-[#F5A623] bg-transparent hover:bg-[#F5A623]/10 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Home
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

