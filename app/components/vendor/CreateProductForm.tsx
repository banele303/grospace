"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Upload,
  Save,
  Eye,
  X,
  Plus,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import JoditEditor from "jodit-react";
import { useTheme } from "next-themes";

interface CreateProductFormProps {
  vendorId: string;
  categories: string[];
  seasonality: string[];
}

export function CreateProductForm({ vendorId, categories, seasonality }: CreateProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    seasonality: "",
    unit: "kg",
    minOrderQuantity: "1",
    maxOrderQuantity: "",
    organicCertified: false,
    locallyGrown: false,
    status: "draft" as "draft" | "published"
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you'd upload to a cloud service like Cloudinary or AWS S3
      // For now, we'll simulate with placeholder URLs
      const newImages = Array.from(files).map((file, index) => 
        URL.createObjectURL(file)
      );
      setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (images.length === 0) {
        toast.error("Please upload at least one product image");
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stock: parseInt(formData.stock),
        minOrderQuantity: parseInt(formData.minOrderQuantity),
        maxOrderQuantity: formData.maxOrderQuantity ? parseInt(formData.maxOrderQuantity) : null,
        images,
        vendorId,
        status: publish ? "published" : formData.status
      };

      const response = await fetch("/api/vendor/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const result = await response.json();
      
      toast.success(publish ? "Product published successfully!" : "Product saved as draft!");
      router.push("/vendor/dashboard/products");
      
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      {/* Basic Information */}
      <Card className="border-agricultural-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-agricultural-800">
            Basic Information
          </CardTitle>
          <CardDescription>
            Enter the basic details about your product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Fresh Organic Tomatoes"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <div className="jodit-container">
              <JoditEditor
                ref={useRef(null)}
                value={formData.description}
                config={{
                  readonly: false,
                  placeholder: "Describe your product, growing conditions, harvest time, etc.",
                  height: 300,
                  theme: "auto",
                  uploader: {
                    insertImageAsBase64URI: true
                  },
                  buttons: [
                    'source', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'ul', 'ol', '|',
                    'font', 'fontsize', 'paragraph', '|',
                    'table', 'link', 'image', '|',
                    'align', '|',
                    'undo', 'redo'
                  ],
                  toolbarAdaptive: true
                }}
                onBlur={(newContent) => handleInputChange("description", newContent)}
                onChange={(newContent) => {}}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Inventory */}
      <Card className="border-agricultural-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-agricultural-800">
            Pricing & Inventory
          </CardTitle>
          <CardDescription>
            Set your pricing and stock information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (R) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPrice">Discount Price (R)</Label>
              <Input
                id="discountPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.discountPrice}
                onChange={(e) => handleInputChange("discountPrice", e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="g">Gram (g)</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="bunch">Bunch</SelectItem>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrderQuantity">Min Order Quantity</Label>
              <Input
                id="minOrderQuantity"
                type="number"
                min="1"
                value={formData.minOrderQuantity}
                onChange={(e) => handleInputChange("minOrderQuantity", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxOrderQuantity">Max Order Quantity</Label>
              <Input
                id="maxOrderQuantity"
                type="number"
                min="1"
                value={formData.maxOrderQuantity}
                onChange={(e) => handleInputChange("maxOrderQuantity", e.target.value)}
                placeholder="No limit"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card className="border-agricultural-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-agricultural-800">
            Product Images
          </CardTitle>
          <CardDescription>
            Upload high-quality images of your product (max 5 images)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-agricultural-200"
                  width={100}
                  height={96}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                {index === 0 && (
                  <Badge className="absolute bottom-1 left-1 text-xs bg-agricultural-500">
                    Main
                  </Badge>
                )}
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="w-full h-24 border-2 border-dashed border-agricultural-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-agricultural-400 transition-colors">
                <div className="text-center">
                  <Upload className="h-6 w-6 text-agricultural-400 mx-auto mb-1" />
                  <span className="text-xs text-agricultural-600">Upload</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card className="border-agricultural-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-agricultural-800">
            Additional Details
          </CardTitle>
          <CardDescription>
            Optional information to help customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seasonality">Seasonality</Label>
            <Select value={formData.seasonality} onValueChange={(value) => handleInputChange("seasonality", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select seasonality" />
              </SelectTrigger>
              <SelectContent>
                {seasonality.map((season) => (
                  <SelectItem key={season} value={season}>
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="organicCertified"
                checked={formData.organicCertified}
                onCheckedChange={(checked) => handleInputChange("organicCertified", checked)}
              />
              <Label htmlFor="organicCertified">Organic Certified</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="locallyGrown"
                checked={formData.locallyGrown}
                onCheckedChange={(checked) => handleInputChange("locallyGrown", checked)}
              />
              <Label htmlFor="locallyGrown">Locally Grown</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-agricultural-200">
        <Button type="button" variant="outline" asChild>
          <a href="/vendor/dashboard/products">Cancel</a>
        </Button>
        
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save as Draft
          </Button>
          
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading}
            className="bg-agricultural-500 hover:bg-agricultural-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            Publish Product
          </Button>
        </div>
      </div>
    </form>
  );
}
