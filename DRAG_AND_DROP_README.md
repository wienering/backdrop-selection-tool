# Drag and Drop Functionality

This document describes the drag-and-drop functionality implemented for reordering backdrops and images in the admin interface.

## Features

### Backdrop Reordering
- Admins can drag and drop backdrop cards to reorder them
- The order is persisted to the database
- Visual feedback during dragging (opacity change)
- Drag handle (hamburger menu icon) appears on hover

### Image Reordering
- Within each backdrop, admins can drag and drop individual images
- Images are reordered within their parent backdrop
- Visual feedback during dragging
- Drag handle (⋮⋮ icon) appears on hover in the top-left corner
- Delete button (×) remains in the top-right corner

## Technical Implementation

### Database Changes
- Added `order` field to `Backdrop` model (Int, default 0)
- Added `order` field to `BackdropImage` model (Int, default 0)
- Both fields are used for sorting in ascending order

### API Endpoints
- `PUT /api/backdrops/reorder` - Reorder backdrops
- `PUT /api/backdrops/[id]/images/reorder` - Reorder images within a backdrop

### Frontend Libraries
- `@dnd-kit/core` - Core drag and drop functionality
- `@dnd-kit/sortable` - Sortable list components
- `@dnd-kit/utilities` - Utility functions for transforms

### Components
- `SortableBackdropItem` - Individual backdrop card with drag functionality
- `SortableImageItem` - Individual image with drag functionality
- Both components use `useSortable` hook for drag behavior

## Setup Instructions

1. **Database Migration**: Run the migration to add order fields to existing records:
   ```bash
   npm run db:migrate-order
   ```

2. **Database Schema**: The Prisma schema has been updated with order fields. If you need to create a new migration:
   ```bash
   npx prisma migrate dev --name add_order_fields
   ```

3. **Dependencies**: The required drag-and-drop libraries are already installed:
   ```bash
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

## Usage

### For Backdrops
1. Navigate to the admin backdrops page
2. Hover over any backdrop card to see the drag handle (hamburger menu icon)
3. Click and drag the handle to reorder backdrops
4. The new order is automatically saved to the database

### For Images
1. Within any backdrop card, hover over an image to see the drag handle (⋮⋮ icon)
2. Click and drag the handle to reorder images within that backdrop
3. The new order is automatically saved to the database

## Error Handling

- If a reorder operation fails, an error message is displayed
- The page automatically refreshes to restore the correct order
- All operations include proper error logging

## Future Enhancements

- Add visual indicators for drop zones
- Implement keyboard navigation for accessibility
- Add animation effects for smoother transitions
- Consider adding bulk reorder operations
