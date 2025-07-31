import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Star,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Eye,
  Target,
  Zap,
  Award,
  Filter,
  Download,
  RefreshCw,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  CreditCard,
  Percent,
  Timer,
  ThumbsUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { getDetailedAnalytics, getAdminStats } from "@/app/lib/admin-actions";
import { unstable_noStore as noStore } from "next/cache";
import { formatPrice } from "@/app/lib/utils";
import { cn } from "@/lib/utils";

// Enhanced chart components with better dark mode support
const SimpleChart = ({ data, type = "line", className = "" }: { data: any, type?: "line" | "bar", className?: string }) => (
  <div className={cn("h-32 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50", className)}>
    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
      <BarChart3 className="h-5 w-5" />
      <span className="text-sm">Chart visualization ({type})</span>
    </div>
  </div>
);

// Enhanced metric card component
const MetricCard = ({ 
  title, 
  value, 
  previousValue, 
  icon: Icon, 
  gradient, 
  description,
  growth 
}: {
  title: string;
  value: string | number;
  previousValue?: string | number;
  icon: any;
  gradient: string;
  description?: string;
  growth?: number;
}) => {
  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-white/90" />;
    if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-white/90" />;
    return <Activity className="h-4 w-4 text-white/90" />;
  };

  return (
    <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${gradient} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
          {growth !== undefined && (
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
              {getGrowthIcon(growth)}
              <span className="text-sm font-medium">
                {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {description && (
            <p className="text-white/70 text-xs mt-2">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default async function AdminAnalyticsPage() {
  noStore();
  
  const [analytics, basicStats] = await Promise.all([
    getDetailedAnalytics(),
    getAdminStats()
  ]);

  // Calculate conversion rates and additional metrics
  const conversionRate = basicStats.totalUsers > 0 ? ((basicStats.totalOrders / basicStats.totalUsers) * 100) : 0;
  const avgOrderValue = basicStats.totalOrders > 0 ? (analytics.overview.currentMonth.revenue / analytics.overview.currentMonth.orders) : 0;
  const vendorApprovalRate = basicStats.totalVendors > 0 ? ((basicStats.activeVendors / basicStats.totalVendors) * 100) : 0;

  return (
    
      <div className="p-6 space-y-8">
        {/* Header Section - Enhanced with better dark mode */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <BarChart3 className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Analytics Hub
                  </h1>
                  <p className="text-xl text-white/80 mt-2">
                    Comprehensive insights and performance metrics
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Quick Stats in Header */}
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Globe className="h-5 w-5 text-blue-300" />
                <span className="font-semibold">{basicStats.totalUsers} Users</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="font-semibold">{basicStats.activeVendors} Active Vendors</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Package className="h-5 w-5 text-purple-300" />
                <span className="font-semibold">{basicStats.totalProducts} Products</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Percent className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">{conversionRate.toFixed(1)}% Conversion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Monthly Revenue"
            value={formatPrice(analytics.overview.currentMonth.revenue)}
            gradient="from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700"
            icon={DollarSign}
            growth={analytics.overview.growth.revenue}
            description={`vs ${formatPrice(analytics.overview.lastMonth.revenue)} last month`}
          />
          
          <MetricCard
            title="Monthly Orders"
            value={analytics.overview.currentMonth.orders}
            gradient="from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700"
            icon={ShoppingCart}
            growth={analytics.overview.growth.orders}
            description={`vs ${analytics.overview.lastMonth.orders} last month`}
          />
          
          <MetricCard
            title="New Users"
            value={analytics.overview.currentMonth.users}
            gradient="from-purple-500 to-violet-600 dark:from-purple-600 dark:to-violet-700"
            icon={Users}
            growth={analytics.overview.growth.users}
            description={`vs ${analytics.overview.lastMonth.users} last month`}
          />
          
          <MetricCard
            title="Avg Order Value"
            value={formatPrice(avgOrderValue)}
            gradient="from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700"
            icon={Target}
            description={`${conversionRate.toFixed(1)}% conversion rate`}
          />
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Products"
            value={basicStats.totalProducts}
            gradient="from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700"
            icon={Package}
            description={`${basicStats.activeVendors} active vendors`}
          />
          
          <MetricCard
            title="Pending Vendors"
            value={basicStats.pendingVendors}
            gradient="from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700"
            icon={Clock}
            description={`${vendorApprovalRate.toFixed(1)}% approval rate`}
          />
          
          <MetricCard
            title="Total Revenue"
            value={formatPrice(basicStats.totalRevenue)}
            gradient="from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700"
            icon={CreditCard}
            description="All-time revenue"
          />
          
          <MetricCard
            title="Platform Health"
            value={`${Math.round((basicStats.activeVendors / (basicStats.totalVendors || 1)) * 100)}%`}
            gradient="from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700"
            icon={ThumbsUp}
            description="Vendor success rate"
          />
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">{/* Changed from lg:grid-cols-2 to xl:grid-cols-2 for better mobile experience */}
          {/* Revenue Trend Chart */}
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    Revenue Trends
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Monthly revenue over the last 12 months
                  </CardDescription>
                </div>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SimpleChart data={analytics.charts.revenueByMonth} type="line" />
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-slate-600 dark:text-slate-400">Monthly revenue trends</span>
                <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Growing
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* User Growth Chart */}
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    User Growth
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    New user registrations by month
                  </CardDescription>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SimpleChart data={analytics.charts.userGrowth} type="bar" />
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-slate-600 dark:text-slate-400">Total: {basicStats.totalUsers} users</span>
                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                  <Users className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device & Traffic Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{/* Improved responsive breakpoints */}
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Device Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.deviceStats && analytics.deviceStats.length > 0 ? (
                analytics.deviceStats.map((item: any) => (
                  <div key={item.device} className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      {item.device === 'Desktop' && <Monitor className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                      {item.device === 'Mobile' && <Smartphone className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                      {item.device === 'Tablet' && <Tablet className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{item.device}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className={`${item.device === 'Desktop' ? 'bg-blue-500' : item.device === 'Mobile' ? 'bg-green-500' : 'bg-purple-500'} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <Monitor className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No device usage data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Cities
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Most active cities in South Africa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.topLocations && analytics.topLocations.length > 0 ? (
                analytics.topLocations.map((item: any) => (
                  <div key={item.country} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.flag || '�️'}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{item.country}</span>
                    </div>
                    <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                      {item.users}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No location data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.performance && analytics.performance.metrics ? (
                analytics.performance.metrics.map((item: any) => (
                  <div key={item.metric} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.metric === 'Page Load Time' && <Zap className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                      {item.metric === 'Error Rate' && <CheckCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                      {item.metric === 'Uptime' && <ThumbsUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                      {item.metric === 'API Response' && <Activity className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                      <span className="text-sm text-slate-900 dark:text-white">{item.metric}</span>
                    </div>
                    <Badge 
                      variant={item.status === 'excellent' ? 'default' : 'secondary'}
                      className={cn(
                        item.status === 'excellent' && 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400',
                        item.status === 'good' && 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400'
                      )}
                    >
                      {item.value}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <Timer className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No performance data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Sales Performance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">{/* Changed from lg:grid-cols-2 to xl:grid-cols-2 for better mobile experience */}
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Latest platform activities and events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
                analytics.recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <div className={`p-2 ${activity.bgColor || 'bg-slate-100 dark:bg-slate-600'} rounded-lg`}>
                      {activity.type === 'vendor' && <Users className={`h-4 w-4 ${activity.color || 'text-blue-500'}`} />}
                      {activity.type === 'order' && <ShoppingCart className={`h-4 w-4 ${activity.color || 'text-green-500'}`} />}
                      {activity.type === 'product' && <CheckCircle className={`h-4 w-4 ${activity.color || 'text-emerald-500'}`} />}
                      {activity.type === 'payment' && <CreditCard className={`h-4 w-4 ${activity.color || 'text-purple-500'}`} />}
                      {activity.type === 'system' && <Zap className={`h-4 w-4 ${activity.color || 'text-orange-500'}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Performing Products
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Best sellers this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.performance && analytics.performance.topProducts && analytics.performance.topProducts.length > 0 ? (
                analytics.performance.topProducts.slice(0, 5).map((product: any, index: number) => (
                  <div key={product.id || index} className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-800/90 dark:to-slate-700/80 rounded-2xl border border-slate-200/60 dark:border-slate-600/40 hover:border-blue-300/60 dark:hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 hover:-translate-y-1">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/30 to-purple-50/30 dark:from-transparent dark:via-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Ranking badge - floating design */}
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-white dark:ring-slate-800">
                          {index + 1}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>

                    <div className="relative p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Product info section */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Product icon/image placeholder */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Package className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {product.name || `Product #${product.productId}`}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-3 py-1 font-medium"
                              >
                                {product.category || 'General'}
                              </Badge>
                              <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-700">
                                <ShoppingCart className="h-3 w-3" />
                                <span className="text-xs font-medium">
                                  {product.sales || product._count?.productId || 0} orders
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Revenue and growth section */}
                        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-3 sm:gap-2 sm:min-w-[140px]">
                          <div className="text-left sm:text-right">
                            <div className="flex items-center gap-2 sm:justify-end">
                              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <p className="text-xl sm:text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                                {formatPrice(product.revenue || product._sum?.price || 0)}
                              </p>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                              Total Revenue
                            </p>
                          </div>
                          
                          {product.growth && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 px-3 py-2 rounded-xl border border-green-200 dark:border-green-700 shadow-sm">
                              <div className="flex items-center gap-1">
                                <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-green-400" />
                                <span className="text-xs font-bold text-green-700 dark:text-green-300">
                                  +{product.growth}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Performance indicator bar */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-600/40">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                          <span>Performance</span>
                          <span>{Math.min(100, Math.round((product.sales || product._count?.productId || 0) * 10))}%</span>
                        </div>
                        <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{ 
                              width: `${Math.min(100, Math.round((product.sales || product._count?.productId || 0) * 10))}%`,
                              animation: 'pulse 2s infinite'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No product data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sales Funnel & Conversion Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">{/* Changed from lg:grid-cols-2 to xl:grid-cols-2 for better mobile experience */}
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Sales Funnel
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                User journey and conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.salesFunnel && analytics.salesFunnel.length > 0 ? (
                analytics.salesFunnel.map((stage: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{stage.count.toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                          {stage.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div 
                        className={`${stage.color || 'bg-blue-500'} h-3 rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No sales funnel data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="h-5 w-5" />
                Customer Satisfaction
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Reviews and ratings overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.customerSatisfaction ? (
                <>
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                      {analytics.customerSatisfaction.averageRating || '0.0'}
                    </div>
                    <div className="flex justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(analytics.customerSatisfaction.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      Based on {analytics.customerSatisfaction.totalReviews || 0} reviews
                    </p>
                  </div>
                  
                  {analytics.customerSatisfaction.ratingDistribution && analytics.customerSatisfaction.ratingDistribution.length > 0 ? (
                    analytics.customerSatisfaction.ratingDistribution.map((rating: any) => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm text-slate-900 dark:text-white">{rating.stars}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${rating.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{rating.count}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400 py-4">
                      <p>No rating distribution data</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No customer satisfaction data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    
  );
}
