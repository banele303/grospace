import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Truck } from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import OrdersTable from "../components/OrdersTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Type definitions for order items
type OrderItem = {
  id: string;
  price: number;
  quantity: number;
  createdAt: string | Date;
  vendorId: string;
  order: {
    id: string;
    status: string;
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  };
  product: {
    id: string;
    name: string;
    images?: string[];
  };
};

async function getShippedOrders(vendorId: string) {
  noStore();
  
  const orders = await prisma.orderItem.findMany({
    where: { 
      vendorId,
      order: {
        status: "SHIPPED"
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

  return orders;
}

export default async function ShippedOrdersPage() {
  const { vendor } = await requireVendor();
  const orders = await getShippedOrders(vendor.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Shipped Orders
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Track orders currently in transit
          </p>
        </div>
        <Link href="/vendor/dashboard/orders">
          <Button variant="outline" className="border-gray-200 dark:border-slate-700">
            View All Orders
          </Button>
        </Link>
      </div>

      {/* Orders Table */}
      <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg hover:shadow-md dark:hover:shadow-slate-700/20 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-slate-200">
              Shipped Orders ({orders.length})
            </CardTitle>
          </div>
          <CardDescription>
            Orders that have been shipped and are in transit
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <OrdersTable orders={orders} />
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">
                No shipped orders
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                You currently don't have any orders in transit.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
