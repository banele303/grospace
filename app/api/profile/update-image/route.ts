import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, imageUrl, imageType, vendorId } = await request.json();
    
    // Validate inputs
    if (!userId || !imageUrl || !imageType) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    
    if (imageType === 'profile') {
      // Update user profile image
      await prisma.user.update({
        where: { id: userId },
        data: { profileImage: imageUrl }
      });
    } else if (imageType === 'store') {
      // Validate vendor ID
      if (!vendorId) {
        return NextResponse.json({ success: false, message: "Missing vendorId for store image update" }, { status: 400 });
      }
      
      // Update vendor logo/store image
      await prisma.vendor.update({
        where: { id: vendorId },
        data: { logo: imageUrl }
      });
    } else {
      return NextResponse.json({ success: false, message: "Invalid image type" }, { status: 400 });
    }
    
    // Revalidate the profile page
    revalidatePath('/vendor/dashboard/profile');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ success: false, message: "Failed to update image" }, { status: 500 });
  }
}
