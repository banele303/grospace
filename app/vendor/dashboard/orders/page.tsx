import { getVendorStatus } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  User,
  Calendar
} from "lucide-react";
import OrdersManagement from "./components/OrdersManagement";
import Link from "next/link";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PendingApprovalCard } from "@/app/components/vendor/PendingApprovalCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getVendorOrders(vendorId: string) {
  noStore();
  
  const orders = await prisma.orderItem.findMany({
    where: { vendorId },
    include: {
      order: {
        include: {
          user: true,
        },
      },
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.order.status === 'PENDING').length,
    processing: orders.filter(o => o.order.status === 'PROCESSING').length,
    shipped: orders.filter(o => o.order.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.order.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.order.status === 'CANCELLED').length,
  };

  const totalRevenue = orders
    .filter(o => o.order.status === 'DELIVERED')
    .reduce((sum, order) => sum + (order.price * order.quantity), 0);

  return { orders, stats, totalRevenue };
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'PROCESSING':
      return <Package className="h-4 w-4 text-blue-500" />;
    case 'SHIPPED':
      return <Truck className="h-4 w-4 text-purple-500" />;
    case 'DELIVERED':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'CANCELLED':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default async function VendorOrdersPage() {
  const vendorStatus = await getVendorStatus();
  
  // If vendor is pending approval, show pending state
  if (!vendorStatus.success && vendorStatus.isPending) {
    return (
      <PendingApprovalCard
        title="Orders Access Pending"
        description="Your vendor account is currently under review. Once approved, you'll be able to view and manage your orders."
        feature="manage orders"
        backUrl="/vendor/dashboard"
        backLabel="Back to Dashboard"
      />
    );
  }

  // If there's another error, handle it
  if (!vendorStatus.success) {
    throw new Error(vendorStatus.error || "Access denied");
  }

  const { vendor } = vendorStatus;
  const { orders, stats, totalRevenue } = await getVendorOrders(vendor.id);

  const pendingOrders = orders.filter(o => o.order.status === 'PENDING');
  const processingOrders = orders.filter(o => o.order.status === 'PROCESSING');
  const shippedOrders = orders.filter(o => o.order.status === 'SHIPPED');
  const deliveredOrders = orders.filter(o => o.order.status === 'DELIVERED');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Orders</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Manage and track your customer orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-gray-200 dark:hover:shadow-slate-700/20 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.total}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              All time
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-amber-200 dark:hover:shadow-amber-900/10 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.pending}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-blue-200 dark:hover:shadow-blue-900/10 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Processing
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.processing}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-purple-200 dark:hover:shadow-purple-900/10 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Shipped
            </CardTitle>
            <Truck className="h-4 w-4 text-purple-500 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.shipped}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              In transit
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-emerald-200 dark:hover:shadow-emerald-900/10 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Delivered
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.delivered}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management - Client Component */}
      <OrdersManagement allOrders={orders} stats={stats} />
    </div>
  );
}


