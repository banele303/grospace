import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin,
  ShoppingCart,
  Star,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  MessageSquare
} from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";

async function getVendorCustomers(vendorId: string) {
  // Get customers who have purchased from this vendor
  const orders = await prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          product: {
            vendorId: vendorId,
          },
        },
      },
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
            },
          },
        },
        where: {
          product: {
            vendorId: vendorId,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Group orders by customer
  const customerMap = new Map();
  
  orders.forEach(order => {
    const customerId = order.user.id;
    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        user: order.user,
        orders: [],
        totalSpent: 0,
        totalOrders: 0,
        lastOrderDate: order.createdAt,
      });
    }
    
    const customer = customerMap.get(customerId);
    customer.orders.push(order);
    customer.totalOrders += 1;
    customer.totalSpent += order.orderItems.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
    
    if (order.createdAt > customer.lastOrderDate) {
      customer.lastOrderDate = order.createdAt;
    }
  });

  const customers = Array.from(customerMap.values()).sort((a, b) => 
    b.totalSpent - a.totalSpent
  );

  // Calculate statistics
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const averageOrderValue = totalRevenue / orders.length || 0;
  const repeatCustomers = customers.filter(customer => customer.totalOrders > 1).length;

  return {
    customers,
    totalCustomers,
    totalRevenue,
    averageOrderValue,
    repeatCustomers,
  };
}

export default async function VendorCustomersPage() {
  noStore();
  const { user, vendor } = await requireVendor();
  const customerData = await getVendorCustomers(vendor.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-agricultural-800">Customer Management</h1>
          <p className="text-agricultural-600 mt-1">
            View and manage your customer relationships
          </p>
        </div>
        <Button className="bg-agricultural-500 hover:bg-agricultural-600">
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Newsletter
        </Button>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {customerData.totalCustomers}
                </p>
                <p className="text-sm text-agricultural-600">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {formatPrice(customerData.totalRevenue)}
                </p>
                <p className="text-sm text-agricultural-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {formatPrice(customerData.averageOrderValue)}
                </p>
                <p className="text-sm text-agricultural-600">Avg Order Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {customerData.repeatCustomers}
                </p>
                <p className="text-sm text-agricultural-600">Repeat Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                Manage your customer relationships and order history
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {customerData.customers.length > 0 ? (
            <div className="space-y-4">
              {customerData.customers.map((customer) => (
                <div key={customer.user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-agricultural-100 text-agricultural-700">
                          {customer.user.firstName?.charAt(0) || 'C'}
                          {customer.user.lastName?.charAt(0) || ''}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-agricultural-800">
                          {customer.user.firstName} {customer.user.lastName}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-agricultural-600">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{customer.user.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Last order: {new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-agricultural-800">
                            {customer.totalOrders}
                          </p>
                          <p className="text-xs text-agricultural-600">Orders</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-agricultural-800">
                            {formatPrice(customer.totalSpent)}
                          </p>
                          <p className="text-xs text-agricultural-600">Total Spent</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {customer.totalOrders > 1 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Repeat Customer
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Orders */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-agricultural-700 mb-2">Recent Orders</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {customer.orders.slice(0, 3).map((order: any) => (
                        <div key={order.id} className="text-sm bg-white border border-gray-200 rounded p-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">#{order.id.slice(-8)}</span>
                            <Badge variant="outline" className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                          <div className="text-agricultural-600 mt-1">
                            {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} • {formatPrice(order.orderItems.reduce((sum: number, item: { quantity: number; product: { price: number } }) => sum + (item.quantity * item.product.price), 0))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers yet</h3>
              <p className="text-gray-600">
                When customers purchase your products, they&apos;ll appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
