"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/app/components/DatePickerWithRange";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesChart } from "@/app/components/dashboard/analytics/SalesChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, CreditCard, DollarSign, Users } from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { useVendorAnalytics } from "@/app/hooks/useVendorAnalytics";

export default function SalesAnalyticsClient() {
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
    type: "sales"
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
          <CardDescription>
            Something went wrong while loading your sales analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p>Failed to load sales data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Analytics</h2>
          <p className="text-muted-foreground">
            Track your vendor sales performance and revenue metrics
          </p>
        </div>
        <DatePickerWithRange date={dateRange} setDate={handleDateRangeChange} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : formatPrice(analytics?.totalSales || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {(analytics?.revenueChange ?? 0) > 0 ? "+" : ""}{analytics?.revenueChange ?? 0}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : analytics?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              {(analytics?.ordersChange || 0) > 0 ? "+" : ""}{analytics?.ordersChange || 0}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : formatPrice(analytics?.averageOrderValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {(analytics?.aovChange ?? 0) > 0 ? "+" : ""}{analytics?.aovChange ?? 0}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${analytics?.conversionRate || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {(analytics?.conversionChange ?? 0) > 0 ? "+" : ""}{analytics?.conversionChange ?? 0}% from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Your sales performance over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading sales data...</p>
                </div>
              ) : (
                <SalesChart data={analytics?.salesData || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales</CardTitle>
              <CardDescription>
                Your sales performance by day
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading daily sales data...</p>
                </div>
              ) : (
                <SalesChart data={analytics?.dailySalesData || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sales</CardTitle>
              <CardDescription>
                Your sales performance by week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading weekly sales data...</p>
                </div>
              ) : (
                <SalesChart data={analytics?.weeklySalesData || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>
                Your sales performance by month
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading monthly sales data...</p>
                </div>
              ) : (
                <SalesChart data={analytics?.monthlySalesData || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
