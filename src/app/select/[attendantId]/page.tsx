'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'

interface BackdropImage {
  id: string
  imageUrl: string
}

interface Backdrop {
  id: string
  name: string
  description: string | null
  thumbnailUrl: string
  publicStatus: boolean
  attendantId: string
  images: BackdropImage[]
}

interface Attendant {
  id: string
  name: string
  email: string
}

export default function SelectBackdrop({ params }: { params: Promise<{ attendantId: string }> }) {
  const [backdrops, setBackdrops] = useState<Backdrop[]>([])
  const [attendant, setAttendant] = useState<Attendant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBackdrop, setSelectedBackdrop] = useState<Backdrop | null>(null)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    eventDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)
  const [modalImages, setModalImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      const { attendantId } = await params
      fetchData(attendantId)
    }
    loadData()
  }, [params])

  const fetchData = async (attendantId: string) => {
    try {
      const [backdropsRes, attendantRes] = await Promise.all([
        fetch(`/api/backdrops?attendantId=${attendantId}`),
        fetch(`/api/attendants/${attendantId}`)
      ])

      if (!attendantRes.ok) {
        throw new Error('Attendant not found')
      }

      const [backdropsData, attendantData] = await Promise.all([
        backdropsRes.json(),
        attendantRes.json()
      ])

      setBackdrops(backdropsData.filter((backdrop: Backdrop) => backdrop.publicStatus))
      setAttendant(attendantData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage('Invalid selection code. Please check with your photo booth attendant.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackdropSelect = (backdrop: Backdrop) => {
    setSelectedBackdrop(backdrop)
    setShowSubmissionForm(true)
  }

  const openImageModal = (backdrop: Backdrop) => {
    const allImages = [backdrop.thumbnailUrl, ...backdrop.images.map(img => img.imageUrl)]
    setModalImages(allImages)
    setCurrentImageIndex(0)
    setModalImageUrl(allImages[0])
  }

  const closeImageModal = () => {
    setModalImageUrl(null)
    setModalImages([])
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (currentImageIndex < modalImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
      setModalImageUrl(modalImages[currentImageIndex + 1])
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
      setModalImageUrl(modalImages[currentImageIndex - 1])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          backdropId: selectedBackdrop?.id,
          attendantId: (await params).attendantId
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Thank you! Your backdrop selection has been submitted successfully.')
        setShowSubmissionForm(false)
        setFormData({ clientName: '', clientEmail: '', eventDate: '' })
        setSelectedBackdrop(null)
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading backdrops...</p>
        </div>
      </div>
    )
  }

  if (!attendant) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Selection Code</h1>
          <p className="text-gray-600 mb-4">The code you entered is not valid. Please check with your photo booth attendant.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Select Your Backdrop - Photo Booth</title>
        <meta name="description" content="Choose your perfect backdrop for your photo booth experience" />
      </Head>
      <div className="min-h-screen bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Backdrop
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Select the ideal backdrop for your photo booth experience
          </p>
          <p className="text-sm text-gray-500">
            Attendant: {attendant.name}
          </p>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-md text-center ${
            message.includes('Thank you') || message.includes('successfully')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {showSubmissionForm && selectedBackdrop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Your Selection</h2>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Selected Backdrop:</h3>
                <div className="flex items-center space-x-4">
                  <Image
                    src={selectedBackdrop.thumbnailUrl}
                    alt={selectedBackdrop.name}
                    width={80}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{selectedBackdrop.name}</p>
                    {selectedBackdrop.description && (
                      <p className="text-sm text-gray-600">{selectedBackdrop.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="clientEmail"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Selection'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubmissionForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {backdrops.map((backdrop) => (
            <div key={backdrop.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 relative">
                <Image
                  src={backdrop.thumbnailUrl}
                  alt={backdrop.name}
                  width={400}
                  height={225}
                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openImageModal(backdrop)}
                />
                {backdrop.images.length > 0 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    +{backdrop.images.length} more
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{backdrop.name}</h3>
                {backdrop.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{backdrop.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {backdrop.images.length + 1} image{(backdrop.images.length + 1) !== 1 ? 's' : ''}
                  </span>
                  <div className="flex space-x-2">
                    {backdrop.images.length > 0 && (
                      <button
                        onClick={() => openImageModal(backdrop)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        View Images
                      </button>
                    )}
                    <button
                      onClick={() => handleBackdropSelect(backdrop)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Select This Backdrop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {backdrops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No backdrops available</h3>
            <p className="text-gray-500">Please check with your photo booth attendant.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-500"
          >
            ← Back to Home
          </Link>
        </div>
        </div>
      </div>

      {/* Image Modal */}
      {modalImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImageModal}>
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 z-10"
            >
              ×
            </button>
            
            <img
              src={modalImageUrl}
              alt="Backdrop image"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {modalImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl font-bold hover:text-gray-300 z-10"
                  disabled={currentImageIndex === 0}
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl font-bold hover:text-gray-300 z-10"
                  disabled={currentImageIndex === modalImages.length - 1}
                >
                  ›
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                  {currentImageIndex + 1} of {modalImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
