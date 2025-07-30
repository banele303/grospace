import { requireVendor } from "@/app/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Pause,
  Play,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";

// Mock data for promotions - in real app, this would come from database
const mockPromotions = [
  {
    id: "1",
    name: "Summer Harvest Sale",
    description: "20% off all seasonal vegetables",
    type: "percentage",
    value: 20,
    status: "active",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-02-15"),
    usageCount: 45,
    usageLimit: 100,
    revenue: 2500,
    products: ["Tomatoes", "Cucumbers", "Bell Peppers"],
  },
  {
    id: "2",
    name: "Bulk Order Discount",
    description: "R50 off orders over R500",
    type: "fixed",
    value: 50,
    status: "active",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    usageCount: 23,
    usageLimit: 50,
    revenue: 1800,
    products: ["All Products"],
  },
  {
    id: "3",
    name: "New Customer Welcome",
    description: "15% off first order",
    type: "percentage",
    value: 15,
    status: "paused",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    usageCount: 67,
    usageLimit: 200,
    revenue: 3200,
    products: ["All Products"],
  },
  {
    id: "4",
    name: "Weekend Special",
    description: "Buy 2 get 1 free on herbs",
    type: "bogo",
    value: 0,
    status: "expired",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-14"),
    usageCount: 34,
    usageLimit: 100,
    revenue: 890,
    products: ["Basil", "Parsley", "Cilantro"],
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "paused":
      return "bg-yellow-100 text-yellow-800";
    case "expired":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default async function VendorPromotionsPage() {
  noStore();
  const { user, vendor } = await requireVendor();

  const activePromotions = mockPromotions.filter(p => p.status === "active").length;
  const totalRevenue = mockPromotions.reduce((sum, p) => sum + p.revenue, 0);
  const totalUsage = mockPromotions.reduce((sum, p) => sum + p.usageCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-agricultural-800 dark:text-white bg-clip-text dark:bg-gradient-to-r from-agricultural-300 to-emerald-300 dark:text-transparent">
            Promotions & Discounts
          </h1>
          <p className="text-agricultural-600 dark:text-agricultural-400 mt-1">
            Create and manage promotional campaigns to boost sales
          </p>
        </div>
        <Button asChild className="bg-agricultural-500 hover:bg-agricultural-600 dark:bg-agricultural-700 dark:hover:bg-agricultural-600 dark:text-white transition-all duration-200 shadow-md hover:shadow-xl dark:shadow-emerald-900/20">
          <Link href="/vendor/dashboard/promotions/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Link>
        </Button>
      </div>

      {/* Promotion Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dark:bg-zinc-900/50 dark:border-zinc-800 dark:backdrop-blur-sm dark:shadow-lg dark:shadow-emerald-900/10 transition-all duration-300 hover:shadow-md dark:hover:shadow-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800 dark:text-agricultural-100">
                  {activePromotions}
                </p>
                <p className="text-sm text-agricultural-600 dark:text-agricultural-400">Active Promotions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900/50 dark:border-zinc-800 dark:backdrop-blur-sm dark:shadow-lg dark:shadow-emerald-900/10 transition-all duration-300 hover:shadow-md dark:hover:shadow-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800 dark:text-agricultural-100">
                  {formatPrice(totalRevenue)}
                </p>
                <p className="text-sm text-agricultural-600 dark:text-agricultural-400">Revenue Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900/50 dark:border-zinc-800 dark:backdrop-blur-sm dark:shadow-lg dark:shadow-emerald-900/10 transition-all duration-300 hover:shadow-md dark:hover:shadow-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800 dark:text-agricultural-100">
                  {totalUsage}
                </p>
                <p className="text-sm text-agricultural-600 dark:text-agricultural-400">Total Uses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900/50 dark:border-zinc-800 dark:backdrop-blur-sm dark:shadow-lg dark:shadow-emerald-900/10 transition-all duration-300 hover:shadow-md dark:hover:shadow-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800 dark:text-agricultural-100">
                  {((totalUsage / mockPromotions.reduce((sum, p) => sum + p.usageLimit, 0)) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-agricultural-600 dark:text-agricultural-400">Avg Usage Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions List */}
      <Card className="dark:bg-zinc-900/50 dark:border-zinc-800 dark:backdrop-blur-sm dark:shadow-lg dark:shadow-emerald-900/10">
        <CardHeader>
          <CardTitle className="dark:text-agricultural-100 flex items-center gap-2">
            <span className="bg-clip-text bg-gradient-to-r from-agricultural-500 to-emerald-400 dark:from-agricultural-300 dark:to-emerald-300 text-transparent">Your Promotions</span>
          </CardTitle>
          <CardDescription className="dark:text-zinc-400">
            Manage your promotional campaigns and track their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPromotions.map((promotion) => (
              <div key={promotion.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-6 dark:bg-zinc-800/30 transition-all duration-300 hover:shadow-sm dark:hover:shadow-agricultural-900/10">
                <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-agricultural-800 dark:text-agricultural-200">
                        {promotion.name}
                      </h3>
                      <Badge className={`${getStatusColor(promotion.status)} dark:bg-opacity-20 dark:border dark:border-current`}>
                        {promotion.status}
                      </Badge>
                    </div>
                    <p className="text-agricultural-600 dark:text-zinc-400 mb-2">{promotion.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-agricultural-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 dark:text-agricultural-400" />
                        <span>
                          {promotion.startDate.toLocaleDateString()} - {promotion.endDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 dark:text-agricultural-400" />
                        <span>
                          {promotion.type === "percentage" ? `${promotion.value}% off` : 
                           promotion.type === "fixed" ? `${formatPrice(promotion.value)} off` : 
                           "Buy 2 Get 1 Free"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" className="dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-agricultural-300 dark:border-zinc-700">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm" className="dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-agricultural-300 dark:border-zinc-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {promotion.status === "active" ? (
                      <Button variant="outline" size="sm" className="dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-yellow-300 dark:border-zinc-700">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    ) : promotion.status === "paused" ? (
                      <Button variant="outline" size="sm" className="dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-green-300 dark:border-zinc-700">
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    ) : null}
                    <Button variant="outline" size="sm" className="dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-red-400 dark:border-zinc-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="dark:bg-zinc-800/50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-agricultural-700 dark:text-agricultural-300 mb-2">Usage Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm dark:text-zinc-400">
                        <span>{promotion.usageCount} used</span>
                        <span>{promotion.usageLimit} limit</span>
                      </div>
                      <Progress 
                        value={(promotion.usageCount / promotion.usageLimit) * 100} 
                        className="h-2 dark:bg-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="dark:bg-zinc-800/50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-agricultural-700 dark:text-agricultural-300 mb-2">Revenue Generated</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatPrice(promotion.revenue)}
                    </p>
                  </div>

                  <div className="dark:bg-zinc-800/50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-agricultural-700 dark:text-agricultural-300 mb-2">Applied Products</h4>
                    <div className="flex flex-wrap gap-1">
                      {promotion.products.slice(0, 3).map((product, index) => (
                        <Badge key={index} variant="outline" className="text-xs dark:bg-zinc-700 dark:border-zinc-600 dark:text-agricultural-200">
                          {product}
                        </Badge>
                      ))}
                      {promotion.products.length > 3 && (
                        <Badge variant="outline" className="text-xs dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-400">
                          +{promotion.products.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mockPromotions.length === 0 && (
            <div className="text-center py-12 dark:bg-zinc-800/30 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8">
              <div className="bg-agricultural-100 dark:bg-agricultural-900/30 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Target className="h-12 w-12 text-agricultural-600 dark:text-agricultural-300 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 bg-clip-text bg-gradient-to-r from-agricultural-500 to-emerald-400 dark:from-agricultural-300 dark:to-emerald-300 text-transparent">No promotions yet</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                Create your first promotional campaign to boost sales and attract customers.
              </p>
              <Button asChild className="bg-agricultural-500 hover:bg-agricultural-600 dark:bg-agricultural-700 dark:hover:bg-agricultural-600 dark:text-white transition-all duration-200 shadow-md hover:shadow-xl dark:shadow-emerald-900/20">
                <Link href="/vendor/dashboard/promotions/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Promotion
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
