import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    // Get the authenticated user from Kinde
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();
    
    // If no Kinde user, return unauthorized
    if (!kindeUser?.id) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }
    
    // Check if the user already exists in the database
    let user = await prisma.user.findUnique({
      where: { id: kindeUser.id },
    });
    
    // If the user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: kindeUser.id,
          email: kindeUser.email || "",
          firstName: kindeUser.given_name || "",
          lastName: kindeUser.family_name || "",
          profileImage: kindeUser.picture || "",
          role: UserRole.BUYER, // Default role
          isActive: true,
        },
      });
      
      console.log("Created new user:", user.id);
    }
    
    return NextResponse.json({ 
      success: true, 
      user,
      message: user ? "User synchronized" : "User created" 
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
