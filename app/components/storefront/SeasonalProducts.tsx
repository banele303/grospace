import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Thermometer, 
  Snowflake, 
  Sun, 
  Leaf,
  ArrowRight,
  Package
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { formatPrice } from "@/app/lib/utils";

async function getSeasonalProducts() {
  noStore();
  
  const currentMonth = new Date().getMonth() + 1;
  let currentSeason = 'Spring';
  
  if (currentMonth >= 6 && currentMonth <= 8) {
    currentSeason = 'Summer';
  } else if (currentMonth >= 9 && currentMonth <= 11) {
    currentSeason = 'Fall';
  } else if (currentMonth === 12 || currentMonth <= 2) {
    currentSeason = 'Winter';
  }

  const products = await prisma.product.findMany({
    where: {
      status: 'published',
      seasonality: currentSeason,
    },
    include: {
      vendor: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
    take: 6,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // If no seasonal products, get some fresh products
  if (products.length === 0) {
    const fallbackProducts = await prisma.product.findMany({
      where: {
        status: 'published',
        category: {
          in: ['produce', 'fruits', 'vegetables']
        }
      },
      include: {
        vendor: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { products: fallbackProducts, season: currentSeason };
  }

  return { products, season: currentSeason };
}

const seasonIcons = {
  Spring: Leaf,
  Summer: Sun,
  Fall: Leaf,
  Winter: Snowflake,
};

const seasonColors = {
  Spring: 'text-fresh-600 bg-fresh-100',
  Summer: 'text-yellow-600 bg-yellow-100',
  Fall: 'text-earth-600 bg-earth-100',
  Winter: 'text-blue-600 bg-blue-100',
};

export async function SeasonalProducts() {
  const { products, season } = await getSeasonalProducts();

  if (products.length === 0) {
    return null;
  }

  const SeasonIcon = seasonIcons[season as keyof typeof seasonIcons];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`p-2 rounded-lg ${seasonColors[season as keyof typeof seasonColors]}`}>
              <SeasonIcon className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-agricultural-800">
              {season} Harvest
            </h2>
          </div>
          <p className="text-agricultural-600 max-w-2xl mx-auto">
            Discover the best seasonal produce available right now. Fresh, local, 
            and at peak flavor - these products are perfect for this time of year.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-agricultural-200">
              <div className="aspect-square relative overflow-hidden rounded-t-lg bg-agricultural-50">
                {product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-agricultural-400" />
                  </div>
                )}
                
                {/* Seasonal Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={`${seasonColors[season as keyof typeof seasonColors]} border-0`}>
                    <SeasonIcon className="h-3 w-3 mr-1" />
                    {season}
                  </Badge>
                </div>

                {/* Organic Badge */}
                {product.organic && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-fresh-500 text-white">
                      Organic
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-agricultural-800 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="text-right">
                      <div className="font-bold text-agricultural-800">
                        {formatPrice(product.price)}
                      </div>
                      {product.unit && (
                        <div className="text-xs text-agricultural-600">
                          per {product.unit}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-agricultural-600 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Vendor Info */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-6 h-6 bg-agricultural-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-agricultural-700">
                        {product.vendor.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs text-agricultural-600">
                      by {product.vendor.name}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="flex items-center justify-between pt-2">
                    {product.harvestDate && (
                      <div className="flex items-center gap-1 text-xs text-agricultural-600">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Harvested {new Date(product.harvestDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {product.origin && (
                      <div className="text-xs text-agricultural-600">
                        from {product.origin}
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  asChild 
                  className="w-full mt-4 bg-agricultural-500 hover:bg-agricultural-600 text-white"
                >
                  <Link href={`/product/${product.id}`}>
                    View Product
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
            <Link href={`/products?season=${season.toLowerCase()}`} className="flex items-center gap-2">
              View All {season} Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
