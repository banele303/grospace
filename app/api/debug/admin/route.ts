import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { isAdmin } from "@/app/lib/admin-actions";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ 
        status: "error", 
        message: "No authenticated user" 
      }, { status: 401 });
    }

    const adminStatus = await isAdmin();
    
    // Get user from database to check role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        id: true,
        email: true,
        role: true 
      }
    });

    // Get raw user data - useful for debugging
    const rawUserData = { ...user };

    return NextResponse.json({
      status: "success",
      user: {
        id: user.id,
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name
      },
      rawUserData,
      dbUser,
      adminStatus,
      adminConstants: {
        ADMIN_EMAIL: "alexsouthflow3@gmail.com"
      },
      // Add environment variables for debugging
      envVars: {
        KINDE_SITE_URL: process.env.KINDE_SITE_URL,
        KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
        // Don't include sensitive values like client secret
        KINDE_CLIENT_ID_SET: !!process.env.KINDE_CLIENT_ID,
        KINDE_CLIENT_SECRET_SET: !!process.env.KINDE_CLIENT_SECRET,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error in admin debug route:", error);
    return NextResponse.json({ 
      status: "error", 
      message: "Internal server error",
      error: String(error)
    }, { status: 500 });
  }
}
