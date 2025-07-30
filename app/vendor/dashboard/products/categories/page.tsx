"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  AlertCircle,
  Check,
  Leaf,
  Loader2,
  Sparkles,
  Grid3X3,
  Search,
  TrendingUp,
  Upload,
  Image as ImageIcon,
  X,
  Tag
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  count?: number;
  color?: string;
  image?: string;
}

const CATEGORY_COLORS = [
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800", 
  "bg-lime-100 text-lime-800 border-lime-200",
  "bg-teal-100 text-teal-800 border-teal-200",
  "bg-cyan-100 text-cyan-800 border-cyan-200",
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-amber-100 text-amber-800 border-amber-200"
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<{ id: string, name: string, image?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsFetching(true);
    try {
      const response = await fetch("/api/vendor/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      
      const data = await response.json();
      const categoriesWithMetadata = data.categories.map((category: any, index: number) => ({
        id: category.id,
        name: category.name,
        count: Math.floor(Math.random() * 50) + 1, // Mock product count for now
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        image: category.image
      }));
      
      setCategories(categoriesWithMetadata);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to load categories");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a cloud service like Cloudinary or AWS S3
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      setNewCategoryImage(imageUrl);
    }
  };

  const removeImage = () => {
    setNewCategoryImage(null);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    if (!newCategoryImage) {
      setError("Please upload a category image");
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      setError("This category already exists");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/vendor/categories", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newCategory,
          image: newCategoryImage 
        })
      });
      
      if (!response.ok) throw new Error("Failed to add category");
      
      const result = await response.json();
      const newCat: Category = {
        id: result.category.id,
        name: result.category.name,
        count: 0,
        color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length],
        image: result.category.image
      };
      
      setCategories(prev => [...prev, newCat]);
      setNewCategory("");
      setNewCategoryImage(null);
      setIsAddDialogOpen(false);
      toast.success("Category added successfully");
    } catch (err) {
      setError("Failed to add category");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory({ id: category.id, name: category.name, image: category.image });
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    if (!editingCategory.name.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    // Check for duplicates (excluding the current one being edited)
    if (categories.some(
      cat => cat.name.toLowerCase() === editingCategory.name.toLowerCase() && 
      cat.id !== editingCategory.id
    )) {
      setError("This category already exists");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/vendor/categories", {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: editingCategory.id,
          name: editingCategory.name,
          image: editingCategory.image
        })
      });
      
      if (!response.ok) throw new Error("Failed to update category");
      
      // Update the state
      setCategories(prev => 
        prev.map(cat => cat.id === editingCategory.id 
          ? { ...cat, name: editingCategory.name.trim() } 
          : cat
        )
      );
      setEditingCategory(null);
      toast.success("Category updated successfully");
    } catch (err) {
      setError("Failed to update category");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    setIsLoading(true);

    try {
      const response = await fetch("/api/vendor/categories", {
        method: "DELETE", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: categoryToDelete.id })
      });
      
      if (!response.ok) throw new Error("Failed to delete category");
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      toast.success("Category deleted successfully");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      toast.error("Failed to delete category");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-agricultural-500" />
          <p className="text-agricultural-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl p-8 text-primary-foreground">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-8 w-8" />
                <h1 className="text-4xl font-bold">Product Categories</h1>
              </div>
              <p className="text-primary-foreground/80 text-lg max-w-2xl">
                Organize your agricultural products with smart categorization.
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary-foreground/70" />
                  <span className="text-primary-foreground/80">{categories.length} Categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary-foreground/70" />
                  <span className="text-primary-foreground/80">Agricultural Focus</span>
                </div>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-background text-foreground hover:bg-muted shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-agricultural-500" />
                    Add New Category
                  </DialogTitle>
                  <DialogDescription>
                    Create a new category to organize your agricultural products
                  </DialogDescription>
                </DialogHeader>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input 
                      id="category-name"
                      placeholder="e.g., Organic Seeds, Fresh Herbs"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="focus:ring-agricultural-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-image">Category Image</Label>
                    <div className="space-y-4">
                      {newCategoryImage ? (
                        <div className="relative">
                          <Image
                            src={newCategoryImage}
                            alt="Category preview"
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            width={300}
                            height={128}
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-agricultural-400 transition-colors">
                          <div className="text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-600">Upload category image</span>
                            <span className="text-xs text-gray-400 block">PNG, JPG up to 5MB</span>
                          </div>
                          <input
                            id="category-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddDialogOpen(false);
                    setError("");
                    setNewCategory("");
                    setNewCategoryImage(null);
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddCategory}
                    disabled={isLoading}
                    className="bg-agricultural-500 hover:bg-agricultural-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Add Category
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:ring-agricultural-500"
          />
        </div>
      </div>

      {/* Modern Categories Grid */}
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {filteredCategories.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Grid3X3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No categories found' : 'No categories yet'}
              </h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                {searchTerm 
                  ? `No categories match "${searchTerm}".`
                  : 'Get started by creating your first product category.'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-agricultural-500 hover:bg-agricultural-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Category
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover"
                              width={48}
                              height={48}
                            />
                          ) : (
                            <div className={`w-full h-full ${category.color} flex items-center justify-center`}>
                              <Leaf className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          {editingCategory?.id === category.id ? (
                            <Input
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory({
                                ...editingCategory,
                                name: e.target.value
                              })}
                              className="text-lg font-semibold"
                            />
                          ) : (
                            <h3 className="text-lg font-semibold capitalize">
                              {category.name}
                            </h3>
                          )}
                          <p className="text-sm text-muted-foreground">{category.count} products</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {editingCategory?.id === category.id ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>
                            Cancel
                          </Button>
                          <Button size="sm" className="bg-agricultural-500" onClick={handleUpdateCategory} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => startEditCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openDeleteDialog(category)} className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-muted/50 to-muted rounded-xl p-6 border">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Pro Tip</h3>
            <p className="text-muted-foreground mt-1">
              Well-organized categories help buyers find your products faster and can improve your sales. Consider creating specific categories that match your target customers&apos; search behavior.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete Category
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category &quot;{categoryToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="w-12 h-12 rounded-lg overflow-hidden border">
              {categoryToDelete?.image ? (
                <Image
                  src={categoryToDelete.image}
                  alt={categoryToDelete.name}
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold capitalize">{categoryToDelete?.name}</h4>
              <p className="text-sm text-muted-foreground">{categoryToDelete?.count} products</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCategoryToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
