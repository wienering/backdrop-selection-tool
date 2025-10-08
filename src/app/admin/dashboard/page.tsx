'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'
import Head from 'next/head'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to access the admin dashboard.</p>
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Photo Booth Backdrop Tool</title>
        <meta name="description" content="Manage photo booth attendants, backdrops, and client submissions" />
      </Head>
      <div className="min-h-screen bg-[#FAFAF8]">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your photo booth backdrop selection tool</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/dashboard/attendants"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Attendants</h3>
                <p className="text-sm text-gray-500">Add, edit, and manage photo booth attendants</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/backdrops"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Backdrops</h3>
                <p className="text-sm text-gray-500">Upload and organize backdrop photos</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/submissions"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">View Submissions</h3>
                <p className="text-sm text-gray-500">See client backdrop selections</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-500"
          >
            Back to Home
          </Link>
        </div>
        </div>
      </div>
    </>
  )
}