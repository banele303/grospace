import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAdmin } from "@/app/lib/auth";
import { seedAnalyticsData } from "@/app/lib/seed/seedAnalytics";

export async function POST(req: NextRequest) {
  try {
    // Only allow this in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
    }
    
    // Parse request body first to check for bypass flag
    const body = await req.json();
    const { 
      days = 30,
      vendorId,
      clearExisting = false,
      includeProducts = true,
      includeOrders = true, 
      includeViews = true,
      includeUsers = true,
      bypass_auth = false // Special flag to bypass authentication in development
    } = body;
    
    let user = null;
    
    if (!bypass_auth) {
      console.log('Seeding analytics: Authentication check');
      // Check authentication
      user = await getCurrentUser();
      if (!user) {
        console.log('Seeding analytics: Authentication failed - no user found');
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      console.log('Seeding analytics: User authenticated', { id: user.id, role: user.role });
    } else {
      // Only allow bypass in development mode
      if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: "Auth bypass not allowed in production" }, { status: 403 });
      }
      console.log('Seeding analytics: Authentication bypassed (development mode)');
      // Create mock admin user for seeding
      user = { id: 'dev-bypass', role: 'ADMIN', vendor: null };
    }

    // Validate vendor ID if present
    if (vendorId) {
      // Ensure user has rights to this vendor (if they're not an admin)
      if (user.role !== 'ADMIN' && user.vendor?.id !== vendorId) {
        return NextResponse.json({ error: "You can only seed data for your own vendor account" }, { status: 403 });
      }
    }

    // Run the seeding process
    const result = await seedAnalyticsData({
      days: parseInt(days, 10) || 30,
      vendorId,
      clearExisting,
      includeProducts,
      includeOrders,
      includeViews,
      includeUsers
    });

    return NextResponse.json({
      success: true,
      message: "Analytics data seeding completed successfully",
      result
    });
  } catch (error) {
    console.error("Error seeding analytics data:", error);
    return NextResponse.json(
      { error: "Failed to seed analytics data" },
      { status: 500 }
    );
  }
}

// GET endpoint to document usage
export async function GET() {
  // Only allow this in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }
  
  return NextResponse.json({
    endpoint: "/api/analytics/seed",
    method: "POST",
    description: "Seeds analytics data for testing/development purposes",
    usage: "POST with options in request body",
    options: {
      days: "Number of days to seed data for (default: 30)",
      vendorId: "Optional vendor ID to filter data for",
      clearExisting: "Whether to clear existing analytics data (default: false)",
      includeProducts: "Whether to include products in seeding (default: true)",
      includeOrders: "Whether to include orders in seeding (default: true)",
      includeViews: "Whether to include product views in seeding (default: true)",
      includeUsers: "Whether to include user creation in seeding (default: true)"
    },
    example: {
      days: 30,
      vendorId: "vendor-123",
      clearExisting: false,
      includeOrders: true,
      includeViews: true
    }
  });
}
