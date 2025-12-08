/**
 * Sanitizes a URL to prevent XSS attacks by ensuring only safe protocols are allowed
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL or '#' if the URL is unsafe
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  const trimmedUrl = url.trim();
  
  // Check for dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
  if (dangerousProtocols.test(trimmedUrl)) {
    console.warn('Blocked potentially dangerous URL:', trimmedUrl);
    return '#';
  }

  // Allow relative URLs, http, and https
  const safeProtocols = /^(https?:\/\/|\/|\.\/|\.\.\/)/i;
  if (!safeProtocols.test(trimmedUrl)) {
    // If no protocol is specified, assume https
    return `https://${trimmedUrl}`;
  }

  return trimmedUrl;
};
