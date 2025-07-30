import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import ProductClient from "./product-client";
import FeaturedProducts from "@/app/components/storefront/FeaturedProducts";
import VendorInfo from "./vendor-info";
import type { ProductStatus, ProductCategory } from "@prisma/client";
import { Product } from "@/app/lib/zodSchemas";

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
  };
}

export interface ProductWithReviews {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  isSale: boolean;
  saleEndDate: Date | null;
  images: string[];
  isFeatured: boolean;
  createdAt: Date;
  status: ProductStatus;
  category: ProductCategory;
  sku: string;
  sizes: string[];
  colors: string[];
  brand: string | null;
  material: string | null;
  unit: string | null;
  origin: string | null;
  organic: boolean;
  certifications: string[];
  seasonality: string | null;
  nutritionalInfo: any;
  minOrderQuantity: number | null;
  maxOrderQuantity: number | null;
  vendor: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    bio: string | null;
    website: string | null;
    logo: string | null;
    businessType: string | null;
    establishedYear: number | null;
    certifications: string[];
    specialties: string[];
    farmSize: string | null;
    farmingType: string | null;
    createdAt: Date;
  };
  reviews: Review[];
  quantity: number;
  views: number;
}

async function getProductData(productId: string) {
  noStore();
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        status: "published",
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        price: true,
        discountPrice: true,
        isSale: true,
        saleEndDate: true,
        sku: true,
        images: true,
        category: true,
        isFeatured: true,
        quantity: true,
        sizes: true,
        colors: true,
        brand: true,
        material: true,
        unit: true,
        origin: true,
        organic: true,
        certifications: true,
        seasonality: true,
        nutritionalInfo: true,
        minOrderQuantity: true,
        maxOrderQuantity: true,
        createdAt: true,
        updatedAt: true,
        views: true,
        vendor: {
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
            farmSize: true,
            farmingType: true,
            createdAt: true,
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      notFound();
    }

    const typedProduct = {
      ...product,
      sizes: product.sizes || [],
      colors: product.colors || [],
      discountPrice: product.discountPrice ?? 0,
      isSale: product.isSale ?? false,
    };

    const reviews = typedProduct.reviews || [];

    const views = (product as any).views ?? 0;

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      product: typedProduct,
      reviews,
      averageRating,
      reviewCount: reviews.length,
      views,
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
    notFound();
  }
}

async function getFeaturedProducts(currentProductId: string, category: string): Promise<Product[]> {
  noStore();
  
  // First try to get featured products from the same category, excluding current product
  let data = await prisma.product.findMany({
    where: {
      isFeatured: true,
      status: "published",
      category: category as any,
      id: {
        not: currentProductId
      }
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      price: true,
      discountPrice: true,
      isSale: true,
      saleEndDate: true,
      sku: true,
      images: true,
      category: true,
      isFeatured: true,
      quantity: true,
      sizes: true,
      colors: true,
      brand: true,
      material: true,
      unit: true,
      origin: true,
      organic: true,
      certifications: true,
      seasonality: true,
      nutritionalInfo: true,
      minOrderQuantity: true,
      maxOrderQuantity: true,
      views: true,
      createdAt: true,
      updatedAt: true,
    },
    take: 4,
  });

  // If we don't have enough featured products from same category, get more from same category (non-featured)
  if (data.length < 4) {
    const additionalProducts = await prisma.product.findMany({
      where: {
        status: "published",
        category: category as any,
        id: {
          not: currentProductId,
          notIn: data.map(p => p.id)
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        price: true,
        discountPrice: true,
        isSale: true,
        saleEndDate: true,
        sku: true,
        images: true,
        category: true,
        isFeatured: true,
        quantity: true,
        sizes: true,
        colors: true,
        brand: true,
        material: true,
        unit: true,
        origin: true,
        organic: true,
        certifications: true,
        seasonality: true,
        nutritionalInfo: true,
        minOrderQuantity: true,
        maxOrderQuantity: true,
        views: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 4 - data.length,
      orderBy: {
        createdAt: "desc",
      },
    });
    
    data = [...data, ...additionalProducts];
  }

  // If still not enough, get any featured products to fill the gap
  if (data.length < 4) {
    const anyFeaturedProducts = await prisma.product.findMany({
      where: {
        isFeatured: true,
        status: "published",
        id: {
          not: currentProductId,
          notIn: data.map(p => p.id)
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        price: true,
        discountPrice: true,
        isSale: true,
        saleEndDate: true,
        sku: true,
        images: true,
        category: true,
        isFeatured: true,
        quantity: true,
        sizes: true,
        colors: true,
        brand: true,
        material: true,
        unit: true,
        origin: true,
        organic: true,
        certifications: true,
        seasonality: true,
        nutritionalInfo: true,
        minOrderQuantity: true,
        maxOrderQuantity: true,
        views: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 4 - data.length,
    });
    
    data = [...data, ...anyFeaturedProducts];
  }

  return data;
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { product, reviews, averageRating, reviewCount, views } = await getProductData(
    params.id
  );
  const featuredProducts = await getFeaturedProducts(params.id, product.category);

  return (
    <>
      <ProductClient
        product={{ ...product, views }}
        reviews={reviews}
        averageRating={averageRating}
        reviewCount={reviewCount}
      />
      
      <VendorInfo vendor={product.vendor} />
      
      <div className="mt-16">
        <FeaturedProducts products={featuredProducts} category={product.category} />
      </div>
    </>
  );
}
