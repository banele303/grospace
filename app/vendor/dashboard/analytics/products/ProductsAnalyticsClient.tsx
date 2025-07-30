"use client";

import { useState } from "react";
import { DatePickerWithRange } from "@/app/components/DatePickerWithRange";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowUpRight, BarChart2, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { useVendorAnalytics } from "@/app/hooks/useVendorAnalytics";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function ProductsAnalyticsClient() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  const { analytics, isLoading, error } = useVendorAnalytics({ 
    dateRange,
    type: "products"
  });

  // Mock data for product performance
  const productPerformance = [
    { name: "Organic Fertilizer", views: 1420, revenue: 2400, conversion: 3.5, stock: 86 },
    { name: "Heirloom Seeds Pack", views: 1120, revenue: 1800, conversion: 4.1, stock: 32 },
    { name: "Garden Tools Set", views: 980, revenue: 1200, conversion: 2.8, stock: 54 },
    { name: "Irrigation System", views: 765, revenue: 900, conversion: 2.4, stock: 21 },
    { name: "Organic Pesticides", views: 680, revenue: 780, conversion: 2.2, stock: 45 },
  ];

  // Mock data for category distribution
  const categoryDistribution = [
    { name: "Seeds", value: 35 },
    { name: "Equipment", value: 25 },
    { name: "Fertilizer", value: 20 },
    { name: "Services", value: 15 },
    { name: "Other", value: 5 },
  ];

  // Mock data for product views trend
  const viewsTrend = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(new Date().setDate(new Date().getDate() - (29 - i))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: Math.floor(Math.random() * 300) + 50,
    sales: Math.floor(Math.random() * 50) + 5,
  }));

  // Mock data for seasonality impact
  const seasonalityData = [
    { month: 'Jan', impact: 60 },
    { month: 'Feb', impact: 65 },
    { month: 'Mar', impact: 80 },
    { month: 'Apr', impact: 95 },
    { month: 'May', impact: 100 },
    { month: 'Jun', impact: 90 },
    { month: 'Jul', impact: 85 },
    { month: 'Aug', impact: 80 },
    { month: 'Sep', impact: 85 },
    { month: 'Oct', impact: 90 },
    { month: 'Nov', impact: 75 },
    { month: 'Dec', impact: 65 },
  ];

  // Colors for pie chart
  const COLORS = ['#4ade80', '#60a5fa', '#f97316', '#8b5cf6', '#ec4899'];

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products Analytics</CardTitle>
          <CardDescription>
            Something went wrong while loading your product analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p>Failed to load product data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Analytics</h2>
          <p className="text-muted-foreground">
            Track your product performance, views, and sales metrics
          </p>
        </div>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Product Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : "4,965"}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : "398"}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : "8.02%"}</div>
            <p className="text-xs text-muted-foreground">
              +1.3% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : "24/28"}</div>
            <p className="text-xs text-muted-foreground">
              4 products out of stock
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="views">Views & Engagement</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="seasonality">Seasonality</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Products Performance</CardTitle>
              <CardDescription>
                Revenue, views, and conversion rates for your top-selling products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {productPerformance.map((product, index) => (
                  <div key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`/products/product-${index + 1}.jpg`} alt={product.name} />
                      <AvatarFallback>{product.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <div className="text-sm text-muted-foreground">{formatPrice(product.revenue)}</div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex space-x-4">
                          <span>{product.views} views</span>
                          <span>{product.conversion}% conversion</span>
                          <span>Stock: {product.stock}</span>
                        </div>
                      </div>
                      <Progress value={product.revenue / 30} className="h-1 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="views" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Views & Sales Trend</CardTitle>
              <CardDescription>
                Daily views and sales for the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={viewsTrend}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    angle={-45}
                    textAnchor="end"
                    tickMargin={10}
                    tick={{ fontSize: 10 }}
                    interval={2} 
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="views"
                    stroke="#4ade80"
                    strokeWidth={2}
                    name="Product Views"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sales"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Categories Distribution</CardTitle>
                <CardDescription>
                  Percentage of products by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={130}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>
                  Total revenue breakdown by product category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryDistribution.map(category => ({
                      name: category.name,
                      revenue: Math.floor(Math.random() * 5000) + 1000
                    }))}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${formatPrice(value as number)}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seasonality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seasonality Impact on Product Sales</CardTitle>
              <CardDescription>
                How seasonal factors affect your product performance throughout the year
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={seasonalityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="impact" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                    {seasonalityData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.impact > 90 ? '#4ade80' : entry.impact > 70 ? '#60a5fa' : '#f97316'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Product Recommendations</CardTitle>
              <CardDescription>
                Products that typically perform well during the current season
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Summer Crop Seeds", category: "Seeds", score: 95 },
                  { name: "Drip Irrigation System", category: "Equipment", score: 92 },
                  { name: "Organic Pest Control", category: "Services", score: 88 },
                  { name: "Heat-Resistant Plant Fertilizer", category: "Fertilizer", score: 85 },
                  { name: "Shade Structures", category: "Equipment", score: 82 },
                  { name: "Water Conservation Kit", category: "Equipment", score: 78 }
                ].map((product, index) => (
                  <Card key={index} className="bg-muted/40">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Seasonal match</span>
                        <span className="text-xs font-medium">{product.score}%</span>
                      </div>
                      <Progress value={product.score} className="h-1 mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
