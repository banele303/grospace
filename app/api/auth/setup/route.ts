import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();
    
    if (!(await isAuthenticated())) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await getUser();
    
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: user?.id,
        email: user?.email,
        given_name: user?.given_name,
        family_name: user?.family_name,
        picture: user?.picture
      }
    });
  } catch (error) {
    console.error("Auth setup error:", error);
    return NextResponse.json({ authenticated: false, error: "Authentication failed" }, { status: 401 });
  }
}
