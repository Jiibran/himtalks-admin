import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSafeDate(dateString: string | number | Date | null | undefined): string {
  if (!dateString) return "Unknown time";
  
  try {
    // For ISO string format (from API)
    if (typeof dateString === 'string') {
      // Directly parse ISO strings which are well-formatted
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // For numeric timestamps
    if (typeof dateString === 'number') {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // For Date objects
    if (dateString instanceof Date) {
      if (isNaN(dateString.getTime())) {
        return "Invalid date";
      }
      return formatDistanceToNow(dateString, { addSuffix: true });
    }
    
    return "Unknown time";
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Unknown time";
  }
}

export function formatExactDate(dateString: string | number | Date | null | undefined): string {
  if (!dateString) return "Unknown date";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, "PPpp"); // Mar 4, 2025, 4:40 PM format
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Unknown date";
  }
}
