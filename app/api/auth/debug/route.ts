import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();
    
    console.log("=== AUTH DEBUG ENDPOINT ===");
    
    const authenticated = await isAuthenticated();
    console.log("Authenticated:", authenticated);
    
    if (authenticated) {
      const user = await getUser();
      console.log("User:", user);
      
      return NextResponse.json({
        success: true,
        authenticated: true,
        user: {
          id: user?.id,
          email: user?.email,
          given_name: user?.given_name,
          family_name: user?.family_name,
          picture: user?.picture
        }
      });
    } else {
      console.log("User not authenticated");
      return NextResponse.json({
        success: true,
        authenticated: false,
        user: null
      });
    }
  } catch (error) {
    console.error("Auth debug error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      authenticated: false
    }, { status: 500 });
  }
}
