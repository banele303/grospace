"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  User,
  Calendar,
} from "lucide-react";
import { formatPrice } from "@/app/lib/utils";

// Status helpers
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

// Type definitions
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
}

interface Order {
  id: string;
  status: string;
  user: User;
}

export interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  createdAt: string;
  order: Order;
  product: Product;
}

// Update order status function
async function updateOrderStatus(orderId: string, status: string) {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export default function OrdersTable({ orders: initialOrders }: { orders: OrderItem[] }) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">
          No orders found
        </h3>
        <p className="text-gray-600 dark:text-slate-400">
          Orders will appear here when customers place them.
        </p>
      </div>
    );
  }

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(orders.map(item => {
        if (item.order.id === orderId) {
          return {
            ...item,
            order: {
              ...item.order,
              status: newStatus
            }
          };
        }
        return item;
      }));
      
      toast.success(`Order status updated to ${newStatus}`);
      router.refresh(); // Refresh the page to update server components
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Table className="border-collapse border-spacing-0">
      <TableHeader className="bg-gray-50 dark:bg-slate-800">
        <TableRow className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/80">
          <TableHead className="text-gray-700 dark:text-slate-300 font-medium">Order</TableHead>
          <TableHead className="text-gray-700 dark:text-slate-300 font-medium">Customer</TableHead>
          <TableHead className="text-gray-700 dark:text-slate-300 font-medium">Product</TableHead>
          <TableHead className="text-gray-700 dark:text-slate-300 font-medium">Quantity</TableHead>
          <TableHead className="text-gray-700 dark:text-slate-300 font-medium">Total</TableHead>
          <TableHead className="text-gray-700 dark:text-slate-300 font-medium">Status</TableHead>
          <TableHead className="text-gray-700 dark:text-slate-300 font-medium">Date</TableHead>
          <TableHead className="text-right text-gray-700 dark:text-slate-300 font-medium">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-200 dark:divide-slate-700">
        {orders.map((orderItem) => (
          <TableRow key={orderItem.id} className="bg-white dark:bg-slate-800/30 hover:bg-gray-50 dark:hover:bg-slate-800/70 transition-colors duration-150">
            <TableCell>
              <div className="font-medium text-gray-800 dark:text-slate-200">
                #{orderItem.order.id.slice(-8)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-slate-200">
                    {orderItem.order.user.firstName} {orderItem.order.user.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {orderItem.order.user.email}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-agricultural-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-agricultural-600" />
                </div>
                <div>
                  <p className="font-medium text-agricultural-800">
                    {orderItem.product.name}
                  </p>
                  <p className="text-sm text-agricultural-600">
                    {formatPrice(orderItem.price)} each
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-medium text-agricultural-800">
                {orderItem.quantity}
              </span>
            </TableCell>
            <TableCell>
              <span className="font-medium text-agricultural-800">
                {formatPrice(orderItem.price * orderItem.quantity)}
              </span>
            </TableCell>
            <TableCell>
              <Badge className={`${getStatusColor(orderItem.order.status)} border-0`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(orderItem.order.status)}
                  {orderItem.order.status}
                </div>
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm text-agricultural-600">
                <Calendar className="h-4 w-4" />
                {new Date(orderItem.createdAt).toLocaleDateString()}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={isUpdating === orderItem.order.id}
                  >
                    {isUpdating === orderItem.order.id ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>

                  {/* Status update options based on current status */}
                  {orderItem.order.status === 'PENDING' && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate(orderItem.order.id, 'PROCESSING')}>
                      <Package className="h-4 w-4 mr-2 text-blue-500" />
                      Mark as Processing
                    </DropdownMenuItem>
                  )}

                  {orderItem.order.status === 'PROCESSING' && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate(orderItem.order.id, 'SHIPPED')}>
                      <Truck className="h-4 w-4 mr-2 text-purple-500" />
                      Mark as Shipped
                    </DropdownMenuItem>
                  )}

                  {orderItem.order.status === 'SHIPPED' && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate(orderItem.order.id, 'DELIVERED')}>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Mark as Delivered
                    </DropdownMenuItem>
                  )}

                  {/* Cancel option for orders that are not delivered or cancelled */}
                  {!['DELIVERED', 'CANCELLED'].includes(orderItem.order.status) && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate(orderItem.order.id, 'CANCELLED')}>
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      Cancel Order
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
