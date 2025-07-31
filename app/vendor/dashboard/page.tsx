import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Leaf, 
  Users,
  Calendar,
  MapPin,
  Star,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
  Target,
  Award,
  Truck
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
// Import SalesChart component
import SalesChart from "./components/SalesChart";

type TransactionData = {
  amount: number;
  createdAt: Date;
};

type TransactionResult = {
  date: string;
  revenue: number;
};

type SalesData = {
  date: string;
  amount: number;
};

type ProductData = {
  id: string;
  name: string;
  images: string[];
  category: string;
  views: number | null;
  price: number;
  stock: number;
};

type OrderData = {
  id: string;
  status: string;
  createdAt: Date;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
  };
  order: {
    user: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  };
};

async function getData(vendorId: string) {
  noStore();
  
  // Calculate date range for past week
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [products, orders, earnings, recentOrders, monthlyEarnings, pastWeekOrderItems] = await Promise.all([
    prisma.product.findMany({
      where: { vendorId },
      include: { _count: { select: { orderItems: true } } },
      orderBy: { views: 'desc' },
      take: 5,
    }),
    prisma.orderItem.findMany({
      where: { vendorId },
      include: { order: true, product: true },
    }),
    prisma.vendorEarning.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.orderItem.findMany({
      where: { vendorId },
      include: { 
        order: { include: { user: true } }, 
        product: true 
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.vendorEarning.findMany({
      where: { 
        vendorId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    // Get past week order items for sales graph
    prisma.orderItem.findMany({
      where: {
        vendorId,
        createdAt: {
          gte: oneWeekAgo,
          lte: today,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
  ]);

  // Calculate earnings from both sources for comparison
  const earningsFromRecords = earnings.reduce((sum, earning) => sum + earning.netAmount, 0);
  // Calculate earnings from order items (more reliable source of truth)
  const totalEarnings = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
  // Calculate pending earnings from order items with PENDING status
  const pendingEarnings = orders
    .filter(order => order.order.status === 'PENDING')
    .reduce((sum, order) => sum + (order.price * order.quantity), 0);
  const monthlyTotal = monthlyEarnings.reduce((sum, earning) => sum + earning.netAmount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(order => order.order.status === 'PENDING').length;
  const completedOrders = orders.filter(order => order.order.status === 'DELIVERED').length;
  const lowStockProducts = products.filter(product => product.quantity < 10).length;
  const totalViews = products.reduce((sum, product) => sum + (product.views || 0), 0);

  // Calculate growth percentages based on previous month data
  const currentMonth = new Date().getMonth();
  const lastMonth = new Date(new Date().setMonth(currentMonth - 1));
  
  const lastMonthEarnings = monthlyEarnings.filter(e => {
    const earningDate = new Date(e.createdAt);
    return earningDate.getMonth() === lastMonth.getMonth();
  }).reduce((sum, e) => sum + e.netAmount, 0);
  
  const earningsGrowth = lastMonthEarnings > 0 ? ((monthlyTotal - lastMonthEarnings) / lastMonthEarnings * 100) : 0;
  const ordersGrowth = totalOrders > 0 ? 8.3 : 0; // You can implement proper calculation
  const productsGrowth = totalProducts > 0 ? 15.2 : 0; // You can implement proper calculation
  const viewsGrowth = totalViews > 0 ? 22.1 : 0; // You can implement proper calculation
  
  // Process past week sales data for the chart
  const weeklySalesMap: Record<string, number> = {};
  
  // Initialize the map with all 7 days (including days with zero sales)
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i)); // Start from 6 days ago to today
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).split(',')[0];
    weeklySalesMap[dateStr] = 0;
  }
  
  // Populate the map with actual sales data
  pastWeekOrderItems.forEach(item => {
    const date = new Date(item.createdAt);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).split(',')[0];
    weeklySalesMap[dateStr] = (weeklySalesMap[dateStr] || 0) + (item.price * item.quantity);
  });
  
  // Convert the map to an array format for the chart
  const weeklySalesData: SalesData[] = Object.entries(weeklySalesMap).map(([date, amount]) => ({
    date,
    amount,
  }));
  
  // Calculate the total week's sales and percentage change
  const totalWeekSales = weeklySalesData.reduce((sum, day) => sum + day.amount, 0);
  
  // Calculate sales for the previous week for comparison
  const twoWeeksAgo = new Date(oneWeekAgo);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);
  
  const previousWeekSales = pastWeekOrderItems.reduce((sum, item) => {
    const date = new Date(item.createdAt);
    if (date >= twoWeeksAgo && date < oneWeekAgo) {
      return sum + (item.price * item.quantity);
    }
    return sum;
  }, 0);
  
  const weeklyGrowth = previousWeekSales > 0
    ? Math.round(((totalWeekSales - previousWeekSales) / previousWeekSales * 100) * 10) / 10
    : 0;

  // Debug earnings values
  console.log('Debug earnings:', { 
    earningsFromRecords, 
    totalEarnings, 
    pendingEarnings, 
    monthlyTotal,
    totalWeekSales: pastWeekOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  });

  return {
    totalEarnings,
    pendingEarnings,
    monthlyTotal,
    totalOrders,
    totalProducts,
    pendingOrders,
    completedOrders,
    lowStockProducts,
    totalViews,
    earningsGrowth,
    ordersGrowth,
    productsGrowth,
    viewsGrowth,
    products,
    recentOrders,
    weeklySalesData,
    totalWeekSales,
    weeklyGrowth,
  };
}

export default async function VendorDashboard() {
  noStore();
  
  const user = await getCurrentUser(true);
  
  if (!user) {
    return redirect("/auth-error");
  }

  // Check if user has vendor role and vendor profile
  if (user.role !== UserRole.VENDOR || !user.vendors || user.vendors.length === 0) {
    return redirect("/vendors/register");
  }

  const vendor = user.vendors[0];
  
  // Check if vendor is approved for full dashboard functionality
  const isApproved = vendor.approved;
  
  // Get dashboard data only if approved
  const data = isApproved ? await getData(vendor.id) : null;

  // If vendor is not approved, show pending state in dashboard
  if (!isApproved || !data) {
    return (
      <div className="space-y-8">
        {/* Pending Approval Header */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-orange-900">Welcome, {vendor.name}!</h1>
              <p className="text-orange-700">Your vendor application is currently under review.</p>
            </div>
          </div>
        </div>

        {/* Pending Status Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Application Status</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">Pending</div>
              <p className="text-xs text-orange-600">Under admin review</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-400">0</div>
              <p className="text-xs text-gray-400">Available after approval</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-400">0</div>
              <p className="text-xs text-gray-400">Available after approval</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-400">$0</div>
              <p className="text-xs text-gray-400">Available after approval</p>
            </CardContent>
          </Card>
        </div>

        {/* What's Next Section */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">What happens next?</CardTitle>
            <CardDescription className="text-blue-700">
              Here's what to expect during the approval process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-800">Application submitted successfully</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-gray-800">Admin review in progress (1-2 business days)</span>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Email notification upon approval</span>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Full dashboard access after approval</span>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Profile Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Your Vendor Profile</CardTitle>
            <CardDescription>
              Review your submitted information
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Business Name</label>
              <p className="text-gray-900">{vendor.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{vendor.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="text-gray-900">{vendor.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Business Type</label>
              <p className="text-gray-900">{vendor.businessType || 'Not specified'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <p className="text-gray-900">{vendor.address}</p>
            </div>
            {vendor.bio && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <p className="text-gray-900">{vendor.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // TypeScript guard to ensure data is not null for approved vendors
  if (!data) {
    throw new Error("Data should be available for approved vendors");
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-agricultural-800 dark:text-white">
            Welcome back, {vendor.name}! 🌱
          </h1>
          <p className="text-agricultural-600 dark:text-white mt-1">
            Here&apos;s what&apos;s happening with your agricultural business today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="bg-agricultural-500 hover:bg-agricultural-600">
            <Link href="/vendor/dashboard/products/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {!vendor.approved && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">Account Pending Approval</h3>
                <p className="text-yellow-700 text-sm">
                  Your vendor account is under review. You&apos;ll receive an email once approved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-agricultural-200 hover:shadow-lg transition-shadow dark:border-slate-700 dark:bg-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-agricultural-700 dark:text-slate-300">
              Total Earnings
            </CardTitle>
            <div className="p-2 bg-agricultural-100 dark:bg-agricultural-900/20 rounded-lg">
              <DollarSign className="h-4 w-4 text-agricultural-600 dark:text-agricultural-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-agricultural-800 dark:text-slate-100">
              {formatPrice(Number(data.totalEarnings) || 0)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                +{data.earningsGrowth}%
              </span>
              <span className="text-xs text-agricultural-600 dark:text-slate-400">from last month</span>
            </div>
            <p className="text-xs text-agricultural-600 dark:text-slate-400 mt-1">
              {formatPrice(Number(data.pendingEarnings) || 0)} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-agricultural-200 hover:shadow-lg transition-shadow dark:border-slate-700 dark:bg-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-agricultural-700 dark:text-slate-300">
              Total Orders
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-agricultural-800 dark:text-slate-100">
              {data.totalOrders}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                +{data.ordersGrowth}%
              </span>
              <span className="text-xs text-agricultural-600 dark:text-slate-400">from last month</span>
            </div>
            <p className="text-xs text-agricultural-600 dark:text-slate-400 mt-1">
              {data.pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-agricultural-200 hover:shadow-lg transition-shadow dark:border-slate-700 dark:bg-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-agricultural-700 dark:text-slate-300">
              Products
            </CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-agricultural-800 dark:text-slate-100">
              {data.totalProducts}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                +{data.productsGrowth}%
              </span>
              <span className="text-xs text-agricultural-600 dark:text-slate-400">from last month</span>
            </div>
            <p className="text-xs text-agricultural-600 dark:text-slate-400 mt-1">
              {data.lowStockProducts} low stock
            </p>
          </CardContent>
        </Card>

        <Card className="border-agricultural-200 hover:shadow-lg transition-shadow dark:border-slate-700 dark:bg-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-agricultural-700 dark:text-slate-300">
              Product Views
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-agricultural-800 dark:text-slate-100">
              {data.totalViews.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                +{data.viewsGrowth}%
              </span>
              <span className="text-xs text-agricultural-600 dark:text-slate-400">from last month</span>
            </div>
            <p className="text-xs text-agricultural-600 dark:text-slate-400 mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Weekly Sales Chart */}
      <div className="grid grid-cols-1 gap-6">
        <SalesChart 
          data={data.weeklySalesData} 
          totalSales={data.totalWeekSales} 
          percentageChange={data.weeklyGrowth} 
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-agricultural-200 hover:shadow-lg transition-shadow dark:border-slate-700 dark:bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-agricultural-800 dark:text-slate-200 flex items-center gap-2">
              <Plus className="h-5 w-5 dark:text-slate-300" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/vendor/dashboard/products/create" className="dark:text-slate-300">
                <Package className="h-4 w-4 mr-2" />
                Add New Product
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/vendor/dashboard/orders" className="dark:text-slate-300">
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Orders
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/vendor/dashboard/analytics" className="dark:text-slate-300">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-agricultural-200 hover:shadow-lg transition-shadow dark:border-slate-700 dark:bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-agricultural-800 dark:text-slate-200 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 dark:text-slate-300" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.lowStockProducts > 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    {data.lowStockProducts} products low in stock
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">Restock soon</p>
                </div>
              </div>
            )}
            {data.pendingOrders > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {data.pendingOrders} orders pending
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Requires attention</p>
                </div>
              </div>
            )}
            {data.lowStockProducts === 0 && data.pendingOrders === 0 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    All systems running smoothly
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">No alerts</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-agricultural-200 hover:shadow-lg transition-shadow dark:border-slate-700 dark:bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-agricultural-800 dark:text-slate-200 flex items-center gap-2">
              <Target className="h-5 w-5 dark:text-slate-300" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-agricultural-700 dark:text-slate-300">Monthly Goal</span>
                <span className="text-agricultural-600 dark:text-slate-400">
                  {`R ${new Intl.NumberFormat("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.monthlyTotal)}`} / {`R ${new Intl.NumberFormat("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(10000)}`}
                </span>
              </div>
              <Progress value={(data.monthlyTotal / 10000) * 100} className="h-2 dark:bg-slate-700" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-agricultural-700 dark:text-slate-300">Order Completion</span>
                <span className="text-agricultural-600 dark:text-slate-400">
                  {data.totalOrders > 0 ? Math.round((data.completedOrders / data.totalOrders) * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={data.totalOrders > 0 ? (data.completedOrders / data.totalOrders) * 100 : 0} 
                className="h-2 dark:bg-slate-700" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-agricultural-200 dark:border-slate-700 dark:bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-agricultural-800 dark:text-slate-200 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 dark:text-slate-300" />
              Recent Orders
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              Your latest customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentOrders.length > 0 ? (
                data.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center gap-4 p-3 bg-agricultural-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-agricultural-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-agricultural-600 dark:text-slate-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-agricultural-800 dark:text-slate-200">
                        {order.product.name}
                      </p>
                      <p className="text-sm text-agricultural-600 dark:text-slate-400">
                        {order.order.user.firstName} {order.order.user.lastName} • Qty: {order.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-agricultural-800 dark:text-slate-200">
                        {`R ${new Intl.NumberFormat("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(order.price * order.quantity)}`}
                      </p>
                      <Badge 
                        variant={order.order.status === 'COMPLETED' ? 'default' : 'secondary'}
                        className="text-xs dark:bg-opacity-70"
                      >
                        {order.order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-agricultural-300 dark:text-slate-500 mx-auto mb-4" />
                  <p className="text-agricultural-600 dark:text-slate-400">No orders yet</p>
                  <p className="text-sm text-agricultural-500 dark:text-slate-500">Orders will appear here once customers start buying</p>
                </div>
              )}
            </div>
            {data.recentOrders.length > 0 && (
              <div className="mt-4 pt-4 border-t border-agricultural-200 dark:border-slate-700">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/vendor/dashboard/orders" className="dark:text-slate-300">
                    View All Orders
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-agricultural-200 dark:border-slate-700 dark:bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-agricultural-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 dark:text-slate-300" />
              Top Products
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              Your best performing products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.products.length > 0 ? (
                data.products.map((product: any) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 bg-agricultural-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-agricultural-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-agricultural-600 dark:text-slate-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-agricultural-800 dark:text-slate-200">
                        {product.name}
                      </p>
                      <p className="text-sm text-agricultural-600 dark:text-slate-400">
                        {product.category} • Stock: {product.stock}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-agricultural-800 dark:text-slate-200">
                        {`R ${new Intl.NumberFormat("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.price)}`}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-agricultural-600 dark:text-slate-400">
                        <Eye className="h-3 w-3 dark:text-slate-400" />
                        {product.views || 0} views
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-agricultural-300 dark:text-slate-500 mx-auto mb-4" />
                  <p className="text-agricultural-600 dark:text-slate-400">No products yet</p>
                  <p className="text-sm text-agricultural-500 dark:text-slate-500">Add your first product to get started</p>
                  <Button asChild className="mt-4" size="sm">
                    <Link href="/vendor/dashboard/products/create" className="dark:text-slate-300">
                      Add Product
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            {data.products.length > 0 && (
              <div className="mt-4 pt-4 border-t border-agricultural-200 dark:border-slate-700">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/vendor/dashboard/products" className="dark:text-slate-300">
                    View All Products
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
