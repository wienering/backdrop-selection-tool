'use client'

import { useState, useEffect } from 'react'

export default function TestCookiePage() {
  const [cookies, setCookies] = useState('')
  const [sessionCookie, setSessionCookie] = useState('')

  useEffect(() => {
    setCookies(document.cookie)
    const found = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin-session='))
    setSessionCookie(found || 'Not found')
  }, [])

  const setTestCookie = () => {
    document.cookie = 'admin-session=test-cookie-value; path=/; max-age=3600'
    setCookies(document.cookie)
    const found = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin-session='))
    setSessionCookie(found || 'Not found')
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cookie Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">All Cookies:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {cookies || 'No cookies found'}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Admin Session Cookie:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {sessionCookie}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={setTestCookie}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Set Test Cookie
          </button>
        </div>
      </div>
    </div>
  )
}