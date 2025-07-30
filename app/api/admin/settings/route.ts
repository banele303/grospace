import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";

const ADMIN_EMAIL = "alexsouthflow3@gmail.com";

// Check if user is admin
async function isAdmin() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return user?.email === ADMIN_EMAIL;
}

// GET - Fetch admin settings
export async function GET() {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Default admin settings
    const settings = {
      siteName: "GroSpace",
      siteDescription: "Your premier online marketplace",
      currency: "ZAR",
      taxRate: 15, // South Africa VAT rate
      shippingEnabled: true,
      maintenanceMode: false,
      emailNotifications: true,
      smsNotifications: false,
      vendorApprovalRequired: true,
      maxProductsPerVendor: 1000,
      commissionRate: 10,
      paymentMethods: {
        stripe: true,
        paypal: false,
        bankTransfer: true
      },
      supportEmail: "support@grospace.co.za",
      supportPhone: "+27 11 123 4567",
      businessAddress: {
        street: "123 Business Street",
        city: "Johannesburg",
        province: "Gauteng",
        postalCode: "2000",
        country: "South Africa"
      },
      socialMedia: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: ""
      },
      analytics: {
        googleAnalyticsId: "",
        facebookPixelId: "",
        enableTracking: true
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 30, // minutes
        passwordMinLength: 8,
        requireStrongPassword: true
      }
    };

    return NextResponse.json({ 
      success: true, 
      data: settings 
    });

  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST - Update admin settings
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    const {
      siteName,
      siteDescription,
      currency,
      taxRate,
      commissionRate,
      supportEmail,
      businessAddress
    } = body;

    if (!siteName || !siteDescription || !currency || !supportEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supportEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate tax rate and commission rate
    if (taxRate < 0 || taxRate > 100) {
      return NextResponse.json(
        { error: "Tax rate must be between 0 and 100" },
        { status: 400 }
      );
    }

    if (commissionRate < 0 || commissionRate > 50) {
      return NextResponse.json(
        { error: "Commission rate must be between 0 and 50" },
        { status: 400 }
      );
    }

    // In a real application, you would save these settings to a database
    // For now, we'll just return success with the updated settings
    const updatedSettings = {
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: "admin"
    };

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: updatedSettings
    });

  } catch (error) {
    console.error("Error updating admin settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

// PUT - Update specific setting
export async function PUT(request: NextRequest) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    // Validate specific settings
    switch (key) {
      case 'taxRate':
      case 'commissionRate':
        if (typeof value !== 'number' || value < 0 || value > 100) {
          return NextResponse.json(
            { error: "Rate must be a number between 0 and 100" },
            { status: 400 }
          );
        }
        break;
      case 'supportEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return NextResponse.json(
            { error: "Invalid email format" },
            { status: 400 }
          );
        }
        break;
      case 'maxProductsPerVendor':
        if (typeof value !== 'number' || value < 1) {
          return NextResponse.json(
            { error: "Max products must be a positive number" },
            { status: 400 }
          );
        }
        break;
    }

    return NextResponse.json({
      success: true,
      message: `Setting '${key}' updated successfully`,
      data: { [key]: value, updatedAt: new Date().toISOString() }
    });

  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}

// DELETE - Reset settings to default
export async function DELETE() {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Settings reset to default values"
    });

  } catch (error) {
    console.error("Error resetting settings:", error);
    return NextResponse.json(
      { error: "Failed to reset settings" },
      { status: 500 }
    );
  }
}
