import { prisma } from "@/lib/db";
import { Order } from "@/app/lib/zodSchemas";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getData() {
  try {
    const [products, users, orders] = await Promise.all([
      prisma.product.findMany(),
      prisma.user.findMany(),
      prisma.order.findMany({
        include: {
          orderItems: true,
        },
      }),
    ]);

    return {
      products,
      user: users,
      order: orders,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      products: [],
      user: [],
      order: [],
    };
  }
}

export async function getOrders() {
  try {
    const [orders, totalOrders, totalRevenue] = await Promise.all([
      prisma.order.findMany({
        include: {
          orderItems: true,
        },
      }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
    ]);

    return {
      orders,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function getProducts() {
  try {
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        include: {
          flashSaleProducts: {
            include: {
              flashSale: true,
            },
          },
        },
      }),
      prisma.product.count(),
    ]);

    return {
      products,
      totalProducts,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getCustomers() {
  try {
    const [customers, totalCustomers] = await Promise.all([
      prisma.user.findMany({
        include: {
          orders: true,
        },
      }),
      prisma.user.count(),
    ]);

    return {
      customers,
      totalCustomers,
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Failed to fetch customers");
  }
}

export async function getPromotions() {
  try {
    const [discountCodes, flashSales] = await Promise.all([
      prisma.discountCode.findMany({
        include: {
          _count: {
            select: {
              redemptions: true,
            },
          },
        },
      }),
      prisma.flashSale.findMany({
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      }),
    ]);

    return {
      discountCodes,
      flashSales,
    };
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw new Error("Failed to fetch promotions");
  }
}

export async function getAnalytics() {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orderItems: true,
        },
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      }),
    ]);

    const topProductDetails = await Promise.all(
      topProducts.map(async (product) => {
        const productDetails = await prisma.product.findUnique({
          where: {
            id: product.productId,
          },
        });
        return {
          ...product,
          product: productDetails,
        };
      })
    );

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts,
      totalCustomers,
      recentOrders,
      topProducts: topProductDetails,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw new Error("Failed to fetch analytics");
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        flashSaleProducts: {
          include: {
            flashSale: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        orders: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw new Error("Failed to fetch customer");
  }
}

export async function getDiscountCodeById(id: string) {
  try {
    const discountCode = await prisma.discountCode.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            redemptions: true,
          },
        },
      },
    });

    if (!discountCode) {
      throw new Error("Discount code not found");
    }

    return discountCode;
  } catch (error) {
    console.error("Error fetching discount code:", error);
    throw new Error("Failed to fetch discount code");
  }
}

export async function getFlashSaleById(id: string) {
  try {
    const flashSale = await prisma.flashSale.findUnique({
      where: {
        id,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!flashSale) {
      throw new Error("Flash sale not found");
    }

    return flashSale;
  } catch (error) {
    console.error("Error fetching flash sale:", error);
    throw new Error("Failed to fetch flash sale");
  }
}

import type { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
    });

    revalidatePath("/dashboard/orders");
    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}

export async function updateProductStatus(id: string, status: 'draft' | 'published' | 'archived') {
  try {
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        status: status as 'draft' | 'published' | 'archived',
      },
    });

    revalidatePath("/dashboard/products");
    return product;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw new Error("Failed to update product status");
  }
}

export async function updateFlashSaleStatus(id: string, isActive: boolean) {
  try {
    const flashSale = await prisma.flashSale.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });

    revalidatePath("/dashboard/promotions");
    return flashSale;
  } catch (error) {
    console.error("Error updating flash sale status:", error);
    throw new Error("Failed to update flash sale status");
  }
}

export async function updateDiscountCodeStatus(id: string, isActive: boolean) {
  try {
    const discountCode = await prisma.discountCode.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });

    revalidatePath("/dashboard/promotions");
    return discountCode;
  } catch (error) {
    console.error("Error updating discount code status:", error);
    throw new Error("Failed to update discount code status");
  }
}

export async function addToWishlist(productId: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Please sign in to add items to wishlist" };
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Check if already in wishlist
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    if (existingFavorite) {
      return { success: false, error: "Product already in wishlist" };
    }

    // Add to wishlist
    await prisma.favorite.create({
      data: {
        userId: user.id,
        productId: productId,
      },
    });

    // Invalidate cache if Redis is available
    try {
      const { redis } = await import("@/app/lib/redis");
      await redis.del(`wishlist:${user.id}`);
    } catch (redisError) {
      console.warn("Redis not available for cache invalidation:", redisError);
    }

    revalidatePath("/dashboard/wishlist");
    return { success: true, message: "Added to wishlist" };

  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return { success: false, error: "Failed to add to wishlist" };
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Please sign in" };
    }

    // Remove from wishlist
    const deletedFavorite = await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    if (deletedFavorite.count === 0) {
      return { success: false, error: "Item not found in wishlist" };
    }

    // Invalidate cache if Redis is available
    try {
      const { redis } = await import("@/app/lib/redis");
      await redis.del(`wishlist:${user.id}`);
    } catch (redisError) {
      console.warn("Redis not available for cache invalidation:", redisError);
    }

    revalidatePath("/dashboard/wishlist");
    return { success: true, message: "Removed from wishlist" };

  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return { success: false, error: "Failed to remove from wishlist" };
  }
}