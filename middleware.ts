import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only run middleware for auth-related paths
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    // Get a fully qualified site URL
    const siteUrl = process.env.KINDE_SITE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    
    // Check if this is a login or register route with problematic redirect
    if (
      request.nextUrl.pathname.includes('/login') || 
      request.nextUrl.pathname.includes('/register')
    ) {
      const url = new URL(request.url);
      const redirectParam = url.searchParams.get("post_login_redirect_url");
      
      // Fix problematic relative URLs
      if (redirectParam === "/" || redirectParam === "") {
        url.searchParams.set("post_login_redirect_url", siteUrl);
        return NextResponse.redirect(url);
      }
    }
  }
  
  // Let all requests pass through - authentication handled by route guards
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
