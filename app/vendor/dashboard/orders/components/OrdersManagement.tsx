"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersTable from "./OrdersTable";

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface OrdersManagementProps {
  allOrders: any[];
  stats: OrderStats;
}

export default function OrdersManagement({ allOrders, stats }: OrdersManagementProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Filter orders based on search term
  const filteredOrders = searchTerm 
    ? allOrders.filter(order => 
        order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${order.order.user.firstName} ${order.order.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allOrders;
    
  // Get orders based on active tab
  const getTabOrders = (tab: string) => {
    switch(tab) {
      case "pending":
        return filteredOrders.filter(o => o.order.status === 'PENDING');
      case "processing":
        return filteredOrders.filter(o => o.order.status === 'PROCESSING');
      case "shipped":
        return filteredOrders.filter(o => o.order.status === 'SHIPPED');
      case "delivered":
        return filteredOrders.filter(o => o.order.status === 'DELIVERED');
      case "cancelled":
        return filteredOrders.filter(o => o.order.status === 'CANCELLED');
      default:
        return filteredOrders;
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg hover:shadow-md dark:hover:shadow-slate-700/20 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-slate-200">
            Order Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
              <Input
                placeholder="Search orders..."
                className="pl-10 w-64 bg-gray-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:placeholder:text-slate-400 focus-visible:ring-emerald-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="border-gray-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-50 dark:bg-slate-700/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 dark:text-slate-300 dark:data-[state=active]:text-white">
              All Orders ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 dark:text-slate-300 dark:data-[state=active]:text-white">
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="processing" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 dark:text-slate-300 dark:data-[state=active]:text-white">
              Processing ({stats.processing})
            </TabsTrigger>
            <TabsTrigger value="shipped" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 dark:text-slate-300 dark:data-[state=active]:text-white">
              Shipped ({stats.shipped})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 dark:text-slate-300 dark:data-[state=active]:text-white">
              Delivered ({stats.delivered})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 dark:text-slate-300 dark:data-[state=active]:text-white">
              Cancelled ({stats.cancelled})
            </TabsTrigger>
          </TabsList>

          <OrdersTable orders={getTabOrders(activeTab)} />
        </Tabs>
      </CardContent>
    </Card>
  );
}
