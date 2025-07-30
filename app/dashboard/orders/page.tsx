import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/app/components/dashboard/orders/OrdersTable";
import { RefundRequestsTable } from "@/app/components/dashboard/orders/RefundRequestsTable";
import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";

async function getData(userId: string) {
  console.log("Getting data for user:", userId);
  // Filter orders by the currently logged-in user ID
  if (!userId) {
    console.log("No user ID provided");
    return { orders: [], refundRequests: [] };
  }
  
  try {
    const [ordersData, refundRequests] = await Promise.all([
      prisma.order.findMany({
        where: {
          user: {
            id: userId, // Filter orders by logged-in user ID using proper relation
          },
        },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.refundRequest.findMany({
        where: {
          order: {
            user: {
              id: userId, // Filter refund requests by logged-in user ID using proper relation
            },
          },
        },
        include: {
          order: {
            include: {
              user: true,
              orderItems: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
  ]);

  // Transform orders data to match the expected Order type in OrdersTable
  const orders = ordersData.map(order => {
    // Log the order structure to help debug
    console.log(`Order ${order.id} - Total: ${order.total}`);
    
    return {
      ...order,
      amount: order.total || 0, // Map total to amount
      items: order.orderItems // Map orderItems to items
    };
  });

  // Define the RefundRequest type for clarity
  type RefundRequest = {
    id: string;
    status: string;
    reason: string;
    createdAt: Date;
    order: {
      id: string;
      amount: number;
      user: {
        firstName: string;
        email: string;
      };
    };
  };

  // Transform refund requests to match the expected RefundRequest type
  const transformedRefundRequests = refundRequests.map(refundRequest => {
    try {
      // Make sure we have all the required properties
      if (!refundRequest.order?.id || !refundRequest.order?.user?.firstName) {
        console.error("Missing required properties in refundRequest:", refundRequest.id);
        return null;
      }
      
      return {
        id: refundRequest.id,
        status: refundRequest.status || "pending",
        reason: refundRequest.reason || "",
        createdAt: refundRequest.createdAt,
        order: {
          id: refundRequest.order.id,
          amount: refundRequest.order.total || 0, // Use total as amount
          user: {
            firstName: refundRequest.order.user.firstName,
            email: refundRequest.order.user.email
          }
        }
      };
    } catch (err) {
      console.error(`Error transforming refund request ${refundRequest.id}:`, err);
      return null;
    }
  }).filter((request): request is RefundRequest => request !== null); // Type guard to ensure non-null values

  console.log(`Found ${orders.length} orders and ${transformedRefundRequests.length} refund requests`);

  return {
    orders,
    refundRequests: transformedRefundRequests,
  };
  } catch (error) {
    console.error("Error fetching orders data:", error);
    return { orders: [], refundRequests: [] };
  }
}

export default async function OrdersPage() {
  noStore();
  
  try {
    // Use the existing getCurrentUser function which already handles Kinde auth properly
    const user = await getCurrentUser();
    
    // Redirect to login if not authenticated
    if (!user) {
      console.log("No user found, redirecting to login");
      redirect("/sign-in");
      return null;
    }

    console.log("Current user ID:", user.id);
    console.log("User role:", user.role);
    
    // Get only the orders belonging to the current user
    const { orders, refundRequests } = await getData(user.id);
    
    // Debug log the results
    console.log(`Successfully retrieved ${orders.length} orders for user ${user.id}`);
    
    // If we reach here, we should have the user's orders
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage orders and handle refund requests
          </p>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">All Orders</TabsTrigger>
            <TabsTrigger value="refunds">Refund Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersTable orders={orders} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Refund Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <RefundRequestsTable refundRequests={refundRequests} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error in OrdersPage:", error);
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground text-red-500">
            Unable to load your orders. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
