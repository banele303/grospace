import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();
    
    if (!kindeUser?.id) {
      return NextResponse.json({ error: "Authentication required. Please log in first." }, { status: 401 });
    }

    const { 
      name, 
      phone, 
      address, 
      bio, 
      businessType,
      establishedYear,
      certifications,
      specialties,
      minimumOrder,
      deliveryRadius,
      logo // Store cover image URL
    } = await req.json();
    
    // Validate required fields
    if (!name || !phone || !address || !logo) {
      return NextResponse.json({ 
        error: "Business name, phone, address, and store image are required." 
      }, { status: 400 });
    }
    // Check if user already has a vendor profile
    const existingUser = await prisma.user.findUnique({ 
      where: { id: kindeUser.id },
      include: { vendor: true }
    });
    
    if (existingUser?.vendor) {
      return NextResponse.json({ 
        error: "You already have a vendor profile." 
      }, { status: 409 });
    }

    // Create or update user and vendor profile
    const result = await prisma.$transaction(async (tx) => {
      // Ensure user exists
      const user = await tx.user.upsert({
        where: { id: kindeUser.id },
        update: {
          email: kindeUser.email!,
          firstName: kindeUser.given_name || '',
          lastName: kindeUser.family_name || '',
          role: UserRole.VENDOR,
          profileImage: kindeUser.picture || ''
        },
        create: {
          id: kindeUser.id,
          email: kindeUser.email!,
          firstName: kindeUser.given_name || '',
          lastName: kindeUser.family_name || '',
          role: UserRole.VENDOR,
          profileImage: kindeUser.picture || ''
        }
      });

      // Create vendor profile
      const vendor = await tx.vendor.create({
        data: {
          userId: kindeUser.id,
          name,
          email: kindeUser.email!,
          phone,
          address,
          bio: bio || '',
          businessType: businessType || '',
          establishedYear,
          certifications: certifications || [],
          specialties: specialties || [],
          minimumOrder,
          deliveryRadius,
          logo, // Store cover image URL is required
          approved: false, // Admin approval required
        },
      });

      return { user, vendor };
    });

    return NextResponse.json({ 
      success: true, 
      message: "Vendor registration submitted successfully! Your application is pending admin approval.",
      vendor: { 
        id: result.vendor.id, 
        name: result.vendor.name, 
        email: result.vendor.email, 
        approved: result.vendor.approved 
      } 
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    return NextResponse.json({ 
      error: "Failed to register vendor. Please try again." 
    }, { status: 500 });
  }
}