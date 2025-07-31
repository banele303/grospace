import { NextRequest, NextResponse } from "next/server";
import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest, 
  { params }: { params: { vendorId: string } }
) {
  try {
    const vendorId = params.vendorId;
    
    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      );
    }
    
    // Get vendor with user data
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });
    
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      vendorId: vendor.id,
      userId: vendor.userId
    });
  } catch (error) {
    console.error("Error fetching vendor user ID:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
