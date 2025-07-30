import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Package, Tag, Leaf, CircleDollarSign, ShoppingCart } from "lucide-react";
import Image from "next/image";
import SanitizedHtml from "@/app/components/sanitized-html";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/app/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getProduct(id: string, vendorId: string) {
  const product = await prisma.product.findUnique({
    where: {
      id,
      vendorId, // Ensure vendor can only view their own products
    },
    include: {
      _count: {
        select: {
          orderItems: true,
        }
      },
    }
  });
  
  if (!product) {
    notFound();
  }
  
  return product as any; // Type assertion as temporary fix
}

async function getProductOrders(productId: string, vendorId: string) {
  const orders = await prisma.orderItem.findMany({
    where: {
      productId,
      product: {
        vendorId
      }
    },
    include: {
      order: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });
  
  return orders;
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { vendor } = await requireVendor();
  const product = await getProduct(params.id, vendor.id);
  const recentOrders = await getProductOrders(params.id, vendor.id);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/vendor/dashboard/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-green-800">{product.name}</h1>
          <Badge 
            variant={product.status === 'published' ? 'default' : 'secondary'}
            className={product.status === 'published' ? 'bg-green-500' : ''}
          >
            {product.status}
          </Badge>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href={`/vendor/dashboard/products/${product.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Link>
        </Button>
      </div>

      {/* Product Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Image */}
        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="w-full h-64 bg-green-50 rounded-lg flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <Image 
                  src={product.images[0]} 
                  alt={product.name}
                  className="max-h-full max-w-full object-contain rounded-lg"
                  width={400}
                  height={400}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 400px"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              ) : (
                <Package className="h-24 w-24 text-green-300" />
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.slice(1).map((image: string, i: number) => (
                  <div key={i} className="w-16 h-16 bg-green-50 rounded flex-shrink-0">
                    <Image 
                      src={image} 
                      alt={`${product.name} thumbnail ${i+2}`} 
                      className="w-full h-full object-cover rounded"
                      width={64}
                      height={64}
                      quality={75}
                      sizes="64px"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium">SKU</span>
              </div>
              <span className="text-sm">{product.sku || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CircleDollarSign className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium">Price</span>
              </div>
              <span className="text-sm font-medium">{formatPrice(product.price)}</span>
            </div>
            {product.discountPrice && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CircleDollarSign className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm font-medium">Discount Price</span>
                </div>
                <span className="text-sm font-medium text-red-600">{formatPrice(product.discountPrice)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Package className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium">Stock</span>
              </div>
              <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : ''}`}>
                {product.stock} {product.unit || "units"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ShoppingCart className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium">Sales</span>
              </div>
              <span className="text-sm">{product._count.orderItems} sold</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Leaf className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium">Organic</span>
              </div>
              <span className="text-sm">{product.organic ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium">Category</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
            {product.seasonality && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Seasonality</span>
                </div>
                <span className="text-sm">{product.seasonality}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium">Created</span>
              </div>
              <span className="text-sm">{formatDate(product.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Product Stats */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((orderItem) => (
                  <div key={orderItem.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Order #{orderItem.order.id.slice(-6)}</p>
                      <p className="text-xs text-green-600">{formatDate(orderItem.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(orderItem.price)}</p>
                      <p className="text-xs">Qty: {orderItem.quantity}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/vendor/dashboard/orders">
                    View All Orders
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-8 w-8 text-green-300" />
                <p className="mt-2 text-sm text-green-600">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Description */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <SanitizedHtml html={product.description || ''} className="text-green-800 whitespace-pre-wrap" />
        </CardContent>
      </Card>
    </div>
  );
}
