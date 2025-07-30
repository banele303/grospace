import { requireVendor } from "@/app/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  Calendar as CalendarIcon, 
  Percent, 
  DollarSign, 
  Gift,
  Info,
  Save,
  Eye,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

export default async function CreatePromotionPage() {
  noStore();
  const { user, vendor } = await requireVendor();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/vendor/dashboard/promotions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Promotions
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-agricultural-800">Create Promotion</h1>
            <p className="text-agricultural-600 mt-1">
              Set up a new promotional campaign to boost your sales
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-agricultural-500 hover:bg-agricultural-600">
            <Save className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set up the basic details for your promotion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promotionName">Promotion Name</Label>
                <Input 
                  id="promotionName" 
                  placeholder="e.g., Summer Harvest Sale"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe your promotion to customers"
                  className="bg-white"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promoCode">Promotion Code (Optional)</Label>
                <Input 
                  id="promoCode" 
                  placeholder="e.g., SUMMER20"
                  className="bg-white"
                />
                <p className="text-xs text-gray-600">
                  Leave empty for automatic discounts, or add a code for customers to enter
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Discount Type */}
          <Card>
            <CardHeader>
              <CardTitle>Discount Type</CardTitle>
              <CardDescription>
                Choose how you want to discount your products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup defaultValue="percentage" className="space-y-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <div className="flex-1">
                    <Label htmlFor="percentage" className="flex items-center gap-2 cursor-pointer">
                      <Percent className="h-4 w-4" />
                      Percentage Discount
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Give customers a percentage off their purchase
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      placeholder="20" 
                      className="w-20"
                      min="1"
                      max="100"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <div className="flex-1">
                    <Label htmlFor="fixed" className="flex items-center gap-2 cursor-pointer">
                      <DollarSign className="h-4 w-4" />
                      Fixed Amount Discount
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Give customers a fixed rand amount off
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">R</span>
                    <Input 
                      type="number" 
                      placeholder="50" 
                      className="w-20"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="bogo" id="bogo" />
                  <div className="flex-1">
                    <Label htmlFor="bogo" className="flex items-center gap-2 cursor-pointer">
                      <Gift className="h-4 w-4" />
                      Buy One Get One (BOGO)
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Customer gets a free item when they buy one
                    </p>
                  </div>
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Get 1 Free</SelectItem>
                      <SelectItem value="50off">Get 50% Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Promotion Conditions</CardTitle>
              <CardDescription>
                Set conditions for when this promotion applies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Minimum Order Value</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="minOrder" />
                  <Label htmlFor="minOrder" className="text-sm">
                    Require minimum order value
                  </Label>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-sm text-gray-600">R</span>
                  <Input 
                    type="number" 
                    placeholder="100" 
                    className="w-32"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Usage Limits</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="totalLimit" />
                    <Label htmlFor="totalLimit" className="text-sm">
                      Limit total uses
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Input 
                      type="number" 
                      placeholder="100" 
                      className="w-32"
                      disabled
                    />
                    <span className="text-sm text-gray-600">total uses</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="customerLimit" />
                    <Label htmlFor="customerLimit" className="text-sm">
                      Limit uses per customer
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Input 
                      type="number" 
                      placeholder="1" 
                      className="w-32"
                      disabled
                    />
                    <span className="text-sm text-gray-600">per customer</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>
                Set when this promotion will be active
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Select start date
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Select end date
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="noEndDate" />
                <Label htmlFor="noEndDate" className="text-sm">
                  No end date (run until manually stopped)
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Apply to Products</CardTitle>
              <CardDescription>
                Choose which products this promotion applies to
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup defaultValue="all" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="allProducts" />
                  <Label htmlFor="allProducts" className="text-sm">All products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specificProducts" />
                  <Label htmlFor="specificProducts" className="text-sm">Specific products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="category" id="categoryProducts" />
                  <Label htmlFor="categoryProducts" className="text-sm">Product category</Label>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Select Products
                </Button>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">Tomatoes</Badge>
                  <Badge variant="outline">Carrots</Badge>
                  <Badge variant="outline">+3 more</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Promotion Preview</CardTitle>
              <CardDescription>
                How customers will see this promotion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Preview will appear here as you fill out the form
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Promotion Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium">Create urgency</h4>
                <p className="text-gray-600">Limited-time offers encourage quick purchases</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium">Clear messaging</h4>
                <p className="text-gray-600">Make the discount value obvious to customers</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium">Test and optimize</h4>
                <p className="text-gray-600">Monitor performance and adjust as needed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
