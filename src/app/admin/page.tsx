'use client'

import { useState } from 'react'
import Head from 'next/head'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Check your email for the magic link!')
      } else {
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login - Photo Booth Backdrop Tool</title>
        <meta name="description" content="Admin login for photo booth backdrop management" />
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
        <nav className="bg-[#adadad] backdrop-blur-sm border-b border-gray-400/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-white">Photobooth Guys Backdrops</h1>
                </div>
                <div className="hidden md:ml-10 md:flex md:space-x-8">
                  <a href="https://www.photoboothguys.ca/" className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors">Services</a>
                  <a href="https://www.photoboothguys.ca/photo-booth-prices/" className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors">Photo Booth Prices</a>
                  <a href="https://www.photoboothguys.ca/book-now/" className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors">Book Now</a>
                  <a href="https://www.photoboothguys.ca/photobooth-questions/" className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors">FAQ</a>
                  <a href="https://www.photoboothguys.ca/blog/" className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors">Blog</a>
                </div>
              </div>
              <div className="flex items-center">
                <a 
                  href="/" 
                  className="text-white border border-[#F5A623] bg-transparent hover:bg-[#F5A623]/10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-128px)] py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Welcome Message */}
            <h2 className="text-center text-4xl font-bold text-white mb-8">
              Welcome, Back!
            </h2>

            {/* Login Form Card */}
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <p className="text-gray-600 text-sm mb-6 text-center">
                Enter your email to receive a magic link
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] sm:text-sm"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#F5A623] hover:bg-[#e0941a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5A623] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Sending...' : 'Send Magic Link'}
                  </button>
                </div>

                {message && (
                  <div className={`text-center text-sm ${
                    message.includes('Check your email') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="text-center">
                  <a
                    href="/"
                    className="text-[#adadad] hover:text-[#8a8a8a] text-sm transition-colors"
                  >
                    Back to Home
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}