import { Suspense } from "react";
import { HomeCategories } from "../components/storefront/HomeCategories";
import FeaturedProducts from "../components/storefront/FeaturedProducts";
import { BestSellingProducts } from "../components/storefront/BestSellingProducts";
import { AgricultureHero } from "../components/storefront/AgricultureHero";
import { SeasonalProducts } from "../components/storefront/SeasonalProducts";
import { Footer } from "../components/storefront/Footer";
import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

// Define types
type Category = string;

async function getMarketplaceStats() {
  noStore();
  const [vendorCount, productCount, categoryStats] = await Promise.all([
    prisma.vendor.count({ where: { approved: true } }),
    prisma.product.count({ where: { status: 'published' } }),
    prisma.product.groupBy({
      by: ['category'],
      where: { status: 'published' },
      _count: { category: true },
    }),
  ]);
  
  return {
    vendorCount,
    productCount,
    categoryStats,
  };
}

async function getBestSellingProducts() {
  noStore();
  try {
    // Get products with their sales count
    const bestSellers = await prisma.product.findMany({
      where: {
        status: "published",
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discountPrice: true,
        images: true,
        category: true,
        isSale: true,
        isFeatured: true,
        organic: true,
        unit: true,
        vendor: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8, // Show top 8 best sellers
    });

    // Return products with default stats since we can't reliably get orderItems/reviews
    const productsWithStats = bestSellers.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      images: product.images,
      category: product.category as Category,
      isSale: product.isSale,
      isFeatured: product.isFeatured,
      organic: product.organic,
      unit: product.unit,
      salesCount: 0, // Default to 0 for now
      vendor: product.vendor,
      averageRating: 0, // Default to 0 for now
      reviewCount: 0, // Default to 0 for now
    }));

    return productsWithStats;
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    return []; // Return empty array on error
  }
}

async function getFeaturedProducts({ page = 1 }: { page?: number }) {
  noStore();
  const pageSize = 8;
  const skip = (page - 1) * pageSize;

  let whereClause: any = {
    isFeatured: true,
    status: "published",
  };

  let totalProducts = await prisma.product.count({ where: whereClause });

  if (totalProducts === 0) {
    whereClause = {
      status: "published",
    };
    totalProducts = await prisma.product.count({ where: whereClause });
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      vendor: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: skip,
    take: pageSize,
  });

  const totalPages = Math.ceil(totalProducts / pageSize);

  return { products, totalPages };
}

function LoadingState() {
  return (
    <div className="animate-pulse">
      <div className="h-[600px] bg-muted mb-8" />
      <div className="h-32 bg-muted mb-8" />
      <div className="h-96 bg-muted" />
    </div>
  );
}

export default async function IndexPage({ searchParams }: { searchParams?: { page?: string } }) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const [marketplaceStats, { products, totalPages }, bestSellingProducts] = await Promise.all([
    getMarketplaceStats(),
    getFeaturedProducts({ page }),
    getBestSellingProducts(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <AgricultureHero stats={marketplaceStats} />
      <HomeCategories />
      <Suspense fallback={<LoadingState />}>
        <BestSellingProducts products={bestSellingProducts} />
      </Suspense>
      <Suspense fallback={<LoadingState />}>
        <FeaturedProducts products={products} totalPages={totalPages} currentPage={page} />
      </Suspense>
      <SeasonalProducts />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
