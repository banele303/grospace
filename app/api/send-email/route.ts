import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // TODO: Implement actual email sending logic here
    // For now, just simulate success
    console.log(`Simulating email sent to: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: `Email sent to ${email}` 
    });
    
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
