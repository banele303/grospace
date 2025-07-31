import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

// The admin email address
const ADMIN_EMAIL = "alexsouthflow3@gmail.com";

export async function GET() {
  try {
    // Get user from Kinde session
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // If no user, return unauthorized
    if (!user) {
      console.log("Admin check: No authenticated user");
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    // Check if user's email matches admin email
    const isAdmin = user.email === ADMIN_EMAIL;
    console.log(`Admin check for ${user.email}: ${isAdmin ? "✓" : "✗"}`);

    // Return admin status
    return NextResponse.json({
      isAdmin,
      email: user.email,
    });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { error: "Failed to check admin status" },
      { status: 500 }
    );
  }
}
