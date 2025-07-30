import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import OrdersTable from "../components/OrdersTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Import OrderItem type from the shared component to ensure consistency
import { OrderItem } from "../components/OrdersTable";

async function getDeliveredOrders(vendorId: string) {
  noStore();
  
  const ordersData = await prisma.orderItem.findMany({
    where: { 
      vendorId,
      order: {
        status: "DELIVERED"
      }
    },
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

  // Keep the original Date objects as required by the OrderItem type
  const orders = ordersData;

  // Calculate total revenue from delivered orders
  const totalRevenue = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);

  return { orders, totalRevenue };
}

export default async function DeliveredOrdersPage() {
  const { vendor } = await requireVendor();
  const { orders, totalRevenue } = await getDeliveredOrders(vendor.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Delivered Orders
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            View your completed orders and earnings
          </p>
        </div>
        <Link href="/vendor/dashboard/orders">
          <Button variant="outline" className="border-gray-200 dark:border-slate-700">
            View All Orders
          </Button>
        </Link>
      </div>

      {/* Revenue Card */}
      <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-green-200 dark:hover:shadow-green-900/10 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Total Revenue from Delivered Orders
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatPrice(totalRevenue)}
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            From {orders.length} completed orders
          </p>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg hover:shadow-md dark:hover:shadow-slate-700/20 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-slate-200">
              Delivered Orders ({orders.length})
            </CardTitle>
          </div>
          <CardDescription>
            Successfully completed orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <OrdersTable orders={orders} />
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">
                No delivered orders
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                You don&apos;t have any completed orders yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
