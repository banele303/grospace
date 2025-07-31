import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  Package, 
  ShoppingCart, 
  Calendar,
  User,
  Mail,
  MapPin,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building,
  Phone,
  Globe,
  Star,
  DollarSign
} from "lucide-react";
import { getAllVendors } from "@/app/lib/admin-actions";
import { VendorActions } from "../../components/admin/VendorActions";
import { unstable_noStore as noStore } from "next/cache";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default async function AdminVendorsPage() {
  noStore();
  
  const vendors = await getAllVendors();

  const getStatusBadge = (approved: boolean) => {
    if (approved) {
      return {
        variant: "default" as const,
        text: "APPROVED",
        icon: CheckCircle2,
        className: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800"
      };
    }
    return {
      variant: "secondary" as const,
      text: "PENDING",
      icon: Clock,
      className: "bg-amber-500/10 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800"
    };
  };

  const approvedCount = vendors.filter(v => v.approved).length;
  const pendingCount = vendors.filter(v => !v.approved).length;

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 dark:from-violet-900 dark:via-purple-900 dark:to-blue-900 p-8 md:p-12 text-white">
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Store className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Vendor Management
                  </h1>
                  <p className="text-xl text-white/80 mt-2">
                    Monitor, approve, and manage vendor partnerships
                  </p>
                </div>
              </div>
              
              {/* Quick Stats in Header */}
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <span className="font-semibold">{vendors.length} Total</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <CheckCircle2 className="h-5 w-5 text-green-300" />
                  <span className="font-semibold">{approvedCount} Active</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock className="h-5 w-5 text-amber-300" />
                  <span className="font-semibold">{pendingCount} Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Total Vendors Card */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-2xl shadow-blue-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Vendors</p>
                    <p className="text-3xl font-bold mt-2">{vendors.length}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-blue-200" />
                      <span className="text-blue-200 text-sm">All time</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Store className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Vendors Card */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white shadow-2xl shadow-amber-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">Pending Review</p>
                    <p className="text-3xl font-bold mt-2">{pendingCount}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <AlertCircle className="h-4 w-4 text-amber-200" />
                      <span className="text-amber-200 text-sm">Needs attention</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Clock className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Approved Vendors Card */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600 text-white shadow-2xl shadow-emerald-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Approved</p>
                    <p className="text-3xl font-bold mt-2">{approvedCount}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                      <span className="text-emerald-200 text-sm">Active sellers</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Impact Card */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 text-white shadow-2xl shadow-purple-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Revenue Impact</p>
                    <p className="text-3xl font-bold mt-2">
                      {((approvedCount / (vendors.length || 1)) * 100).toFixed(0)}%
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <DollarSign className="h-4 w-4 text-purple-200" />
                      <span className="text-purple-200 text-sm">Approval rate</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Star className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modern Vendors List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Vendor Directory
              </h2>
              <Badge variant="outline" className="text-slate-600 dark:text-slate-300">
                {vendors.length} vendors
              </Badge>
            </div>

            <div className="grid gap-6">
              {vendors.map((vendor) => {
                const statusBadge = getStatusBadge(vendor.approved);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <Card key={vendor.id} className="group relative overflow-hidden border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/70 transition-all duration-500 hover:-translate-y-1">
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
                    
                    <div className="relative">
                      <CardHeader className="pb-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          {/* Vendor Info */}
                          <div className="flex items-center gap-4">
                            {/* Avatar with Gradient */}
                            <div className="relative">
                              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30">
                                {vendor.name.charAt(0).toUpperCase()}
                              </div>
                              {vendor.approved && (
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                  {vendor.name}
                                </CardTitle>
                                <Badge className={cn("font-semibold", statusBadge.className)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusBadge.text}
                                </Badge>
                              </div>
                              
                              {/* Owner Info */}
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {vendor.user.firstName} {vendor.user.lastName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {vendor.user.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDistanceToNow(new Date(vendor.createdAt))} ago
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <VendorActions vendor={vendor} />
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Business Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Business Info Card */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <h4 className="font-semibold text-slate-900 dark:text-white">Business Info</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-600 dark:text-slate-400">Category:</span>
                                <Badge variant="outline" className="text-xs">
                                  {vendor.businessType || 'Not specified'}
                                </Badge>
                              </div>
                              {vendor.website && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-3 w-3 text-slate-500" />
                                  <a 
                                    href={vendor.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    {vendor.website}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Contact Info Card */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                                <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <h4 className="font-semibold text-slate-900 dark:text-white">Contact</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                              {vendor.phone ? (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3 text-slate-500" />
                                  <span className="text-slate-700 dark:text-slate-300">{vendor.phone}</span>
                                </div>
                              ) : (
                                <span className="text-slate-500 italic">No phone provided</span>
                              )}
                              {vendor.address ? (
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-3 w-3 text-slate-500 mt-0.5" />
                                  <span className="text-slate-700 dark:text-slate-300">{vendor.address}</span>
                                </div>
                              ) : (
                                <span className="text-slate-500 italic">No address provided</span>
                              )}
                            </div>
                          </div>

                          {/* Products Card */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <h4 className="font-semibold text-slate-900 dark:text-white">Products</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Total Products:</span>
                                <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                                  {vendor._count?.products || 0}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {vendor.bio && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Description</h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {vendor.bio}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>

            {vendors.length === 0 && (
              <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-6">
                    <Store className="h-16 w-16 text-slate-400 dark:text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No vendors found</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
                    No vendor applications have been submitted yet. When vendors apply, they will appear here for review.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
}
