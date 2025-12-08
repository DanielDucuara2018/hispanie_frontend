/**
 * Cloudflare Worker to serve Hispanie React app from Google Cloud Storage
 * This proxies requests while keeping the custom domain in the browser
 * 
 * Environment Variables (set in Cloudflare Worker Settings):
 *   BUCKET_NAME - GCS bucket name (e.g., hispanie-frontend)
 * 
 * Deploy this worker in Cloudflare and set the route to match your frontend domain
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  let path = url.pathname
  
  // For root or paths without file extensions (React Router routes),
  // serve index.html to let React Router handle client-side routing
  if (path === '/' || (!path.includes('.') && !path.endsWith('/'))) {
    path = '/index.html'
  }
  
  // Get bucket name from environment variable or use default
  // TODO: Set BUCKET_NAME as environment variable in Cloudflare Worker settings
  const bucketName = typeof BUCKET_NAME !== 'undefined' ? BUCKET_NAME : 'hispanie-frontend'
  
  // Build the Google Cloud Storage URL
  const bucketUrl = `https://storage.googleapis.com/${bucketName}${path}`
  
  // Fetch from Cloud Storage
  const response = await fetch(bucketUrl)
  
  // Create new response with modified headers
  const newResponse = new Response(response.body, response)
  
  // Set cache headers for better performance
  if (path.includes('/static/')) {
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else {
    newResponse.headers.set('Cache-Control', 'public, max-age=300, must-revalidate')
  }
  
  return newResponse
}
