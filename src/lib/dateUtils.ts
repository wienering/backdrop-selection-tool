/**
 * Utility functions for handling dates consistently across the application
 */

/**
 * Formats a date string for display, ensuring consistent timezone handling
 * @param dateString - The date string from the database
 * @returns Formatted date string for display
 */
export function formatEventDate(dateString: string): string {
  // If the date string doesn't include time, add midnight to avoid timezone issues
  const date = dateString.includes('T') ? new Date(dateString) : new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * Formats a date for email display with full date information
 * @param dateString - The date string from the database
 * @returns Formatted date string for emails
 */
export function formatEventDateForEmail(dateString: string): string {
  const date = dateString.includes('T') ? new Date(dateString) : new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Ensures a date string is stored consistently in the database
 * @param dateString - The date string from the form (YYYY-MM-DD format)
 * @returns Date object that will be stored consistently
 */
export function normalizeEventDate(dateString: string): Date {
  // Ensure the date is treated as local time, not UTC
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month is 0-indexed in Date constructor
}
