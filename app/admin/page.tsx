import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { getAdminStats } from "@/app/lib/admin-actions";
import Link from "next/link";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";

import { AdminChecker } from "@/app/components/admin/AdminChecker";

export default async function AdminDashboard() {
  noStore();
  
  const stats = await getAdminStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-8 dark:text-slate-100">
      {/* Admin Debug Tool */}
      <AdminChecker />
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">Admin Dashboard</h1>
          <p className="text-muted-foreground text-base sm:text-lg mt-2 dark:text-slate-400">
            Manage your platform and monitor key metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-md hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-blue-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/30 dark:to-transparent">
              <CardTitle className="text-sm font-medium dark:text-slate-200">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold dark:text-white">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-purple-500 shadow-md hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-purple-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/30 dark:to-transparent">
              <CardTitle className="text-sm font-medium dark:text-slate-200">Total Vendors</CardTitle>
              <Store className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold dark:text-white">{stats.totalVendors}</div>
              <p className="text-xs text-muted-foreground mt-2 dark:text-slate-400">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span> {stats.activeVendors} active,
                <span className="inline-block h-2 w-2 rounded-full bg-yellow-500 mx-1"></span> {stats.pendingVendors} pending
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-green-500 shadow-md hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-green-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/30 dark:to-transparent">
              <CardTitle className="text-sm font-medium dark:text-slate-200">Total Products</CardTitle>
              <Package className="h-5 w-5 text-green-500 dark:text-green-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold dark:text-white">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-amber-500 shadow-md hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-amber-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/30 dark:to-transparent">
              <CardTitle className="text-sm font-medium dark:text-slate-200">Total Orders</CardTitle>
              <ShoppingCart className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold dark:text-white">{stats.totalOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Vendor Status */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-l-4 border-l-emerald-500 shadow-md hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-emerald-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/30 dark:to-transparent">
              <CardTitle className="text-sm font-medium dark:text-slate-200">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatPrice(stats.totalRevenue / 100)}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-yellow-500 shadow-md hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-yellow-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/30 dark:to-transparent">
              <CardTitle className="text-sm font-medium dark:text-slate-200">Pending Vendors</CardTitle>
              <Clock className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingVendors}</div>
              <Link 
                href="/admin/vendors" 
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
              >
                Review pending applications →
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-green-500 shadow-md hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-green-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/30 dark:to-transparent">
              <CardTitle className="text-sm font-medium dark:text-slate-200">Active Vendors</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeVendors}</div>
              <p className="text-xs text-muted-foreground mt-2 dark:text-slate-400">Currently active</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-red-500 shadow-md hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-red-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/30 dark:to-transparent">
              <CardTitle className="text-sm font-medium dark:text-slate-200">Blocked Vendors</CardTitle>
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.blockedVendors}</div>
              <p className="text-xs text-muted-foreground mt-2 dark:text-slate-400">Access restricted</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="shadow-lg overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-700/50 dark:to-transparent border-b pb-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2 dark:text-white">
              <ShoppingCart className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              Recent Orders
            </CardTitle>
            <CardDescription className="text-base mt-1 dark:text-slate-400">Latest orders across the platform</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 overflow-x-auto">
              {stats.recentOrders.slice(0, 5).map((order) => (
                <div 
                  key={order.id} 
                  className="flex flex-wrap md:flex-nowrap items-center justify-between p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm hover:shadow"
                >
                  <div className="space-y-1 w-full md:w-auto mb-2 md:mb-0">
                    <p className="font-medium dark:text-white">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-slate-400 flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-400"></span>
                      Order #{order.id.slice(-8)}
                    </p>
                  </div>
                  <div className="text-right w-full md:w-auto">
                    <p className="font-medium dark:text-white">
                      {formatPrice(order.total / 100)}
                    </p>
                    <Badge variant={
                      order.status === 'DELIVERED' ? 'default' :
                      order.status === 'PENDING' ? 'secondary' :
                      order.status === 'CANCELLED' ? 'destructive' : 'outline'
                    } className="mt-1 dark:text-slate-200">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02] dark:bg-slate-800 dark:border-slate-700 group">
            <Link href="/admin/vendors" className="block h-full">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent group-hover:from-purple-100 dark:group-hover:from-purple-900/30 transition-all">
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                    <Store className="h-5 w-5" />
                  </div>
                  Manage Vendors
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Approve, reject, or manage vendor accounts
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02] dark:bg-slate-800 dark:border-slate-700 group">
            <Link href="/admin/orders" className="block h-full">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/20 dark:to-transparent group-hover:from-amber-100 dark:group-hover:from-amber-900/30 transition-all">
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/50 transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  All Orders
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  View and manage all platform orders
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02] dark:bg-slate-800 dark:border-slate-700 group">
            <Link href="/admin/analytics" className="block h-full">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/20 dark:to-transparent group-hover:from-emerald-100 dark:group-hover:from-emerald-900/30 transition-all">
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  Analytics
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Detailed platform analytics and reports
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
  );
}
