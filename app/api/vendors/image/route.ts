import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId, imageUrl, imageType, vendorId } = await req.json();

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields: userId and imageUrl" },
        { status: 400 }
      );
    }

    // Check if imageType is valid
    if (!["profile", "store"].includes(imageType)) {
      return NextResponse.json(
        { error: "Invalid imageType, must be 'profile' or 'store'" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendors: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle profile image update
    if (imageType === "profile") {
      await prisma.user.update({
        where: { id: userId },
        data: { profileImage: imageUrl },
      });
      
      return NextResponse.json({ 
        success: true, 
        message: "Profile image updated successfully" 
      });
    }
    
    // Handle store image update
    if (imageType === "store") {
      // If no vendor exists yet, this is for a new store being created
      // Just return success - the image URL will be passed in the store creation request
      if (!user.vendors || user.vendors.length === 0) {
        return NextResponse.json({ 
          success: true, 
          message: "Store image received for new store creation" 
        });
      }
      
      // For existing vendor, update the store image
      if (vendorId) {
        await prisma.vendor.update({
          where: { id: vendorId },
          data: { logo: imageUrl },
        });
        
        return NextResponse.json({ 
          success: true, 
          message: "Store image updated successfully" 
        });
      } else {
        // If no vendorId provided but user has a vendor account, update their main store image
        // Find the first vendor associated with this user
        const vendor = user.vendors && user.vendors.length > 0 ? user.vendors[0] : null;
        
        if (vendor) {
          await prisma.vendor.update({
            where: { id: vendor.id },
            data: { logo: imageUrl },
          });
          
          return NextResponse.json({ 
            success: true, 
            message: "Store image updated successfully" 
          });
        } else {
          return NextResponse.json({ 
            error: "No vendor account found for this user" 
          }, { status: 404 });
        }
      }
    }

  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}
