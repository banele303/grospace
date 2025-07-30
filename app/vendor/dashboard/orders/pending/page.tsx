import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import OrdersTable from "../components/OrdersTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Import the OrderItem type from the component
import type { OrderItem } from "../components/OrdersTable";

// Type definition for database order items with Date object for createdAt
interface DbOrderItem {
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
}

async function getPendingOrders(vendorId: string): Promise<OrderItem[]> {
  noStore();
  
  const orders = await prisma.orderItem.findMany({
    where: { 
      vendorId,
      order: {
        status: "PENDING"
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

  // Convert database items to the OrderItem type expected by the component
  return orders.map(order => ({
    id: order.id,
    price: order.price,
    quantity: order.quantity,
    createdAt: order.createdAt.toISOString(), // Convert Date to string as required by OrderItem
    order: {
      id: order.order.id,
      status: order.order.status,
      user: {
        id: order.order.user.id,
        firstName: order.order.user.firstName || '',  // Convert null to empty string
        lastName: order.order.user.lastName || '',    // Convert null to empty string
        email: order.order.user.email
      }
    },
    product: {
      id: order.product.id,
      name: order.product.name
    }
  }));
}

export default async function PendingOrdersPage() {
  const { vendor } = await requireVendor();
  const orders = await getPendingOrders(vendor.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Pending Orders
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Manage orders that need your attention
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
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-slate-200">
            Pending Orders ({orders.length})
          </CardTitle>
          <CardDescription>
            Orders awaiting your action
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <OrdersTable orders={orders} />
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">
                No pending orders
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                You currently have no orders awaiting your attention.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
