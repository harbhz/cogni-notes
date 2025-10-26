/**
 * Utility functions for consistent date formatting across the application
 * to prevent hydration mismatches between server and client rendering
 */

/**
 * Format a date consistently using US locale format
 * This prevents hydration issues by ensuring server and client render the same format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit', 
    year: 'numeric'
  }).format(date);
}

/**
 * Format a date with time for detailed timestamps
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}