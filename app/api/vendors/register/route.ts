import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();
    
    console.log('Vendor registration attempt by user:', kindeUser?.id, kindeUser?.email);
    
    if (!kindeUser?.id) {
      console.log('Vendor registration failed: No authenticated user');
      return NextResponse.json({ error: "Authentication required. Please log in first." }, { status: 401 });
    }

    const requestBody = await req.json();
    console.log('Vendor registration request body:', requestBody);
    
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
    } = requestBody;
    
    // Validate required fields
    if (!name || !phone || !address || !logo) {
      console.log('Vendor registration failed: Missing required fields', {
        name: !!name,
        phone: !!phone,
        address: !!address,
        logo: !!logo
      });
      return NextResponse.json({ 
        error: "Business name, phone, address, and store image are required." 
      }, { status: 400 });
    }
    
    console.log('Vendor registration validation passed, checking existing vendor...');
    // Check if user already has a vendor profile
    const existingUser = await prisma.user.findUnique({ 
      where: { id: kindeUser.id },
      include: { vendors: true } // Using vendors plural to match Prisma schema
    });
    
    console.log('Existing user check:', {
      userExists: !!existingUser,
      hasVendors: existingUser?.vendors?.length || 0
    });
    
    if (existingUser?.vendors && existingUser.vendors.length > 0) {
      console.log('Vendor registration failed: User already has vendor profile');
      return NextResponse.json({ 
        error: "You already have a vendor profile." 
      }, { status: 409 });
    }

    console.log('Creating vendor profile for user:', kindeUser.id);

    // Create or update user and vendor profile
    const result = await prisma.$transaction(async (tx) => {
      console.log('Starting database transaction...');
      
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

      console.log('User created/updated:', user.id);

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

      console.log('Vendor created:', vendor.id);

      return { user, vendor };
    });

    console.log('Vendor registration successful!', {
      userId: result.user.id,
      vendorId: result.vendor.id,
      vendorName: result.vendor.name
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
    
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      error: "Failed to register vendor. Please try again." 
    }, { status: 500 });
  }
}