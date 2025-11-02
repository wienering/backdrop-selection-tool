'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminNav from '@/components/AdminNav'
import Head from 'next/head'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Attendant {
  id: string
  name: string
  email: string
}

interface BackdropImage {
  id: string
  imageUrl: string
  createdAt: string
}

interface BackdropAttendant {
  id: string
  attendantId: string
  attendant: Attendant
}

interface Backdrop {
  id: string
  name: string
  description: string | null
  thumbnailUrl: string
  publicStatus: boolean
  createdAt: string
  attendants: BackdropAttendant[]
  images: BackdropImage[]
  _count: {
    submissions: number
  }
}

// Sortable Image Item Component
function SortableImageItem({ image, onImageModalOpen, onDeleteImage }: {
  image: BackdropImage
  onImageModalOpen: (imageUrl: string) => void
  onDeleteImage: (imageId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group cursor-pointer"
      onClick={() => onImageModalOpen(image.imageUrl)}
    >
      <img
        src={image.imageUrl}
        alt="Backdrop image"
        className="w-full h-16 object-cover rounded hover:opacity-80 transition-opacity"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="w-full h-16 bg-gray-200 rounded flex items-center justify-center">
                <span class="text-xs text-gray-500">Broken</span>
              </div>
            `;
          }
        }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteImage(image.id);
        }}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-gray-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        ⋮⋮
      </div>
    </div>
  )
}

// Sortable Backdrop Item Component
function SortableBackdropItem({ backdrop, onEdit, onDelete, onImageModalOpen, onDeleteImage, onReorderImages }: {
  backdrop: Backdrop
  onEdit: (backdrop: Backdrop) => void
  onDelete: (id: string) => void
  onImageModalOpen: (imageUrl: string) => void
  onDeleteImage: (backdropId: string, imageId: string) => void
  onReorderImages: (backdropId: string, imageIds: string[]) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: backdrop.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="w-full h-48 bg-gray-100 overflow-hidden relative">
        {backdrop.thumbnailUrl ? (
          <>
            <img
              src={backdrop.thumbnailUrl}
              alt={backdrop.name}
              className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onImageModalOpen(backdrop.thumbnailUrl)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div class="text-center text-gray-500">
                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-sm">Thumbnail failed to load</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </>
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No thumbnail</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{backdrop.name}</h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              backdrop.publicStatus 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {backdrop.publicStatus ? 'Public' : 'Private'}
            </span>
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-100 mb-2">
          Active for: {backdrop.attendants.map(ba => ba.attendant.name).join(', ')}
        </p>
        {backdrop.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {backdrop.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{backdrop.images.length} images</span>
          <span>{backdrop._count.submissions} selections</span>
        </div>
        
        {backdrop.images.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Images:</h4>
            <DndContext
              sensors={useSensors(useSensor(PointerSensor))}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event
                if (over && active.id !== over.id) {
                  const oldIndex = backdrop.images.findIndex((image) => image.id === active.id)
                  const newIndex = backdrop.images.findIndex((image) => image.id === over.id)
                  const newImages = arrayMove(backdrop.images, oldIndex, newIndex)
                  const imageIds = newImages.map(image => image.id)
                  onReorderImages(backdrop.id, imageIds)
                }
              }}
            >
              <SortableContext
                items={backdrop.images.map(image => image.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-3 gap-2">
                  {backdrop.images.map((image) => (
                    <SortableImageItem
                      key={image.id}
                      image={image}
                      onImageModalOpen={onImageModalOpen}
                      onDeleteImage={(imageId) => onDeleteImage(backdrop.id, imageId)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(backdrop)}
            className="flex-1 bg-[#F5A623] hover:bg-[#e0941a] text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(backdrop.id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ManageBackdrops() {
  const [backdrops, setBackdrops] = useState<Backdrop[]>([])
  const [attendants, setAttendants] = useState<Attendant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingBackdrop, setEditingBackdrop] = useState<Backdrop | null>(null)
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    attendantIds: [] as string[], 
    publicStatus: true,
    thumbnailUrl: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
        if (data.authenticated) {
          fetchData()
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

  const fetchData = async () => {
    try {
      const [backdropsRes, attendantsRes] = await Promise.all([
        fetch('/api/backdrops'),
        fetch('/api/attendants')
      ])
      
      const [backdropsData, attendantsData] = await Promise.all([
        backdropsRes.json(),
        attendantsRes.json()
      ])
      
      // Check for errors in responses
      if (!backdropsRes.ok) {
        throw new Error(backdropsData.error || 'Failed to fetch backdrops')
      }
      if (!attendantsRes.ok) {
        throw new Error(attendantsData.error || 'Failed to fetch attendants')
      }
      
      // Ensure data is arrays
      setBackdrops(Array.isArray(backdropsData) ? backdropsData : [])
      setAttendants(Array.isArray(attendantsData) ? attendantsData : [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage(error instanceof Error ? error.message : 'Error loading data')
      setBackdrops([])
      setAttendants([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (response.ok) {
        return data.fileUrl
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    // Validate that at least one attendant is selected
    if (formData.attendantIds.length === 0) {
      setMessage('Please select at least one attendant')
      setIsSubmitting(false)
      return
    }

    try {
      let thumbnailUrl = formData.thumbnailUrl || ''

      // Upload thumbnail if provided
      if (thumbnailFile) {
        thumbnailUrl = await handleFileUpload(thumbnailFile)
      }

      const url = editingBackdrop 
        ? `/api/backdrops/${editingBackdrop.id}`
        : '/api/backdrops'
      
      const method = editingBackdrop ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          thumbnailUrl: thumbnailUrl || editingBackdrop?.thumbnailUrl || ''
        })
      })

      const data = await response.json()

      if (response.ok) {
        const backdropId = editingBackdrop ? editingBackdrop.id : data.id

        // Upload additional images if provided
        if (selectedFiles.length > 0) {
          for (const file of selectedFiles) {
            try {
              const imageUrl = await handleFileUpload(file)
              await fetch(`/api/backdrops/${backdropId}/images`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl })
              })
              
              // If no thumbnail was set, use the first uploaded image as thumbnail
              if (!thumbnailUrl && !editingBackdrop?.thumbnailUrl) {
                await fetch(`/api/backdrops/${backdropId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ thumbnailUrl: imageUrl })
                })
                thumbnailUrl = imageUrl
              }
            } catch (error) {
              console.error('Error uploading image:', error)
            }
          }
        }

        setMessage(editingBackdrop ? 'Backdrop updated successfully!' : 'Backdrop created successfully!')
        resetForm()
        fetchData()
      } else {
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (backdrop: Backdrop) => {
    setEditingBackdrop(backdrop)
    setFormData({ 
      name: backdrop.name, 
      description: backdrop.description || '', 
      attendantIds: backdrop.attendants.map(ba => ba.attendantId),
      publicStatus: backdrop.publicStatus,
      thumbnailUrl: backdrop.thumbnailUrl
    })
    setShowForm(true)
  }

  const handleAttendantToggle = (attendantId: string) => {
    setFormData(prev => ({
      ...prev,
      attendantIds: prev.attendantIds.includes(attendantId)
        ? prev.attendantIds.filter(id => id !== attendantId)
        : [...prev.attendantIds, attendantId]
    }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this backdrop? This will also delete all its images and submissions.')) {
      return
    }

    try {
      const response = await fetch(`/api/backdrops/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage('Backdrop deleted successfully!')
        fetchData()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Failed to delete backdrop')
      }
    } catch (error) {
      setMessage('Failed to delete backdrop')
    }
  }

  const handleDeleteImage = async (backdropId: string, imageId: string) => {
    try {
      const response = await fetch(`/api/backdrops/${backdropId}/images?imageId=${imageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage('Image deleted successfully!')
        fetchData()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Failed to delete image')
      }
    } catch (error) {
      setMessage('Failed to delete image')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', attendantIds: [], publicStatus: true, thumbnailUrl: '' })
    setEditingBackdrop(null)
    setShowForm(false)
    setSelectedFiles([])
    setThumbnailFile(null)
  }

  const openImageModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl)
  }

  const closeImageModal = () => {
    setModalImageUrl(null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = backdrops.findIndex((backdrop) => backdrop.id === active.id)
      const newIndex = backdrops.findIndex((backdrop) => backdrop.id === over.id)

      const newBackdrops = arrayMove(backdrops, oldIndex, newIndex)
      setBackdrops(newBackdrops)

      // Update the order in the database
      try {
        const backdropIds = newBackdrops.map(backdrop => backdrop.id)
        await fetch('/api/backdrops/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ backdropIds })
        })
      } catch (error) {
        console.error('Error reordering backdrops:', error)
        setMessage('Failed to save backdrop order. Please refresh the page.')
        // Revert the local state
        fetchData()
      }
    }
  }

  const handleReorderImages = async (backdropId: string, imageIds: string[]) => {
    try {
      await fetch(`/api/backdrops/${backdropId}/images/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds })
      })
      
      // Update local state
      setBackdrops(prevBackdrops => 
        prevBackdrops.map(backdrop => 
          backdrop.id === backdropId 
            ? {
                ...backdrop,
                images: imageIds.map(id => 
                  backdrop.images.find(img => img.id === id)!
                )
              }
            : backdrop
        )
      )
    } catch (error) {
      console.error('Error reordering images:', error)
      setMessage('Failed to save image order. Please refresh the page.')
      fetchData()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#adadad] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F5A623] mx-auto"></div>
          <p className="mt-4 text-gray-100">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#adadad] flex items-center justify-center">
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
        <title>Manage Backdrops - Photo Booth Backdrop Tool</title>
        <meta name="description" content="Upload and organize backdrop photos for photo booth" />
      </Head>
      <div className="min-h-screen bg-[#adadad]">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Backdrops</h1>
              <p className="mt-2 text-gray-100">Upload and organize backdrop photos</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#F5A623] hover:bg-[#e0941a] text-white px-4 py-2 rounded-md font-medium"
            >
              Add New Backdrop
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
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingBackdrop ? 'Edit Backdrop' : 'Add New Backdrop'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter backdrop name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Activate for Attendants *
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {attendants.map((attendant) => (
                      <label key={attendant.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.attendantIds.includes(attendant.id)}
                          onChange={() => handleAttendantToggle(attendant.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-900">
                          {attendant.name} ({attendant.email})
                        </span>
                      </label>
                    ))}
                  </div>
                  {formData.attendantIds.length === 0 && (
                    <p className="text-red-500 text-xs mt-1">Please select at least one attendant</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Enter backdrop description (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-white mb-2">
                  Thumbnail Image {!editingBackdrop && '*'}
                </label>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required={!editingBackdrop}
                />
                {editingBackdrop && (
                  <p className="mt-1 text-sm text-gray-100">
                    Leave empty to keep current thumbnail
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="images" className="block text-sm font-medium text-white mb-2">
                  Additional Images
                </label>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
                <p className="mt-1 text-sm text-gray-100">
                  Select multiple images to add to this backdrop
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="publicStatus"
                  checked={formData.publicStatus}
                  onChange={(e) => setFormData({ ...formData, publicStatus: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="publicStatus" className="ml-2 block text-sm text-gray-900">
                  Make this backdrop public (visible to clients)
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#F5A623] hover:bg-[#e0941a] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : (editingBackdrop ? 'Update' : 'Create')}
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={backdrops.map(backdrop => backdrop.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {backdrops.map((backdrop) => (
                <SortableBackdropItem
                  key={backdrop.id}
                  backdrop={backdrop}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onImageModalOpen={openImageModal}
                  onDeleteImage={handleDeleteImage}
                  onReorderImages={handleReorderImages}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {backdrops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No backdrops found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first backdrop.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#F5A623] hover:bg-[#e0941a] text-white px-4 py-2 rounded-md font-medium"
            >
              Add First Backdrop
            </button>
          </div>
        )}

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
              alt="Full size image"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}
