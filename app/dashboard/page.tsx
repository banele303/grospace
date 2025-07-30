import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Clock, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/app/lib/utils";
import { getCurrentUser } from "@/app/lib/auth";
import { AdminAccessButton } from "@/app/components/admin/AdminAccessButton";

async function getDashboardData(userId: string) {
  const [orders, favorites, totalSpent] = await Promise.all([
    // Get recent orders for this user
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    }),
    // Get wishlist/favorites count for this user
    prisma.favorite.count({
      where: { userId },
    }),
    // Get total spent by this user
    prisma.order.aggregate({
      where: { userId },
      _sum: { total: true },
    }),
  ]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
  const totalSpentAmount = totalSpent._sum.total || 0;

  return {
    orders: orders.slice(0, 3), // Show only 3 recent orders
    totalOrders,
    favorites,
    pendingOrders,
    totalSpent: totalSpentAmount,
  };
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const statusColors = {
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    SHIPPED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    PROCESSING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

export default async function DashboardPage() {
  noStore();
  const user = await getCurrentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const dashboardData = await getDashboardData(user.id);

  const stats = [
    { 
      name: 'Total Orders', 
      value: dashboardData.totalOrders.toString(), 
      icon: ShoppingBag, 
      change: dashboardData.totalOrders > 0 ? '+' + dashboardData.totalOrders : '0', 
      changeType: dashboardData.totalOrders > 0 ? 'positive' : 'neutral' 
    },
    { 
      name: 'Wishlist Items', 
      value: dashboardData.favorites.toString(), 
      icon: Heart, 
      change: dashboardData.favorites > 0 ? '+' + dashboardData.favorites : '0', 
      changeType: dashboardData.favorites > 0 ? 'positive' : 'neutral' 
    },
    { 
      name: 'Pending Orders', 
      value: dashboardData.pendingOrders.toString(), 
      icon: Package, 
      change: dashboardData.pendingOrders > 0 ? dashboardData.pendingOrders.toString() : '0', 
      changeType: 'neutral' 
    },
    { 
      name: 'Total Spent', 
      value: formatPrice(dashboardData.totalSpent / 100), 
      change: dashboardData.totalSpent > 0 ? '+' + formatPrice(dashboardData.totalSpent / 100) : formatPrice(0), 
      changeType: dashboardData.totalSpent > 0 ? 'positive' : 'neutral' 
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {user.firstName || user.email?.split('@')[0] || 'Customer'}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your account and orders.
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/products" className="gap-2">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className="h-5 w-5 text-muted-foreground">
                {stat.icon && <stat.icon className="h-5 w-5" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs mt-1 ${
                stat.changeType === 'positive' 
                  ? 'text-green-600 dark:text-green-400' 
                  : stat.changeType === 'negative' 
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
              }`}>
                {stat.change} {stat.changeType === 'positive' ? '↑' : stat.changeType === 'negative' ? '↓' : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Access */}
      <AdminAccessButton />

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your recent purchases</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/orders">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dashboardData.orders.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.orders.map((order) => (
                <div key={order.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Order #{order.id.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''} • {formatPrice(order.total / 100)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={order.status} />
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/orders`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No orders yet</h3>
              <p className="text-muted-foreground mt-1">
                Start shopping to see your orders here.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
