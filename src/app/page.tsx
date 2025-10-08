'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [attendantId, setAttendantId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (attendantId.trim()) {
      window.location.href = `/select/${attendantId.trim()}`
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Backdrop
            </h1>
            <p className="text-xl text-gray-600">
              Select the ideal backdrop for your photo booth experience
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 mb-6 text-center">
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
                  className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Enter your code"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View Backdrops
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Your selection code was provided by your photo booth attendant</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}