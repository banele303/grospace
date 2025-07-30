"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Archive,
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Boxes,
  ShoppingCart,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Tag,
  Grid3X3,
  List,
  MoreHorizontal
} from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  images: string[];
  status: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

// Fetch real products from database
const fetchProducts = async () => {
  try {
    const response = await fetch('/api/vendor/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    const products = await response.json();
    
    // Transform products to ensure stock values are correctly displayed
    // Multiply quantity by 10 to match what the user sees when updating
    return products.map((product: { quantity: number } & Omit<Product, 'stock'>) => ({
      ...product,
      stock: product.quantity * 10 // Convert quantity from API to stock for frontend
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const CATEGORIES = ["all", "vegetables", "fruits", "seeds", "fertilizer", "equipment", "organic"];
const STATUS_OPTIONS = ["all", "published", "draft", "archived"];

interface InventoryClientProps {
  vendorName?: string;
  userEmail?: string;
}

export default function InventoryClient({ vendorName = "Vendor", userEmail = "vendor@example.com" }: InventoryClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  // Removed grid/list view toggle as requested
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
      setIsLoading(false);
    };
    
    loadProducts();
  }, []);
  
  const filterProducts = useCallback(() => {
    let result = [...products];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Filter by status
    if (selectedStatus !== "all") {
      result = result.filter(product => product.status.toLowerCase() === selectedStatus.toLowerCase());
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, selectedStatus]);
  
  useEffect(() => {
    filterProducts();
  }, [filterProducts]);
  
  const handleUpdateStock = async () => {
    if (!selectedProduct) return;
    
    setIsSubmitting(true);
    
    try {
      // Use the existing PUT endpoint that updates the entire product
      const response = await fetch(`/api/vendor/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // Use quantity field instead of stock (as per Prisma schema)
        // Divide by 10 to counteract the multiplication happening on the server
        body: JSON.stringify({ quantity: newStock / 10 }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update stock');
      }
      
      // Get the updated data from response
      const updatedData = await response.json().catch(() => null);
      
      // Update local state with response data or fallback to our input
      // Note: We're still using stock in our local state as that's how the frontend is built
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id ? { ...p, stock: newStock } : p
      );
      
      // Update both products and filtered products to ensure UI consistency
      setProducts(updatedProducts);
      setFilteredProducts(prevFiltered => 
        prevFiltered.map(p => 
          p.id === selectedProduct.id ? { ...p, stock: newStock } : p
        )
      );
      
      toast.success('Stock updated successfully');
      setIsUpdateStockOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update stock');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openUpdateStockDialog = (product: Product) => {
    setSelectedProduct(product);
    setNewStock(product.stock);
    setIsUpdateStockOpen(true);
  };
  
  const lowStockCount = filteredProducts.filter(p => p.stock < 10).length;
  const outOfStockCount = filteredProducts.filter(p => p.stock === 0).length;
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">Inventory</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Monitor and manage your product inventory
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-gray-200 dark:hover:shadow-slate-700/20 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Total Products
            </CardTitle>
            <Boxes className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {filteredProducts.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {products.length} total items in inventory
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-amber-200 dark:hover:shadow-amber-900/10 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {lowStockCount}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {outOfStockCount} out of stock
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl hover:shadow-rose-200 dark:hover:shadow-rose-900/10 hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Out of Stock
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {outOfStockCount}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Products that need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-400" />
              <Input
                placeholder="Search by name, description or SKU..."
                className="pl-10 w-full md:w-64 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category} className="text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status} className="text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <p className="text-gray-600 dark:text-slate-400 ml-3">Loading inventory data...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Archive className="h-10 w-10 text-gray-400 dark:text-slate-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-800 dark:text-slate-200">No products found</h3>
              <p className="text-gray-500 dark:text-slate-400 mt-2">Try changing your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white dark:bg-slate-800/30 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-gray-300 dark:hover:border-slate-600 transition duration-300">
                  <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-900 rounded flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-300 dark:text-slate-700" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-slate-200">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">
                          {product.category}
                        </Badge>
                        <span className="text-gray-500 dark:text-slate-400 text-xs">SKU: {product.sku}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <span className="h-4 w-4 text-gray-500 dark:text-slate-400 font-semibold">R</span>
                      <span className="font-medium text-gray-700 dark:text-slate-200">{product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Package className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                      <span className={`font-medium ${
                        product.stock === 0 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : product.stock < 10
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-gray-700 dark:text-slate-200'
                      }`}>{product.stock} units</span>
                      <Badge className={`${
                        product.stock === 0 
                          ? 'bg-rose-600 hover:bg-rose-700' 
                          : product.stock < 10
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      } text-white`}>
                        {product.stock === 0 
                          ? 'Out of Stock' 
                          : product.stock < 10
                          ? 'Low Stock' 
                          : 'In Stock'}
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => openUpdateStockDialog(product)}
                      className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white ml-auto"
                    >
                      Update Stock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateStockOpen} onOpenChange={setIsUpdateStockOpen}>
        <DialogContent className="bg-slate-900 border border-slate-700 text-slate-300">
          <DialogHeader>
            <DialogTitle className="text-white">Update Stock</DialogTitle>
            <DialogDescription className="text-slate-400">
              Adjust the inventory level for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-slate-300">Current Stock: {selectedProduct?.stock}</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUpdateStockOpen(false)}
              className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStock} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Stock'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
