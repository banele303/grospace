import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, Eye, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/app/lib/utils";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { RemoveFromWishlistButton } from "../../components/dashboard/wishlist/RemoveFromWishlistButton";
import { AddToCartButton } from "../../components/dashboard/wishlist/AddToCartButton";
import { prisma } from "@/lib/db";

async function getWishlistData(userId: string) {
  try {
    // Try Redis first if available
    let cachedWishlist = null;
    try {
      const { redis } = await import("@/app/lib/redis");
      const WISHLIST_KEY = `wishlist:${userId}`;
      const cached = await redis.get(WISHLIST_KEY);
      if (cached) {
        console.log('Wishlist found in Redis cache');
        return JSON.parse(cached);
      }
    } catch (redisError) {
      console.warn("Redis not available, falling back to database:", redisError);
    }

    // Get from database
    console.log('Wishlist not in cache, fetching from database');
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the data
    const wishlistItems = favorites.map(favorite => {
      const product = favorite.product;
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
        : 0;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        isSale: product.isSale,
        images: product.images,
        quantity: product.quantity,
        category: product.category,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
        addedAt: favorite.createdAt,
      };
    });

    // Cache in Redis if available
    try {
      const { redis } = await import("@/app/lib/redis");
      const WISHLIST_KEY = `wishlist:${userId}`;
      const WISHLIST_EXPIRY = 60 * 60 * 24; // 24 hours
      await redis.setex(WISHLIST_KEY, WISHLIST_EXPIRY, JSON.stringify(wishlistItems));
      console.log('Wishlist cached in Redis');
    } catch (redisError) {
      console.warn("Redis not available for caching:", redisError);
    }

    return wishlistItems;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

export default async function WishlistPage() {
  noStore();
  const user = await getCurrentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const wishlistItems = await getWishlistData(user.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground">
            Items you&apos;ve saved for later ({wishlistItems.length} items)
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <Button asChild>
            <Link href="/products">
              Continue Shopping
            </Link>
          </Button>
        )}
      </div>

      {/* Wishlist Content */}
      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Save items you love to your wishlist and never lose track of them.
            </p>
            <Button asChild>
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((item: any) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <Image
                    src={item.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.isSale && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                      Sale
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <RemoveFromWishlistButton 
                    productId={item.id} 
                    userId={user.id}
                  />
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">
                  {item.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {formatPrice(item.price / 100)}
                  </span>
                  {item.isSale && item.discountPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(item.discountPrice / 100)}
                    </span>
                  )}
                </div>

                {/* Rating (if available) */}
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({item.reviewCount || 0})
                    </span>
                  </div>
                )}

                {/* Stock Status */}
                <div>
                  {item.quantity > 0 ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      In Stock ({item.quantity})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <AddToCartButton 
                    product={item}
                    userId={user.id}
                    disabled={item.quantity === 0}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/product/${item.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {wishlistItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>You might also like</CardTitle>
            <CardDescription>
              Based on your wishlist items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Personalized recommendations coming soon!
              </p>
              <Button variant="outline" asChild>
                <Link href="/products">
                  Explore More Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
