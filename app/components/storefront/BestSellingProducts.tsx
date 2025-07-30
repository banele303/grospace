"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, TrendingUp, Crown, Award, Zap, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/app/lib/utils";
import { addItem } from "@/app/actions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";

interface BestSellingProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  category: string;
  isSale: boolean;
  isFeatured: boolean;
  organic: boolean;
  unit?: string | null;
  salesCount: number;
  vendor: {
    name: string;
    logo?: string | null;
  };
  averageRating: number;
  reviewCount: number;
}

interface BestSellingProductsProps {
  products: BestSellingProduct[];
}

export function BestSellingProducts({ products }: BestSellingProductsProps) {
  const { getUser } = useKindeBrowserClient();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAddToCart = async (productId: string, productName: string) => {
    const user = getUser();
    if (!user) {
      toast.error("Please log in to add items to cart");
      return;
    }

    setLoading(productId);
    try {
      const result = await addItem(productId);
      if (result.success) {
        toast.success(`${productName} added to cart!`);
      } else {
        toast.error(result.error || "Failed to add item to cart");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'poultry':
        return '🐓';
      case 'dairy':
        return '🥛';
      case 'eggs':
        return '🥚';
      case 'feed':
        return '🌾';
      case 'seeds':
        return '🌱';
      case 'fertilizer':
        return '🧪';
      case 'vegetables':
        return '🥬';
      case 'fruits':
        return '🍎';
      case 'grains':
        return '🌾';
      case 'herbs':
        return '🌿';
      default:
        return '🌱';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'poultry':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'dairy':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'eggs':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'feed':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'seeds':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'fertilizer':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'vegetables':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'fruits':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'grains':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'herbs':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-sky-50/30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <Crown className="w-10 h-10 text-yellow-500" />
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Best Selling Products
          </h2>
          
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 font-medium">Top Performers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-emerald-500" />
              <span className="text-gray-600 font-medium">Customer Favorites</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-500" />
              <span className="text-gray-600 font-medium">Proven Quality</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <Card key={product.id} className="group relative bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              {/* Best Seller Badge */}
              {index < 3 && (
                <div className="absolute top-4 left-4 z-20">
                  <Badge className={`
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : ''}
                    ${index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : ''}
                    ${index === 2 ? 'bg-gradient-to-r from-amber-600 to-yellow-600' : ''}
                    text-white font-bold px-3 py-1 shadow-lg border-0
                  `}>
                    <Crown className="w-3 h-3 mr-1" />
                    #{index + 1} Best Seller
                  </Badge>
                </div>
              )}

              {/* Sale Badge */}
              {product.isSale && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-red-500 text-white font-bold px-3 py-1 shadow-lg border-0">
                    <Zap className="w-3 h-3 mr-1" />
                    SALE
                  </Badge>
                </div>
              )}

              {/* Organic Badge */}
              {product.organic && (
                <div className="absolute top-16 right-4 z-20">
                  <Badge className="bg-green-500 text-white font-bold px-3 py-1 shadow-lg border-0">
                    🌱 Organic
                  </Badge>
                </div>
              )}

              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {product.images && product.images.length > 0 && product.images[0] ? (
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={250}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-sky-100">
                      <div className="text-center">
                        <span className="text-4xl mb-2 block">{getCategoryIcon(product.category)}</span>
                        <p className="text-gray-500 font-medium">No Image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                  
                  {/* Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button asChild size="sm" className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg">
                      <Link href={`/product/${product.id}`}>
                        Quick View
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Category */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${getCategoryColor(product.category)} font-medium border`}>
                      {/* <span className="mr-1">{getCategoryIcon(product.category)}</span> */}
                      {product.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-600">
                        {product.averageRating.toFixed(1)} ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Price Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {product.isSale && product.discountPrice ? (
                        <>
                          <span className="text-xl font-bold text-red-600">
                            {formatPrice(product.discountPrice)}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    {product.unit && (
                      <span className="text-sm text-gray-500 font-medium">
                        per {product.unit}
                      </span>
                    )}
                  </div>

                  {/* Savings */}
                  {product.isSale && product.discountPrice && (
                    <div className="mb-1">
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        Save {formatPrice(product.price - product.discountPrice)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-2 pt-0">
                <div className="flex gap-3 w-full">
                  <Button 
                    onClick={() => handleAddToCart(product.id, product.name)}
                    disabled={loading === product.id}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading === product.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 mr-2" />
                    )}
                    Add to Cart
                  </Button>
                  
                  <Button variant="outline" size="icon" className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors duration-300">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-16">
          <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href="/products">
              View All Products
              <TrendingUp className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
