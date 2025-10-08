import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`

    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      // In production, always try Vercel Blob first
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const blob = await put(filename, file, {
            access: 'public',
          })

          return NextResponse.json({ 
            success: true, 
            fileUrl: blob.url,
            filename: filename
          })
        } catch (blobError) {
          console.error('Vercel Blob upload failed:', blobError)
          // Fall through to error response
        }
      }
      
      // If we get here, Blob storage isn't available
      return NextResponse.json(
        { error: 'File upload not configured. Please set up Vercel Blob storage.' },
        { status: 500 }
      )
    } else {
      // Development: use local filesystem
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const filepath = join(uploadsDir, filename)
      await writeFile(filepath, buffer)

      const fileUrl = `/uploads/${filename}`

      return NextResponse.json({ 
        success: true, 
        fileUrl,
        filename 
      })
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
