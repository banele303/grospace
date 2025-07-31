import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { kindeAuth: string } }) {
  try {
    console.log(`Auth endpoint called: ${params.kindeAuth}`);
    console.log(`Request URL: ${request.url}`);
    
    const result = await handleAuth(request, params.kindeAuth);
    
    // Log successful authentication
    if (params.kindeAuth === "kinde_callback") {
      console.log("Callback completed successfully");
    }
    
    return result;
  } catch (error) {
    console.error("Kinde auth error:", error);
    
    // On error, redirect to home with error indication
    if (params.kindeAuth === "kinde_callback") {
      console.error("Callback failed, redirecting to home");
      return NextResponse.redirect(new URL("/?auth_error=callback_failed", request.url));
    }
    
    throw error;
  }
}

