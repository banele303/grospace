import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("=== AUTH STATUS CHECK ===");
  console.log("URL:", request.url);
  console.log("Headers:", Object.fromEntries(request.headers.entries()));
  console.log("Cookies:", request.cookies.getAll());
  
  // Check for Kinde session cookies
  const kindeTokens = request.cookies.getAll().filter(cookie => 
    cookie.name.includes('kinde') || cookie.name.includes('access') || cookie.name.includes('refresh')
  );
  
  console.log("Kinde-related cookies:", kindeTokens);
  
  return NextResponse.json({
    success: true,
    cookies: request.cookies.getAll(),
    kindeTokens,
    timestamp: new Date().toISOString()
  });
}
