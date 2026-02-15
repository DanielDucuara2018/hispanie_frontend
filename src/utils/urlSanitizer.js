/**
 * Sanitizes a URL to prevent XSS attacks by ensuring only safe protocols are allowed
 * Uses the browser's native URL parser for robust validation
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL or '#' if the URL is unsafe
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return '#';
  }

  try {
    // Try to parse as absolute URL first
    const parsed = new URL(trimmedUrl);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.warn('Blocked potentially dangerous URL:', trimmedUrl);
      return '#';
    }
    
    return parsed.href;
  } catch {
    // If parsing as absolute URL fails, try as relative URL
    try {
      // For relative URLs, we need a base URL
      // In browser context, we can use window.location.href
      // For SSR or testing, we'll use a dummy base
      const base = typeof window !== 'undefined' ? window.location.href : 'https://example.com';
      const parsed = new URL(trimmedUrl, base);
      
      // Only allow http and https protocols for resolved URLs
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        console.warn('Blocked potentially dangerous URL:', trimmedUrl);
        return '#';
      }
      
      return parsed.href;
    } catch {
      // If both absolute and relative parsing fail, treat as unsafe
      console.warn('Invalid URL format:', trimmedUrl);
      return '#';
    }
  }
};
