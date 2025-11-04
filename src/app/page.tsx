'use client'

import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  const [attendantId, setAttendantId] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (attendantId.trim()) {
      window.location.href = `/select/${attendantId.trim()}`
    }
  }

  return (
    <>
      <Head>
        <title>Photo Booth Backdrop Selection Tool</title>
        <meta name="description" content="Choose your perfect backdrop for your photo booth experience" />
      </Head>
      <div className="min-h-screen bg-[#adadad] relative overflow-hidden">
        {/* Photo Booth Background Illustrations */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="absolute top-20 left-10 w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="30" width="60" height="50" stroke="white" strokeWidth="2" fill="none" rx="4"/>
            <rect x="25" y="35" width="50" height="40" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="50" cy="55" r="8" fill="white"/>
            <rect x="30" y="20" width="40" height="15" stroke="white" strokeWidth="2" fill="none" rx="2"/>
          </svg>
          <svg className="absolute bottom-32 right-20 w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="20" width="80" height="60" stroke="white" strokeWidth="2" fill="none" rx="6"/>
            <path d="M30 30 L50 50 L70 30" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="50" r="12" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="50" r="4" fill="white"/>
          </svg>
          <svg className="absolute top-40 right-32 w-20 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="10" width="70" height="90" stroke="white" strokeWidth="2" fill="none" rx="4"/>
            <rect x="20" y="20" width="60" height="20" stroke="white" strokeWidth="1.5" fill="white" opacity="0.3"/>
            <rect x="20" y="45" width="60" height="20" stroke="white" strokeWidth="1.5" fill="white" opacity="0.3"/>
            <rect x="20" y="70" width="60" height="20" stroke="white" strokeWidth="1.5" fill="white" opacity="0.3"/>
          </svg>
          <svg className="absolute bottom-20 left-32 w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M50 30 L50 50 L65 50" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="4" fill="white"/>
          </svg>
          <svg className="absolute top-60 left-1/4 w-16 h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="35" y="15" width="30" height="50" stroke="white" strokeWidth="2" fill="none" rx="2"/>
            <path d="M45 25 L55 25 M45 35 L55 35 M45 45 L55 45" stroke="white" strokeWidth="2"/>
            <circle cx="50" cy="58" r="3" fill="white"/>
          </svg>
        </div>

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
                <Link 
                  href="/admin" 
                  className="hidden sm:inline-block text-white border border-[#F5A623] bg-transparent hover:bg-[#F5A623]/10 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
                >
                  Admin Login
                </Link>
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
                <Link 
                  href="/admin" 
                  className="text-white border border-[#F5A623] bg-transparent hover:bg-[#F5A623]/10 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content Area */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-128px)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-4">
                Choose Your Perfect Backdrop
              </h1>
              <p className="text-lg sm:text-xl text-gray-100 px-4">
                Select the ideal backdrop for your photo booth experience
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 mx-4 sm:mx-0">
              <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                Enter your unique selection code to view available backdrops
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Selection Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={attendantId}
                    onChange={(e) => setAttendantId(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] text-base sm:text-lg"
                    placeholder="Enter your code"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-base sm:text-lg font-medium rounded-md text-white bg-[#F5A623] hover:bg-[#e0941a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5A623] transition-colors"
                >
                  View Backdrops
                </button>
              </form>

              <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 px-2">
                <p>Your selection code was provided by your photo booth attendant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
