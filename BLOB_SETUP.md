# Vercel Blob Storage Setup

To enable file uploads in production, you need to set up Vercel Blob storage:

## 1. Add Environment Variable

In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add a new variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Get this from your Vercel dashboard under Storage → Blob
   - **Environment**: All Environments

## 2. Enable Blob Storage

1. Go to your Vercel project dashboard
2. Navigate to the Storage tab
3. Click "Create Database" and select "Blob"
4. This will automatically generate the `BLOB_READ_WRITE_TOKEN`

## 3. Redeploy

After adding the environment variable, redeploy your project for the changes to take effect.

## Development

For local development, the upload will work with the local filesystem fallback.
