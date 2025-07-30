import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";
import { UserStatus } from "@/app/lib/auth";

// GET /api/admin/users - Get all users with their statuses
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
      // Make sure status is a valid UserStatus enum value
      if (Object.values(UserStatus).includes(status as UserStatus)) {
        where.accountStatus = status;
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          accountStatus: true,
          isActive: true,
          blockedAt: true,
          blockedReason: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              products: true,
              orders: true,
              vendors: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users - Update user status
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
    const { userId, accountStatus, isActive, blockedReason } = body;

    if (!userId || !accountStatus) {
      return NextResponse.json(
        { error: "User ID and account status are required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      accountStatus,
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    };

    // Set blocked fields
    if (accountStatus === UserStatus.BLOCKED) {
      updateData.blockedAt = new Date();
      updateData.blockedReason = blockedReason || 'Blocked by admin';
    } else {
      updateData.blockedAt = null;
      updateData.blockedReason = null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountStatus: true,
        isActive: true,
        blockedAt: true,
        blockedReason: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
