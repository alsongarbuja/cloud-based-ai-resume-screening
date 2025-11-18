import { handlers } from "@/lib/auth/config"
import { NextRequest } from "next/server"

const { GET: originalGET, POST: originalPOST } = handlers

// Wrap GET with caching headers for session endpoint
export async function GET(request: NextRequest) {
  // Check if this is a forced update request
  const searchParams = request.nextUrl.searchParams
  const forceUpdate = searchParams.get('update') === 'true'
  
  if (forceUpdate && request.nextUrl.pathname.includes('/session')) {
    // For forced updates disable caching and trigger JWT refresh
    const response = await originalGET(request)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }
  
  const response = await originalGET(request)
  
  // Add cache headers for regular session requests
  if (request.nextUrl.pathname.includes('/session')) {
    response.headers.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=300')
  }
  
  return response
}

export const POST = originalPOST