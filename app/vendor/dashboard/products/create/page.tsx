import { getVendorStatus } from "@/app/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Package, 
  Upload,
  ArrowLeft,
  Save,
  Eye,
  AlertCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import { CreateProductClient } from "@/app/components/vendor/CreateProductClient";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { PendingApprovalCard } from "@/app/components/vendor/PendingApprovalCard";

const categories = [
  "seeds",
  "produce", 
  "livestock",
  "equipment",
  "fertilizer",
  "organic",
  "services"
];

const seasonality = [
  "spring",
  "summer", 
  "autumn",
  "winter",
  "year-round"
];

export default async function CreateProductPage() {
  const vendorStatus = await getVendorStatus();
  
  // If vendor is pending approval, show pending state
  if (!vendorStatus.success && vendorStatus.isPending) {
    return (
      <PendingApprovalCard
        title="Create Products - Approval Required"
        description="Your vendor account is currently under review. Once approved, you'll be able to create and publish products in our marketplace."
        feature="create products"
        backUrl="/vendor/dashboard/products"
        backLabel="Back to Products"
      />
    );
  }

  // If there's another error, handle it
  if (!vendorStatus.success) {
    return redirect("/auth-error");
  }

  const { user, vendor } = vendorStatus;
  
  // Debug user object
  console.log("User from vendorStatus:", user);
  console.log("Vendor from vendorStatus:", vendor);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/vendor/dashboard/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-agricultural-800">Add New Product</h1>
            <p className="text-agricultural-600 mt-1">
              Create a new product for your agricultural marketplace
            </p>
          </div>
        </div>
      </div>

      {/* Product Creation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CreateProductClient 
            vendorId={vendor.id} 
            userId={user.id || vendor.userId} // Try to use user.id or fall back to vendor.userId
            categories={categories} 
            seasonality={seasonality} 
          />
        </div>

        {/* Help Sidebar */}
        <div className="space-y-6">
          <Card className="border-agricultural-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-agricultural-800 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-agricultural-800 mb-2">Product Images</h4>
                <p className="text-sm text-agricultural-600">
                  Upload high-quality images showing your product clearly. First image will be the main display image.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-agricultural-800 mb-2">Pricing</h4>
                <p className="text-sm text-agricultural-600">
                  Set competitive prices in South African Rands (R). Consider your costs and market rates.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-agricultural-800 mb-2">Description</h4>
                <p className="text-sm text-agricultural-600">
                  Write detailed descriptions including growing conditions, harvest time, and usage instructions.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-agricultural-800 mb-2">Categories</h4>
                <p className="text-sm text-agricultural-600">
                  Choose the most appropriate category to help customers find your product easily.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600">
                Use the preview button to see how your product will appear to customers before publishing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
