import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SanitizedHtml from "@/app/components/sanitized-html";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2,
  Filter,
  MoreHorizontal,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProductActions from "./components/product-actions";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getVendorProducts(vendorId: string) {
  noStore();
  
  const products = await prisma.product.findMany({
    where: { vendorId },
    include: {
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const stats = {
    total: products.length,
    published: products.filter(p => p.status === 'published').length,
    draft: products.filter(p => p.status === 'draft').length,
    lowStock: products.filter(p => p.quantity < 10).length,
  };

  return { products, stats };
}

export default async function VendorProductsPage() {
  const { vendor } = await requireVendor();
  const { products, stats } = await getVendorProducts(vendor.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">Products</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
          <Link href="/vendor/dashboard/products/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-gray-200 dark:hover:shadow-slate-700/20 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.total}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              All products
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-emerald-200 dark:hover:shadow-emerald-900/10 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Published
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.published}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Live products
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-amber-200 dark:hover:shadow-amber-900/10 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Draft
            </CardTitle>
            <Edit className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.draft}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Unpublished
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-rose-200 dark:hover:shadow-rose-900/10 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Low Stock
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.lowStock}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Products with low inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              Product Catalog
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>
              <Button variant="outline" size="sm" className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-slate-700">
                  <TableHead className="text-gray-700 dark:text-slate-300">Product</TableHead>
                  <TableHead className="text-gray-700 dark:text-slate-300">Category</TableHead>
                  <TableHead className="text-gray-700 dark:text-slate-300">Price</TableHead>
                  <TableHead className="text-gray-700 dark:text-slate-300">Stock</TableHead>
                  <TableHead className="text-gray-700 dark:text-slate-300">Status</TableHead>
                  <TableHead className="text-gray-700 dark:text-slate-300">Sales</TableHead>
                  <TableHead className="text-right text-gray-700 dark:text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                          {product.images && product.images.length > 0 ? (
                            <Image 
                              src={product.images[0]} 
                              width={48} 
                              height={48} 
                              alt={product.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400 dark:text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-slate-200">
                            {product.name}
                          </p>
                          <SanitizedHtml
                            html={product.description || ''}
                            className="text-sm text-gray-500 dark:text-slate-400"
                            truncate={75}
                          />

                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-200 transition-colors">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-200">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${product.quantity < 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {product.quantity}
                        </span>
                        {product.quantity < 10 && (
                          <AlertCircle className="h-4 w-4 text-rose-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.status === 'published' ? 'default' : 'secondary'}
                        className={product.status === 'published' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-700 text-slate-300 hover:bg-amber-900/40 hover:text-amber-200'}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-agricultural-500" />
                        <span className="text-sm text-agricultural-600">
                          {product._count.orderItems} sold
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <ProductActions productId={product.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-agricultural-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-agricultural-800 mb-2">
                No products yet
              </h3>
              <p className="text-agricultural-600 mb-6">
                Start building your product catalog by adding your first product.
              </p>
              <Button asChild className="bg-agricultural-500 hover:bg-agricultural-600">
                <Link href="/vendor/dashboard/products/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
