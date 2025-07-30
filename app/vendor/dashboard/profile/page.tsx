import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Leaf, 
  Award,
  Edit,
  Save,
  Camera,
  Store,
  UserRound
} from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import ImageUpload from "./components/image-upload";
import CoverImageUpload from "./components/cover-image-upload";
import ManageStores from "./components/manage-stores";
import { updateProfileImage } from "./actions";

async function getVendorProfile(vendorId: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      bio: true,
      website: true,
      logo: true,
      businessType: true,
      establishedYear: true,
      certifications: true,
      specialties: true,
      minimumOrder: true,
      deliveryRadius: true,
      farmSize: true,
      farmingType: true,
      approved: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          profileImage: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      },
      farmLocation: {
        select: {
          id: true,
          region: true,
          address: true,
          latitude: true,
          longitude: true,
        }
      },
    },
  });

  return vendor;
}

export default async function VendorProfilePage() {
  noStore();
  const { user, vendor } = await requireVendor();
  const vendorProfile = await getVendorProfile(vendor.id);

  if (!vendorProfile) {
    return <div>Vendor profile not found</div>;
  }

  return (
    <div className="space-y-8 dark:bg-zinc-900 p-6 rounded-xl">
      {/* Header with gradient underline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4 border-b border-agricultural-200 dark:border-agricultural-800 relative">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-agricultural-400 to-emerald-500 dark:from-agricultural-300 dark:to-emerald-400">
            Profile Settings
          </h1>
          <p className="text-agricultural-600 dark:text-agricultural-400 mt-1">
            Manage your vendor profile and business information
          </p>
          {/* Gradient line */}
          <div className="absolute -bottom-4 left-0 h-1 w-32 bg-gradient-to-r from-agricultural-400 to-emerald-500"></div>
        </div>
        <Button className="bg-gradient-to-r from-agricultural-500 to-emerald-600 hover:from-agricultural-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-900/20">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="dark:bg-zinc-800/50 dark:backdrop-blur-lg dark:border-zinc-700/50 dark:shadow-xl dark:shadow-emerald-900/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-agricultural-500/5 to-emerald-500/5 pointer-events-none"></div>
            <CardHeader className="text-center relative z-10">
              {/* Client-side Image Upload Components with tabs */}
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 dark:bg-zinc-900/50">
                  <TabsTrigger 
                    value="profile" 
                    className="flex items-center gap-1 data-[state=active]:dark:bg-agricultural-800/50 data-[state=active]:dark:text-agricultural-100 dark:text-zinc-400 dark:hover:text-agricultural-200 transition-colors"
                  >
                    <UserRound className="h-4 w-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="store" 
                    className="flex items-center gap-1 data-[state=active]:dark:bg-agricultural-800/50 data-[state=active]:dark:text-agricultural-100 dark:text-zinc-400 dark:hover:text-agricultural-200 transition-colors"
                  >
                    <Store className="h-4 w-4" />
                    <span>Store/Farm</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-2">
                  <ImageUpload
                    initialImage={vendorProfile.user.profileImage || null}
                    userId={vendorProfile.user.id}
                    name={vendorProfile.name}
                    formAction="/api/profile/update-image"
                    imageType="profile"
                    label="Personal Profile Image"
                  />
                </TabsContent>
                <TabsContent value="store" className="mt-2">
                  <div className="space-y-4">
                    {/* Store Selector */}
                    <div className="mb-4 px-2">
                      <label htmlFor="store-select" className="block text-sm font-medium mb-2 dark:text-agricultural-300">Select Store</label>
                      <div className="flex space-x-2">
                        <select 
                          id="store-select"
                          className="flex-1 rounded-md border border-agricultural-300 dark:border-zinc-700 py-2 px-3 text-sm bg-white dark:bg-zinc-800 dark:text-agricultural-200"
                          defaultValue={vendorProfile.id}
                        >
                          <option value={vendorProfile.id}>{vendorProfile.name}</option>
                          {/* Additional stores would be mapped here */}
                        </select>
                        <Button className="dark:bg-zinc-800 dark:text-agricultural-300 dark:hover:bg-zinc-700 dark:border dark:border-zinc-700" variant="outline" size="sm">
                          <Store className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  
                    {/* Cover Image Upload */}
                    <CoverImageUpload
                      initialImage={vendorProfile.logo || null}
                      userId={vendorProfile.user.id}
                      vendorId={vendorProfile.id}
                      formAction="/api/profile/update-image"
                      imageType="store"
                    />
                    <p className="text-xs text-center dark:text-agricultural-400 mt-1">
                      This cover image will appear on your store page
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              <CardTitle className="text-xl mt-4 dark:text-agricultural-100">{vendorProfile.name}</CardTitle>
              <CardDescription className="dark:text-agricultural-300">{vendorProfile.email}</CardDescription>
              <div className="flex justify-center mt-3">
                <Badge 
                  variant={vendorProfile.approved ? "default" : "secondary"}
                  className={`${vendorProfile.approved ? 'bg-gradient-to-r from-agricultural-500 to-emerald-600 hover:from-agricultural-600 hover:to-emerald-700 border-0' : 'dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'}`}
                >
                  {vendorProfile.approved ? "Approved" : "Pending Approval"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {/* Profile info with hover effects */}
              <div className="p-3 rounded-lg transition-all duration-300 hover:bg-agricultural-50 dark:hover:bg-agricultural-900/20 group">
                <div className="flex items-center gap-2 text-sm text-agricultural-600 dark:text-agricultural-400 group-hover:text-agricultural-700 dark:group-hover:text-agricultural-300">
                  <Calendar className="h-4 w-4 text-agricultural-500 dark:text-agricultural-400 group-hover:text-agricultural-600 dark:group-hover:text-agricultural-300" />
                  <span>Joined {new Date(vendorProfile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {vendorProfile.phone && (
                <div className="p-3 rounded-lg transition-all duration-300 hover:bg-agricultural-50 dark:hover:bg-agricultural-900/20 group">
                  <div className="flex items-center gap-2 text-sm text-agricultural-600 dark:text-agricultural-400 group-hover:text-agricultural-700 dark:group-hover:text-agricultural-300">
                    <Phone className="h-4 w-4 text-agricultural-500 dark:text-agricultural-400 group-hover:text-agricultural-600 dark:group-hover:text-agricultural-300" />
                    <span>{vendorProfile.phone}</span>
                  </div>
                </div>
              )}
              
              {vendorProfile.address && (
                <div className="p-3 rounded-lg transition-all duration-300 hover:bg-agricultural-50 dark:hover:bg-agricultural-900/20 group">
                  <div className="flex items-center gap-2 text-sm text-agricultural-600 dark:text-agricultural-400 group-hover:text-agricultural-700 dark:group-hover:text-agricultural-300">
                    <MapPin className="h-4 w-4 text-agricultural-500 dark:text-agricultural-400 group-hover:text-agricultural-600 dark:group-hover:text-agricultural-300" />
                    <span>{vendorProfile.address}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="mt-6 dark:bg-zinc-800/50 dark:backdrop-blur-lg dark:border-zinc-700/50 dark:shadow-xl dark:shadow-emerald-900/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-agricultural-500/5 to-emerald-500/5 pointer-events-none"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 dark:text-agricultural-100">
                <Award className="h-5 w-5 text-agricultural-500 dark:text-agricultural-400" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              {vendorProfile.certifications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {vendorProfile.certifications.map((cert, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-green-50/80 dark:bg-agricultural-900/30 dark:border-agricultural-700/50 dark:text-agricultural-200 hover:bg-agricultural-100 dark:hover:bg-agricultural-800/50 transition-colors"
                    >
                      <Leaf className="h-3 w-3 mr-1 text-agricultural-600 dark:text-agricultural-400" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground dark:text-zinc-400">No certifications added yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card className="dark:bg-zinc-800/50 dark:backdrop-blur-lg dark:border-zinc-700/50 dark:shadow-xl dark:shadow-emerald-900/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-agricultural-500/5 to-emerald-500/5 pointer-events-none"></div>
            <CardHeader className="relative z-10 border-b border-agricultural-100 dark:border-agricultural-800/50 pb-4">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-agricultural-600 to-emerald-600 dark:from-agricultural-400 dark:to-emerald-400">
                Business Information
              </CardTitle>
              <CardDescription className="dark:text-zinc-400">
                Update your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="dark:text-agricultural-300">Business Name</Label>
                  <Input 
                    id="businessName" 
                    defaultValue={vendorProfile.name}
                    className="bg-white dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-agricultural-200 dark:focus:border-agricultural-500/50 focus-visible:ring-agricultural-300/25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-agricultural-300">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    defaultValue={vendorProfile.email}
                    className="bg-white dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-agricultural-200 dark:focus:border-agricultural-500/50 focus-visible:ring-agricultural-300/25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="dark:text-agricultural-300">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    defaultValue={vendorProfile.phone || ""}
                    placeholder="Enter phone number"
                    className="bg-white dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-agricultural-200 dark:placeholder:text-zinc-500 dark:focus:border-agricultural-500/50 focus-visible:ring-agricultural-300/25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="dark:text-agricultural-300">Website</Label>
                  <Input 
                    id="website" 
                    type="url"
                    defaultValue={(vendorProfile as any).website || ""}
                    placeholder="https://your-website.com"
                    className="bg-white dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-agricultural-200 dark:placeholder:text-zinc-500 dark:focus:border-agricultural-500/50 focus-visible:ring-agricultural-300/25"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="dark:text-agricultural-300">Business Address</Label>
                <Textarea 
                  id="address"
                  defaultValue={vendorProfile.address || ""}
                  placeholder="Enter your business address"
                  className="bg-white dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-agricultural-200 dark:placeholder:text-zinc-500 dark:focus:border-agricultural-500/50 focus-visible:ring-agricultural-300/25"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="dark:text-agricultural-300">Business Description</Label>
                <Textarea 
                  id="bio"
                  defaultValue={vendorProfile.bio || ""}
                  placeholder="Tell customers about your business, farming practices, and products"
                  className="bg-white dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-agricultural-200 dark:placeholder:text-zinc-500 dark:focus:border-agricultural-500/50 focus-visible:ring-agricultural-300/25"
                  rows={4}
                />
              </div>

              <Separator className="dark:bg-agricultural-800/50" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Farm Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                    <Input 
                      id="farmSize" 
                      type="number"
                      defaultValue={(vendorProfile as any).farmSize || ""}
                      placeholder="Enter farm size"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmingType">Farming Type</Label>
                    <Input 
                      id="farmingType"
                      defaultValue={(vendorProfile as any).farmingType || ""}
                      placeholder="e.g., Organic, Conventional, Hydroponic"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-agricultural-500 hover:bg-agricultural-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Store/Farm Management Section */}
          <div className="mt-6">
            {/* @ts-ignore - Client component in server component */}
            <ManageStores 
              userId={vendorProfile.user.id}
              existingStores={[
                // Convert the current vendor to a store format for the component
                {
                  id: vendorProfile.id,
                  name: vendorProfile.name,
                  description: vendorProfile.bio || "",
                  type: vendorProfile.businessType || "Farm",
                  isActive: true,
                  isPrimary: true
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
