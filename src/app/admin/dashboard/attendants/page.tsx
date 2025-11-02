'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'
import DashboardSidebar from '@/components/DashboardSidebar'
import Head from 'next/head'

interface Attendant {
  id: string
  name: string
  email: string
  createdAt: string
  _count: {
    backdrops: number
    submissions: number
  }
}

export default function ManageAttendants() {
  const [attendants, setAttendants] = useState<Attendant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingAttendant, setEditingAttendant] = useState<Attendant | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [showCopyModal, setShowCopyModal] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
        if (data.authenticated) {
          fetchAttendants()
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const fetchAttendants = async () => {
    try {
      const response = await fetch('/api/attendants')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch attendants')
      }
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setAttendants(data)
      } else {
        console.error('Invalid data format:', data)
        setAttendants([])
        setMessage('Invalid data received from server')
      }
    } catch (error) {
      console.error('Error fetching attendants:', error)
      setMessage(error instanceof Error ? error.message : 'Error loading attendants')
      setAttendants([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const url = editingAttendant 
        ? `/api/attendants/${editingAttendant.id}`
        : '/api/attendants'
      
      const method = editingAttendant ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(editingAttendant ? 'Attendant updated successfully!' : 'Attendant created successfully!')
        setFormData({ name: '', email: '' })
        setEditingAttendant(null)
        setShowForm(false)
        fetchAttendants()
      } else {
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (attendant: Attendant) => {
    setEditingAttendant(attendant)
    setFormData({ name: attendant.name, email: attendant.email })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendant? This will also delete all their backdrops and submissions.')) {
      return
    }

    try {
      const response = await fetch(`/api/attendants/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage('Attendant deleted successfully!')
        fetchAttendants()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Failed to delete attendant')
      }
    } catch (error) {
      setMessage('Failed to delete attendant')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '' })
    setEditingAttendant(null)
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F5A623] mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a1a1f] flex items-center justify-center">
        <AdminNav />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-100 mb-4">Please log in to access the admin dashboard.</p>
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#F5A623] hover:bg-[#e0941a]"
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
        <title>Manage Attendants - Photo Booth Backdrop Tool</title>
        <meta name="description" content="Add, edit, and manage photo booth attendants" />
      </Head>
      <div className="min-h-screen bg-[#1a1a1f] flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <AdminNav />
          <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Manage Attendants</h1>
              <p className="mt-2 text-gray-400">Add, edit, and manage photo booth attendants</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#F5A623] hover:bg-[#e0941a] text-white px-4 py-2 rounded-md font-medium"
            >
              Add New Attendant
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-900/30 text-green-400 border border-green-700' 
              : 'bg-red-900/30 text-red-400 border border-red-700'
          }`}>
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-[#24242A] rounded-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingAttendant ? 'Edit Attendant' : 'Add New Attendant'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter attendant name"
                  className="w-full px-3 py-2 bg-[#1a1a1f] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] text-white placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 bg-[#1a1a1f] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] text-white placeholder-gray-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#F5A623] hover:bg-[#e0941a] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : (editingAttendant ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-[#3a3a3f] hover:bg-[#4a4a4f] text-gray-300 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#24242A] rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">All Attendants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#2a2a2f]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Backdrops
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Submissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#24242A] divide-y divide-gray-700">
                {attendants.map((attendant) => (
                  <tr key={attendant.id} className="hover:bg-[#2a2a2f]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {attendant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {attendant.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {attendant._count.backdrops}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {attendant._count.submissions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(attendant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const selectionUrl = `${window.location.origin}/select/${attendant.id}`;
                            navigator.clipboard.writeText(selectionUrl).then(() => {
                              setShowCopyModal(true);
                              setTimeout(() => setShowCopyModal(false), 2000);
                            }).catch(() => {
                              // Fallback for older browsers
                              const textArea = document.createElement('textarea');
                              textArea.value = selectionUrl;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand('copy');
                              document.body.removeChild(textArea);
                              setShowCopyModal(true);
                              setTimeout(() => setShowCopyModal(false), 2000);
                            });
                          }}
                          className="text-green-400 hover:text-green-300 font-medium"
                          title="Copy selection link"
                        >
                          Copy Link
                        </button>
                        <button
                          onClick={() => handleEdit(attendant)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(attendant.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attendants.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No attendants found. Add your first attendant to get started.
              </div>
            )}
          </div>
        </div>

          </div>
        </div>
      </div>

      {/* Copy Success Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#24242A] border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  Selection link copied to clipboard!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
