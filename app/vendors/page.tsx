import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Star, 
  Award, 
  ArrowRight,
  Leaf,
  Users,
  Package,
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  Globe
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { Footer } from "../components/storefront/Footer";
import { VendorsLayout } from "./VendorsLayout";

interface VendorsPageProps {
  searchParams?: {
    search?: string;
    category?: string;
    page?: string;
  };
}

async function getAllVendors({ search, category, page = 1 }: { search?: string; category?: string; page?: number }) {
  noStore();
  
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  let whereClause: any = {
    approved: true,
  };

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { bio: { contains: search, mode: 'insensitive' } },
      { specialties: { has: search } },
    ];
  }

  if (category) {
    whereClause.specialties = { has: category };
  }

  const [vendors, totalCount] = await Promise.all([
    prisma.vendor.findMany({
      where: whereClause,
      include: {
        products: {
          where: { status: 'published' },
          take: 3,
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
        _count: {
          select: {
            products: {
              where: { status: 'published' }
            }
          }
        }
      },
      skip: skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.vendor.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return { vendors, totalPages };
}

async function getVendorCategories() {
  noStore();
  
  const vendors = await prisma.vendor.findMany({
    where: { approved: true },
    select: { specialties: true },
  });

  const categories = new Set<string>();
  vendors.forEach(vendor => {
    vendor.specialties?.forEach(specialty => categories.add(specialty));
  });

  return Array.from(categories).sort();
}

function LoadingState() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-muted mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-96 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
  const search = searchParams?.search;
  const category = searchParams?.category;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const [{ vendors, totalPages }, categories, totalVendors] = await Promise.all([
    getAllVendors({ search, category, page }),
    getVendorCategories(),
    prisma.vendor.count({ where: { approved: true } }),
  ]);

  return (
    <VendorsLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 px-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 1px, transparent 1px),
                             radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-white drop-shadow-lg">
              Meet Our Vendors
            </h1>
          </div>
          <p className="text-white/95 max-w-4xl mx-auto text-xl leading-relaxed mb-12 drop-shadow-sm">
            Discover our curated network of premium local farmers and producers who bring you the freshest, 
            highest-quality agricultural products straight from their farms to your table.
          </p>
          
          {/* Stats Cards */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="bg-white/25 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/30 shadow-2xl">
              <div className="text-4xl font-bold text-white mb-2">{totalVendors}+</div>
              <div className="text-white/90 font-medium">Trusted Vendors</div>
            </div>
            <div className="bg-white/25 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/30 shadow-2xl">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-white/90 font-medium">Quality Verified</div>
            </div>
            <div className="bg-white/25 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/30 shadow-2xl">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/90 font-medium">Fresh Supply</div>
            </div>
          </div>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-gray-50 px-10 py-4 text-lg font-bold shadow-2xl rounded-2xl border-2 border-white/50 hover:scale-105 transition-all duration-300"
            >
              <Link href="/vendors/register">
                <Globe className="w-6 h-6 mr-3" />
                Become a Vendor
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-10 py-4 text-lg font-bold rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300"
            >
              <Link href="/products">
                <TrendingUp className="w-6 h-6 mr-3" />
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 px-6 bg-white border-b-2 border-gray-100">
        <div className="container mx-auto">
          <form method="GET" action="/vendors" className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-2xl">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  name="search"
                  placeholder="Search vendors by name, location, or specialty..."
                  defaultValue={search}
                  className="pl-16 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Filter className="h-6 w-6 text-gray-500" />
                <select 
                  name="category"
                  defaultValue={category || ""}
                  className="px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300 min-w-[250px]"
                >
                  <option value="">All Specialties</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              {/* Search Button */}
              <Button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
              
              {/* Clear Filters Button */}
              {(search || category) && (
                <Button 
                  asChild
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-4 rounded-2xl transition-all duration-300"
                >
                  <Link href="/vendors">
                    Clear Filters
                  </Link>
                </Button>
              )}
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 shadow-lg">
                <Button variant="default" size="sm" className="bg-emerald-500 text-white rounded-xl shadow-md">
                  <Package className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white">
                  <Users className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Vendors Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <Suspense fallback={<LoadingState />}>
            {vendors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No vendors found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <>
                {/* Results Count and Sort */}
                <div className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {search || category ? 'Search Results' : 'Featured Vendors'}
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Showing <span className="font-semibold text-emerald-600">{vendors.length}</span> of <span className="font-semibold">{totalVendors}</span> verified vendors
                      {search && (
                        <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                          for &quot;{search}&quot;
                        </span>
                      )}
                      {category && (
                        <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          in &quot;{category}&quot;
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {/* Sort Options */}
                  <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                    <span className="text-gray-700 font-medium">Sort by:</span>
                    <select className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white">
                      <option>Newest First</option>
                      <option>Most Products</option>
                      <option>Highest Rated</option>
                      <option>A-Z</option>
                    </select>
                  </div>
                </div>

                {/* Vendor Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {vendors.map((vendor, index) => (
                    <Card key={vendor.id} className="group relative bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden rounded-3xl">
                      {/* Verified Badge */}
                      <div className="absolute top-6 right-6 z-20">
                        <Badge className="bg-emerald-500 text-white font-bold px-3 py-2 shadow-lg border-0 rounded-full">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </Badge>
                      </div>

                      {/* Ranking Badge */}
                      {index < 3 && (
                        <div className="absolute top-6 left-6 z-20">
                          <Badge className={`
                            ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : ''}
                            ${index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : ''}
                            ${index === 2 ? 'bg-gradient-to-r from-amber-600 to-yellow-600' : ''}
                            text-white font-bold px-3 py-2 shadow-lg border-0 rounded-full
                          `}>
                            #{index + 1} Top Vendor
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="pb-4 relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
                        <div className="flex items-center gap-4 relative z-10 pt-4">
                          <Avatar className="h-24 w-24 border-4 border-white shadow-2xl ring-4 ring-emerald-100">
                            <AvatarImage src={vendor.logo || undefined} alt={vendor.name} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-200 to-green-300 text-emerald-800 text-2xl font-bold">
                              {vendor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                              {vendor.name}
                            </CardTitle>
                            {vendor.address && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/80 rounded-full px-3 py-1">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate font-medium">{vendor.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6 p-6">
                        {/* Vendor Bio */}
                        <div className="space-y-4">
                          {vendor.bio && (
                            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed bg-gray-50 p-4 rounded-2xl">
                              {vendor.bio}
                            </p>
                          )}
                          
                          {/* Specialties */}
                          {vendor.specialties && vendor.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {vendor.specialties.slice(0, 3).map((specialty) => (
                                <Badge 
                                  key={specialty} 
                                  variant="secondary" 
                                  className="bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-2 rounded-full border border-emerald-200"
                                >
                                  <Leaf className="w-3 h-3 mr-1" />
                                  {specialty}
                                </Badge>
                              ))}
                              {vendor.specialties.length > 3 && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs px-3 py-2 rounded-full">
                                  +{vendor.specialties.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Certifications */}
                          {vendor.certifications && vendor.certifications.length > 0 && (
                            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                              <Award className="h-5 w-5 text-yellow-600" />
                              <span className="text-xs text-yellow-800 font-medium">
                                {vendor.certifications.slice(0, 2).join(', ')}
                                {vendor.certifications.length > 2 && ` +${vendor.certifications.length - 2} more`}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Count */}
                        {vendor._count.products > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                              <Package className="h-5 w-5 text-emerald-600" />
                              Available Products
                            </h4>
                            <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                              <div className="text-3xl font-bold text-emerald-700 mb-1">
                                {vendor._count.products}
                              </div>
                              <div className="text-emerald-600 font-medium">
                                Products Available
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between py-4 border-t-2 border-gray-100">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-full">
                              <Package className="h-4 w-4 text-emerald-600" />
                              <span className="font-bold text-emerald-700">{vendor._count.products}</span>
                              <span className="text-emerald-600">products</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm bg-yellow-50 px-3 py-2 rounded-full">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span className="font-bold text-yellow-700">4.8</span>
                            <span className="text-yellow-600">(124 reviews)</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button 
                          asChild 
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl py-3 text-lg font-bold group/btn"
                        >
                          <Link href={`/vendor/${vendor.id}`} className="flex items-center justify-center gap-3">
                            <Globe className="h-5 w-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                            Visit Store
                            <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-16">
                    <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100">
                      {/* Previous Button */}
                      {page > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="hover:bg-emerald-50 hover:text-emerald-600 rounded-xl px-4 py-2"
                        >
                          <Link 
                            href={{
                              pathname: "/vendors",
                              query: { 
                                ...(search && { search }), 
                                ...(category && { category }), 
                                page: page - 1 
                              }
                            }}
                          >
                            Previous
                          </Link>
                        </Button>
                      )}

                      {/* Page Numbers */}
                      {(() => {
                        const pages = [];
                        const maxVisiblePages = 5;
                        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                        // Adjust start page if we're near the end
                        if (endPage - startPage + 1 < maxVisiblePages) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }

                        // First page
                        if (startPage > 1) {
                          pages.push(
                            <Button
                              key={1}
                              variant="ghost"
                              size="sm"
                              asChild
                              className="hover:bg-emerald-50 hover:text-emerald-600 rounded-xl px-4 py-2"
                            >
                              <Link 
                                href={{
                                  pathname: "/vendors",
                                  query: { 
                                    ...(search && { search }), 
                                    ...(category && { category }), 
                                    page: 1 
                                  }
                                }}
                              >
                                1
                              </Link>
                            </Button>
                          );
                          
                          if (startPage > 2) {
                            pages.push(
                              <span key="start-ellipsis" className="px-2 py-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                        }

                        // Visible page range
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <Button
                              key={i}
                              variant={page === i ? "default" : "ghost"}
                              size="sm"
                              asChild
                              className={page === i 
                                ? "bg-emerald-600 text-white rounded-xl shadow-lg px-4 py-2" 
                                : "hover:bg-emerald-50 hover:text-emerald-600 rounded-xl px-4 py-2"
                              }
                            >
                              <Link 
                                href={{
                                  pathname: "/vendors",
                                  query: { 
                                    ...(search && { search }), 
                                    ...(category && { category }), 
                                    page: i 
                                  }
                                }}
                              >
                                {i}
                              </Link>
                            </Button>
                          );
                        }

                        // Last page
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <span key="end-ellipsis" className="px-2 py-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          
                          pages.push(
                            <Button
                              key={totalPages}
                              variant="ghost"
                              size="sm"
                              asChild
                              className="hover:bg-emerald-50 hover:text-emerald-600 rounded-xl px-4 py-2"
                            >
                              <Link 
                                href={{
                                  pathname: "/vendors",
                                  query: { 
                                    ...(search && { search }), 
                                    ...(category && { category }), 
                                    page: totalPages 
                                  }
                                }}
                              >
                                {totalPages}
                              </Link>
                            </Button>
                          );
                        }

                        return pages;
                      })()}

                      {/* Next Button */}
                      {page < totalPages && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="hover:bg-emerald-50 hover:text-emerald-600 rounded-xl px-4 py-2"
                        >
                          <Link 
                            href={{
                              pathname: "/vendors",
                              query: { 
                                ...(search && { search }), 
                                ...(category && { category }), 
                                page: page + 1 
                              }
                            }}
                          >
                            Next
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Pagination Info */}
                {totalPages > 1 && (
                  <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                      Page {page} of {totalPages} • Showing {vendors.length} vendors
                    </p>
                  </div>
                )}
              </>
            )}
          </Suspense>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4) 2px, transparent 2px),
                             radial-gradient(circle at 70% 30%, rgba(255,255,255,0.4) 2px, transparent 2px)`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Ready to Join Our Vendor Community?
            </h2>
            <p className="text-white/95 mb-12 text-xl leading-relaxed drop-shadow-sm">
              Connect with thousands of customers who value quality, sustainability, and fresh local produce. 
              Start your agricultural business journey with us today.
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                <Users className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Growing Community</h3>
                <p className="text-white/90">Join thousands of satisfied customers</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                <Package className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Easy Management</h3>
                <p className="text-white/90">Powerful tools to manage your store</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                <TrendingUp className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Grow Your Business</h3>
                <p className="text-white/90">Increase sales with our platform</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-gray-50 px-12 py-5 text-xl font-bold shadow-2xl rounded-2xl border-2 border-white/50 hover:scale-105 transition-all duration-300"
              >
                <Link href="/vendors/register">
                  <Users className="w-6 h-6 mr-3" />
                  Become a Vendor
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-12 py-5 text-xl font-bold rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <Link href="/contact">
                  <Globe className="w-6 h-6 mr-3" />
                  Get Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
    </VendorsLayout>
  );
}
