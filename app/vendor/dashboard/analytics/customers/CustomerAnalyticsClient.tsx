"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/app/components/DatePickerWithRange";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, DollarSign, UserPlus, Users } from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { useVendorAnalytics } from "@/app/hooks/useVendorAnalytics";
import { DataTable } from "@/components/ui/data-table";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function CustomerAnalyticsClient() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  // Wrapper function to handle the type mismatch between React's setState and DatePickerWithRange
  const handleDateRangeChange = (date: DateRange | undefined) => {
    if (date?.from && date?.to) {
      setDateRange({ from: date.from, to: date.to });
    }
  };
  
  const { analytics, isLoading, error } = useVendorAnalytics({ 
    dateRange,
    type: "overview" // Using 'overview' which is one of the allowed types
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Analytics</CardTitle>
          <CardDescription>
            Something went wrong while loading your customer analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p>Failed to load customer data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock customer data (in a real application, this would come from the analytics object)
  const customerData = [
    { id: '1', name: 'John Smith', orderCount: 12, totalSpent: 1250.50, lastPurchase: '2025-07-22' },
    { id: '2', name: 'Sarah Johnson', orderCount: 8, totalSpent: 875.25, lastPurchase: '2025-07-20' },
    { id: '3', name: 'Robert Williams', orderCount: 15, totalSpent: 1890.75, lastPurchase: '2025-07-24' },
    { id: '4', name: 'Lisa Brown', orderCount: 6, totalSpent: 520.00, lastPurchase: '2025-07-18' },
    { id: '5', name: 'Michael Davis', orderCount: 10, totalSpent: 1100.30, lastPurchase: '2025-07-23' },
  ];

  const customerRetentionData = [
    { month: 'Jan', newCustomers: 45, returningCustomers: 32 },
    { month: 'Feb', newCustomers: 52, returningCustomers: 40 },
    { month: 'Mar', newCustomers: 48, returningCustomers: 45 },
    { month: 'Apr', newCustomers: 61, returningCustomers: 51 },
    { month: 'May', newCustomers: 55, returningCustomers: 49 },
    { month: 'Jun', newCustomers: 67, returningCustomers: 58 },
  ];

  const columns = [
    { accessorKey: "name", header: "Customer" },
    { 
      accessorKey: "orderCount", 
      header: "Orders",
      cell: ({ row }: any) => <div className="font-medium">{row.original.orderCount}</div>
    },
    { 
      accessorKey: "totalSpent", 
      header: "Total Spent",
      cell: ({ row }: any) => <div className="font-medium">{formatPrice(row.original.totalSpent)}</div>
    },
    { 
      accessorKey: "lastPurchase", 
      header: "Last Purchase",
      cell: ({ row }: any) => <div className="font-medium">{new Date(row.original.lastPurchase).toLocaleDateString()}</div>
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Analytics</h2>
          <p className="text-muted-foreground">
            Track customer acquisition, retention, and spending habits
          </p>
        </div>
        <DatePickerWithRange date={dateRange} setDate={handleDateRangeChange} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : analytics?.totalCustomers || 89}
            </div>
            <p className="text-xs text-muted-foreground">
              {(analytics?.customersChange || 7.2) > 0 ? "+" : ""}{analytics?.customersChange || 7.2}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : analytics?.newCustomers || 24}</div>
            <p className="text-xs text-muted-foreground">
              {(analytics?.newCustomersChange || 12.5) > 0 ? "+" : ""}{analytics?.newCustomersChange || 12.5}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : formatPrice(analytics?.customerLifetimeValue || 325.50)}
            </div>
            <p className="text-xs text-muted-foreground">
              {(analytics?.clvChange || 4.8) > 0 ? "+" : ""}{analytics?.clvChange || 4.8}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Purchase Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${analytics?.repeatPurchaseRate || 42}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {(analytics?.rprChange || 3.2) > 0 ? "+" : ""}{analytics?.rprChange || 3.2}% from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="top-customers">Top Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={customerRetentionData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis width={40} />
                    <Tooltip />
                    <Bar dataKey="newCustomers" fill="#4ade80" />
                    <Bar dataKey="returningCustomers" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#4ade80]" />
                  <span>New Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#2563eb]" />
                  <span>Returning Customers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Retention Rate</CardTitle>
              <CardDescription>
                Percentage of customers who return to make another purchase over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Detailed retention analytics coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="top-customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers by Spend</CardTitle>
              <CardDescription>
                Your highest value customers based on total order amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={customerData} searchKey="name" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
