import { createKindeServerClient, GrantType, SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Create a session manager for Next.js with proper typing
const sessionManager: SessionManager = {
  getSessionItem: async (key: string): Promise<unknown> => {
    return cookies().get(key)?.value || null;
  },
  setSessionItem: async (key: string, value: unknown): Promise<void> => {
    cookies().set(key, String(value));
  },
  removeSessionItem: async (key: string): Promise<void> => {
    cookies().delete(key);
  },
  destroySession: async (): Promise<void> => {
    // Implementation to destroy the entire session
    // This is a simple implementation that might need adjustment based on Kinde's requirements
  }
};

const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_ISSUER_URL!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_SITE_URL + "/api/auth/kinde_callback",
  logoutRedirectURL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL || process.env.KINDE_SITE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const postLoginRedirectUrl = searchParams.get("post_login_redirect_url") || "/";
    
    // Ensure the redirect URL is absolute
    const baseUrl = process.env.KINDE_SITE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const absoluteRedirectUrl = postLoginRedirectUrl.startsWith("http") 
      ? postLoginRedirectUrl 
      : `${baseUrl}${postLoginRedirectUrl}`;

    const loginUrl = await kindeClient.login(sessionManager, {
      post_login_redirect_url: absoluteRedirectUrl,
    });

    return NextResponse.redirect(loginUrl.toString());
  } catch (error) {
    console.error("Custom login error:", error);
    return NextResponse.redirect(new URL("/auth-error?error=login_failed", request.url));
  }
}
