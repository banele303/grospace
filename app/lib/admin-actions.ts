"use server";

import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

const ADMIN_EMAIL = "alexsouthflow3@gmail.com";

// Check if user is admin
export async function isAdmin() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      console.log("Admin check: No user found from Kinde session");
      return false;
    }

    console.log("Admin check: User from Kinde:", { 
      id: user.id, 
      email: user.email, 
      given_name: user.given_name,
      family_name: user.family_name
    });
    
    // Check if this is the admin email
    const isAdminEmail = user.email === ADMIN_EMAIL;
    console.log(`Admin check: Email comparison: '${user.email}' === '${ADMIN_EMAIL}' = ${isAdminEmail}`);
    
    if (isAdminEmail) {
      console.log("Admin check: Admin email match found, ensuring user has ADMIN role");
      // Ensure user has admin role in database
      await prisma.user.upsert({
        where: { id: user.id },
        update: { role: 'ADMIN' },
        create: {
          id: user.id,
          email: user.email!,
          firstName: user.given_name || 'Admin',
          lastName: user.family_name || 'User',
          profileImage: user.picture || '',
          role: 'ADMIN'
        }
      });
      return true;
    }

    // Check database role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    console.log(`Admin check: Database role check: ${dbUser?.role === 'ADMIN'}, Role: ${dbUser?.role}`);
    
    return dbUser?.role === 'ADMIN';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Get admin dashboard stats
export async function getAdminStats() {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    const [
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingVendors,
      activeVendors,
      blockedVendors,
      recentOrders,
      topVendors
    ] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true }
      }),
      prisma.vendor.count({
        where: { approved: false }
      }),
      prisma.vendor.count({
        where: { approved: true }
      }),
      prisma.vendor.count({
        where: { approved: false } // For now, we'll treat non-approved as blocked
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          orderItems: {
            include: {
              product: {
                include: {
                  vendor: true
                }
              }
            }
          }
        }
      }),
      prisma.vendor.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          products: true,
          _count: {
            select: {
              products: true
            }
          }
        }
      })
    ]);

    return {
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingVendors,
      activeVendors,
      blockedVendors,
      recentOrders,
      topVendors
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw new Error("Failed to fetch admin statistics");
  }
}

// Get all vendors for management
export async function getAllVendors() {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        user: true,
        products: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return vendors;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw new Error("Failed to fetch vendors");
  }
}

// Approve vendor
export async function approveVendor(vendorId: string) {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { approved: true }
    });

    revalidatePath("/admin/vendors");
    return { success: true, message: "Vendor approved successfully" };
  } catch (error) {
    console.error("Error approving vendor:", error);
    return { success: false, error: "Failed to approve vendor" };
  }
}

// Reject vendor
export async function rejectVendor(vendorId: string, reason?: string) {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { 
        approved: false
        // You can add a rejection reason field to the vendor model if needed
      }
    });

    revalidatePath("/admin/vendors");
    return { success: true, message: "Vendor rejected successfully" };
  } catch (error) {
    console.error("Error rejecting vendor:", error);
    return { success: false, error: "Failed to reject vendor" };
  }
}

// Block/Unblock vendor
export async function toggleVendorStatus(vendorId: string, isActive: boolean) {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { 
        approved: isActive
      }
    });

    revalidatePath("/admin/vendors");
    return { 
      success: true, 
      message: `Vendor ${isActive ? 'activated' : 'blocked'} successfully` 
    };
  } catch (error) {
    console.error("Error toggling vendor status:", error);
    return { success: false, error: "Failed to update vendor status" };
  }
}

// Delete vendor (if needed)
export async function deleteVendor(vendorId: string) {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    // You might want to handle this more carefully in production
    // by archiving instead of deleting
    await prisma.vendor.delete({
      where: { id: vendorId }
    });

    revalidatePath("/admin/vendors");
    return { success: true, message: "Vendor deleted successfully" };
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return { success: false, error: "Failed to delete vendor" };
  }
}

// Enhanced analytics functions
export async function getDetailedAnalytics() {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    // Get date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    const [
      // Current period metrics
      currentMonthRevenue,
      currentMonthOrders,
      currentMonthUsers,
      
      // Previous period metrics
      lastMonthRevenue,
      lastMonthOrders,
      lastMonthUsers,
      
      // User growth data
      userGrowthData,
      
      // Revenue trends
      revenueByMonth,
      
      // Product performance
      topProducts,
      
      // Vendor performance
      vendorPerformance,
      
      // Order status distribution
      orderStatusData,
      
      // Recent activity
      recentActivity
    ] = await Promise.all([
      // Current month revenue
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth }
        },
        _sum: { total: true },
        _count: true
      }),
      
      // Current month orders
      prisma.order.count({
        where: {
          createdAt: { gte: startOfMonth }
        }
      }),
      
      // Current month users
      prisma.user.count({
        where: {
          createdAt: { gte: startOfMonth }
        }
      }),
      
      // Last month revenue
      prisma.order.aggregate({
        where: {
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        },
        _sum: { total: true },
        _count: true
      }),
      
      // Last month orders
      prisma.order.count({
        where: {
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // Last month users
      prisma.user.count({
        where: {
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // User growth over last 12 months
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as count
        FROM "User"
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month
      `,
      
      // Revenue by month for last 12 months
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM("total") as revenue,
          COUNT(*) as orders
        FROM "Order"
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month
      `,
      
      // Top performing products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
          price: true
        },
        _count: {
          productId: true
        },
        orderBy: {
          _sum: {
            price: 'desc'
          }
        },
        take: 10
      }),
      
      // Vendor performance
      prisma.vendor.findMany({
        include: {
          _count: {
            select: {
              products: true
            }
          },
          products: {
            include: {
              orderItems: {
                select: {
                  quantity: true,
                  price: true
                }
              }
            }
          }
        },
        take: 10
      }),
      
      // Order status distribution
      prisma.order.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),
      
      // Recent activity (orders, user registrations, vendor applications)
      Promise.all([
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        }),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { firstName: true, lastName: true, email: true, createdAt: true }
        }),
        prisma.vendor.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        })
      ])
    ]);

    // Calculate growth percentages
    const revenueGrowth = lastMonthRevenue._sum.total 
      ? ((currentMonthRevenue._sum.total || 0) - (lastMonthRevenue._sum.total || 0)) / (lastMonthRevenue._sum.total || 1) * 100
      : 0;
      
    const ordersGrowth = lastMonthOrders 
      ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
      : 0;
      
    const usersGrowth = lastMonthUsers 
      ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
      : 0;

    return {
      overview: {
        currentMonth: {
          revenue: currentMonthRevenue._sum.total || 0,
          orders: currentMonthOrders,
          users: currentMonthUsers
        },
        lastMonth: {
          revenue: lastMonthRevenue._sum.total || 0,
          orders: lastMonthOrders,
          users: lastMonthUsers
        },
        growth: {
          revenue: revenueGrowth,
          orders: ordersGrowth,
          users: usersGrowth
        }
      },
      charts: {
        userGrowth: userGrowthData,
        revenueByMonth: revenueByMonth,
        orderStatus: orderStatusData
      },
      performance: {
        topProducts: topProducts,
        vendorPerformance: vendorPerformance,
        metrics: [
          { metric: 'Page Load Time', value: '1.2s', status: 'good' },
          { metric: 'Error Rate', value: '0.3%', status: 'good' },
          { metric: 'Uptime', value: '99.9%', status: 'excellent' },
          { metric: 'API Response', value: '150ms', status: 'good' }
        ]
      },
      recentActivity: recentActivity[0]?.map((order: any, index: number) => ({
        type: 'order',
        action: `Order ${order.status.toLowerCase()}`,
        description: `${order.user.firstName} ${order.user.lastName} - ${order.total ? `R ${new Intl.NumberFormat("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(order.total)}` : 'N/A'}`,
        time: getRelativeTime(order.createdAt),
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/50'
      })) || [],
      deviceStats: [
        { device: 'Desktop', percentage: 45 },
        { device: 'Mobile', percentage: 40 },
        { device: 'Tablet', percentage: 15 }
      ],
      topLocations: [
        { country: 'Johannesburg', users: 1250, flag: '�️' },
        { country: 'Cape Town', users: 890, flag: '�️' },
        { country: 'Durban', users: 650, flag: '�️' },
        { country: 'Pretoria', users: 420, flag: '�️' },
        { country: 'Port Elizabeth', users: 380, flag: '�' }
      ],
      salesFunnel: [
        { stage: 'Visitors', count: 10000, percentage: 100, color: 'bg-blue-500' },
        { stage: 'Product Views', count: 6500, percentage: 65, color: 'bg-green-500' },
        { stage: 'Add to Cart', count: 2800, percentage: 28, color: 'bg-yellow-500' },
        { stage: 'Checkout Started', count: 1200, percentage: 12, color: 'bg-orange-500' },
        { stage: 'Orders Completed', count: 850, percentage: 8.5, color: 'bg-red-500' }
      ],
      customerSatisfaction: {
        averageRating: 4.8,
        totalReviews: 2847,
        ratingDistribution: [
          { stars: 5, count: 1823, percentage: 64 },
          { stars: 4, count: 698, percentage: 25 },
          { stars: 3, count: 227, percentage: 8 },
          { stars: 2, count: 71, percentage: 2 },
          { stars: 1, count: 28, percentage: 1 }
        ]
      }
    };
  } catch (error) {
    console.error("Error fetching detailed analytics:", error);
    throw new Error("Failed to fetch analytics data");
  }
}

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
