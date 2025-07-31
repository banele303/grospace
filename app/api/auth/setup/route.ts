import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();
    
    // Check authentication status first
    const authenticated = await isAuthenticated();
    
    if (!authenticated) {
      console.log("Auth setup: User not authenticated");
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const user = await getUser();
    
    if (!user?.id) {
      console.log("Auth setup: No user ID found");
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    
    console.log("Auth setup: User authenticated", { id: user.id, email: user.email });
    
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error("Auth setup error:", error);
    return NextResponse.json({ 
      authenticated: false, 
      error: error instanceof Error ? error.message : "Authentication failed" 
    }, { status: 200 });
  }
}
