import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Get base URL for redirects
const getBaseUrl = (request: NextRequest): string => {
  return process.env.KINDE_SITE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
};

export async function GET(request: NextRequest, { params }: { params: { kindeAuth: string } }) {
  // Log environment variables for debugging
  console.log("Kinde Environment Check:", {
    KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL,
    KINDE_SITE_URL: process.env.KINDE_SITE_URL,
    KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
    KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID ? "SET" : "NOT_SET",
    endpoint: params.kindeAuth
  });

  // Special handling for register and login to ensure proper redirect
  if (params.kindeAuth === "register" || params.kindeAuth === "login") {
    const url = new URL(request.url);
    const redirectParam = url.searchParams.get("post_login_redirect_url");
    
    // If redirect URL is just "/", use absolute URL
    if (redirectParam === "/" || !redirectParam) {
      const baseUrl = getBaseUrl(request);
      url.searchParams.set("post_login_redirect_url", baseUrl);
      return NextResponse.redirect(url);
    }
  }

  try {
    const endpoint = params.kindeAuth;
    return handleAuth(request, endpoint);
  } catch (error) {
    console.error("Kinde auth error:", error);
    
    // If it's a callback error, redirect to error page
    if (params.kindeAuth === "kinde_callback") {
      const baseUrl = getBaseUrl(request);
      return NextResponse.redirect(`${baseUrl}/auth-error?error=callback_failed`);
    }
    
    // For other auth errors, redirect to home with absolute URL
    const baseUrl = getBaseUrl(request);
    return NextResponse.redirect(baseUrl);
  }
}

