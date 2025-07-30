import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { redis } from "@/app/lib/redis";
import { prisma } from "@/lib/db";

const WISHLIST_KEY = (userId: string) => `wishlist:${userId}`;
const WISHLIST_EXPIRY = 60 * 60 * 24; // 24 hours

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to get wishlist from Redis first
    const cachedWishlist = await redis.get(WISHLIST_KEY(userId));
    
    if (cachedWishlist) {
      console.log('Wishlist found in Redis cache');
      return NextResponse.json({ items: JSON.parse(cachedWishlist) });
    }

    // If not in cache, get from database
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

    // Cache the wishlist in Redis
    await redis.setex(WISHLIST_KEY(userId), WISHLIST_EXPIRY, JSON.stringify(wishlistItems));
    console.log('Wishlist cached in Redis');

    return NextResponse.json({ items: wishlistItems });

  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if already in wishlist
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    if (existingFavorite) {
      return NextResponse.json({ error: "Product already in wishlist" }, { status: 400 });
    }

    // Add to wishlist
    await prisma.favorite.create({
      data: {
        userId: user.id,
        productId: productId,
      },
    });

    // Invalidate cache
    await redis.del(WISHLIST_KEY(user.id));
    console.log('Wishlist cache invalidated after adding item');

    return NextResponse.json({ success: true, message: "Added to wishlist" });

  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Remove from wishlist
    const deletedFavorite = await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    if (deletedFavorite.count === 0) {
      return NextResponse.json({ error: "Item not found in wishlist" }, { status: 404 });
    }

    // Invalidate cache
    await redis.del(WISHLIST_KEY(user.id));
    console.log('Wishlist cache invalidated after removing item');

    return NextResponse.json({ success: true, message: "Removed from wishlist" });

  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
