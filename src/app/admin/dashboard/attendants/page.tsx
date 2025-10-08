'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'
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
  const [showForm, setShowForm] = useState(false)
  const [editingAttendant, setEditingAttendant] = useState<Attendant | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAttendants()
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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendants...</p>
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
      <div className="min-h-screen bg-[#FAFAF8]">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Attendants</h1>
              <p className="mt-2 text-gray-600">Add, edit, and manage photo booth attendants</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Add New Attendant
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingAttendant ? 'Edit Attendant' : 'Add New Attendant'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter attendant name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : (editingAttendant ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Attendants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Backdrops
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendants.map((attendant) => (
                  <tr key={attendant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {attendant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendant.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendant._count.backdrops}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendant._count.submissions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(attendant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const selectionUrl = `${window.location.origin}/select/${attendant.id}`;
                            navigator.clipboard.writeText(selectionUrl).then(() => {
                              alert('Selection link copied to clipboard!');
                            }).catch(() => {
                              // Fallback for older browsers
                              const textArea = document.createElement('textarea');
                              textArea.value = selectionUrl;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand('copy');
                              document.body.removeChild(textArea);
                              alert('Selection link copied to clipboard!');
                            });
                          }}
                          className="text-green-600 hover:text-green-900 font-medium"
                          title="Copy selection link"
                        >
                          Copy Link
                        </button>
                        <button
                          onClick={() => handleEdit(attendant)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(attendant.id)}
                          className="text-red-600 hover:text-red-900"
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
              <div className="text-center py-8 text-gray-500">
                No attendants found. Add your first attendant to get started.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/admin/dashboard"
            className="text-blue-600 hover:text-blue-500"
          >
            ← Back to Dashboard
          </Link>
        </div>
        </div>
      </div>
    </>
  )
}
