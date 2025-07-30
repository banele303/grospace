import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { 
  MapPin, 
  Star, 
  Award, 
  ArrowRight,
  Leaf,
  Users,
  Package
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

async function getFeaturedVendors() {
  noStore();
  
  const vendors = await prisma.vendor.findMany({
    where: {
      approved: true,
    },
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
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return vendors;
}

export async function VendorSpotlight() {
  const vendors = await getFeaturedVendors();

  if (vendors.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-agricultural-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-agricultural-800">
              Featured Vendors
            </h2>
          </div>
          <p className="text-agricultural-600 max-w-2xl mx-auto">
            Meet our trusted local farmers and producers who bring you the freshest, 
            highest-quality agricultural products straight from their farms.
          </p>
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="bg-white border-agricultural-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-agricultural-200">
                    <AvatarImage src={vendor.logo || undefined} alt={vendor.name} />
                    <AvatarFallback className="bg-agricultural-100 text-agricultural-700 text-xl font-semibold">
                      {vendor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-agricultural-800 mb-1">
                      {vendor.name}
                    </CardTitle>
                    {vendor.address && (
                      <div className="flex items-center gap-1 text-sm text-agricultural-600">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{vendor.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Vendor Info */}
                <div className="space-y-2">
                  {vendor.bio && (
                    <p className="text-sm text-agricultural-600 line-clamp-2">
                      {vendor.bio}
                    </p>
                  )}
                  
                  {/* Specialties */}
                  {vendor.specialties && vendor.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.slice(0, 3).map((specialty) => (
                        <Badge 
                          key={specialty} 
                          variant="secondary" 
                          className="bg-fresh-100 text-fresh-700 text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {vendor.specialties.length > 3 && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                          +{vendor.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Certifications */}
                  {vendor.certifications && vendor.certifications.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-agricultural-500" />
                      <span className="text-xs text-agricultural-600">
                        {vendor.certifications.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Preview */}
                {vendor.products.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-agricultural-800">
                      Recent Products
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {vendor.products.map((product) => (
                        <div key={product.id} className="aspect-square bg-agricultural-50 rounded-lg overflow-hidden">
                          {product.images[0] ? (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              width={100}
                              height={100}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-agricultural-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-agricultural-600">
                    <Package className="h-3 w-3" />
                    <span>{vendor._count.products} products</span>
                  </div>
                  <div className="flex items-center gap-1 text-agricultural-600">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span>4.8</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  asChild 
                  className="w-full bg-agricultural-500 hover:bg-agricultural-600 text-white"
                >
                  <Link href={`/vendor/${vendor.id}`} className="flex items-center justify-center gap-2">
                    View Store
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="border-agricultural-300 text-agricultural-700 hover:bg-agricultural-50"
          >
            <Link href="/vendors">
              View All Vendors
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
