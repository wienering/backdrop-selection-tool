# Backdrop Selection Tool

A Next.js application for managing photo booth backdrops with drag-and-drop reordering functionality.

## Features

- **Admin Dashboard**: Manage backdrops, attendants, and submissions
- **Drag & Drop Reordering**: 
  - Reorder backdrops by dragging them around
  - Reorder images within each backdrop individually
  - Visual feedback during dragging operations
- **Image Management**: Upload and organize backdrop images
- **Attendant Management**: Assign backdrops to specific attendants
- **Submission Tracking**: Track client selections and submissions

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

1. Set up your database connection in `.env`
2. Run the database setup:
   ```bash
   npm run db:setup
   ```
3. If you have existing data, run the order migration:
   ```bash
   npm run db:migrate-order
   ```

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL database connection string
- `SMTP_HOST` - SMTP server host for sending emails
- `SMTP_PORT` - SMTP server port (typically 587 or 465)
- `SMTP_USER` - SMTP authentication username
- `SMTP_PASSWORD` - SMTP authentication password
- `SMTP_FROM` - Email address to send from
- `NEXT_PUBLIC_BASE_URL` - Base URL of the application
- `AGREEMENTS_API_URL` - (Optional) Base URL of the agreements app API for automatic backdrop selection recording. When set, backdrop selections will automatically update matching agreements.

Example `.env`:
```
DATABASE_URL="postgresql://..."
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user@example.com"
SMTP_PASSWORD="password"
SMTP_FROM="noreply@photoboothguys.ca"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
AGREEMENTS_API_URL="https://agreements-app.com"
```

## Drag and Drop Usage

### Reordering Backdrops
1. Navigate to Admin → Backdrops
2. Hover over any backdrop card to see the drag handle
3. Drag and drop to reorder backdrops
4. Order is automatically saved to the database

### Reordering Images
1. Within any backdrop card, hover over an image
2. Use the drag handle (⋮⋮) to reorder images
3. Order is automatically saved to the database

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.