import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";

// GET /api/admin/vendors-status - Get all vendors with their statuses
export async function GET(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.vendorStatus = status;
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              accountStatus: true,
              isActive: true
            }
          },
          _count: {
            select: {
              products: true,
              orderItems: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.vendor.count({ where })
    ]);

    return NextResponse.json({
      vendors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/vendors-status - Update vendor status
export async function PUT(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { vendorId, vendorStatus, approved, blockedReason } = body;

    if (!vendorId || !vendorStatus) {
      return NextResponse.json(
        { error: "Vendor ID and status are required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      vendorStatus,
      approved: approved !== undefined ? approved : (vendorStatus === 'APPROVED'),
      updatedAt: new Date()
    };

    // Set blocked fields
    if (vendorStatus === 'BLOCKED') {
      updateData.blockedAt = new Date();
      updateData.blockedReason = blockedReason || 'Blocked by admin';
      updateData.approved = false;
    } else {
      updateData.blockedAt = null;
      updateData.blockedReason = null;
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });

    return NextResponse.json(updatedVendor);
  } catch (error) {
    console.error("Error updating vendor status:", error);
    return NextResponse.json(
      { error: "Failed to update vendor status" },
      { status: 500 }
    );
  }
}
