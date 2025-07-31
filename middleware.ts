import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";

// Admin email
const ADMIN_EMAIL = "alexsouthflow3@gmail.com";

export default function middleware(req: NextRequest) {
  // Check if this is an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Get Kinde user directly from request headers
    const user = req.headers.get('x-kinde-user');
    
    if (!user) {
      // No user, redirect to login
      return NextResponse.redirect(new URL('/api/auth/login?post_login_redirect_url=%2Fadmin', req.url));
    }
    
    try {
      // Parse user from header
      const userData = JSON.parse(user);
      
      // Check if admin
      if (userData.email === ADMIN_EMAIL) {
        // User is admin, allow access
        return NextResponse.next();
      } else {
        // User is not admin, redirect to home
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (e) {
      // Error parsing user, redirect to login
      return NextResponse.redirect(new URL('/api/auth/login?post_login_redirect_url=%2Fadmin', req.url));
    }
  }
  
  // Regular auth protection for other routes
  return withAuth(req);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/vendor/:path*"
  ]
};
