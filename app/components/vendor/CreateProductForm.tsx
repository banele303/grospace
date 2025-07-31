"use client";

import { useState, useRef } from "react";
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
  Save,
  Eye,
  Plus,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { FileUpload } from "@/app/components/FileUpload";

// Dynamically import JoditEditor with no SSR to avoid 'self is not defined' error
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

// Wrapper component to safely use JoditEditor with proper hooks handling
function JoditEditorWrapper({ value, onChange }: { value: string, onChange: (content: string) => void }) {
  const editorRef = useRef(null);
  
  if (typeof window === 'undefined') {
    return <textarea className="w-full h-[300px] p-2 border rounded" value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  
  return (
    <JoditEditor
      ref={editorRef}
      value={value}
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
      onBlur={onChange}
      onChange={() => {}}
    />
  );
}

// Wrapper component for FileUpload with proper SSR handling
function FileUploadWrapper({ onChange, onRemove, value, disabled }: { 
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  value: string[];
  disabled?: boolean;
}) {
  if (typeof window === 'undefined') {
    return (
      <div className="p-6 border-2 border-dashed rounded-lg text-center text-gray-400">
        File upload component (available in browser)
      </div>
    );
  }
  
  return (
    <FileUpload 
      onChange={onChange}
      onRemove={onRemove}
      value={value}
      disabled={disabled}
    />
  );
}

interface CreateProductFormProps {
  vendorId: string;
  userId?: string; // Make it optional for backward compatibility
  categories: string[];
  seasonality: string[];
}

export function CreateProductForm({ vendorId, userId, categories, seasonality }: CreateProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  // Debug userId
  console.log("CreateProductForm received userId:", userId);
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

  const handleImageUpload = (url: string) => {
    setImages(prev => [...prev, url].slice(0, 5)); // Max 5 images
  };

  const removeImage = (url: string) => {
    setImages(prev => prev.filter(image => image !== url));
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, publish = false) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        toast.error("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      if (images.length === 0) {
        toast.error("Please upload at least one product image");
        setIsLoading(false);
        return;
      }
      
      // Validate image URLs - make sure they're not blob URLs
      const invalidImages = images.filter(url => url.startsWith('blob:'));
      if (invalidImages.length > 0) {
        toast.error("Some images are not properly uploaded. Please use the provided upload component.");
        setIsLoading(false);
        return;
      }

      // Validate numeric fields
      if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        toast.error("Price must be a valid positive number");
        setIsLoading(false);
        return;
      }
      
      if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
        toast.error("Stock must be a valid non-negative number");
        setIsLoading(false);
        return;
      }

      // Make sure we have a userId
      let effectiveUserId = userId;
      if (!effectiveUserId) {
        console.warn("userId is missing in props, fetching user data from API");
        
        try {
          // Get current user before submitting
          const userResponse = await fetch("/api/auth/me");
          if (userResponse.ok) {
            const userData = await userResponse.json();
            effectiveUserId = userData.id;
            console.log("Retrieved userId from API:", effectiveUserId);
            
            // If we still don't have a userId but we have a vendor ID, try to find the user ID from the vendor
            if (!effectiveUserId && userData.vendors && userData.vendors.length > 0) {
              const vendorInfo = userData.vendors.find((v: any) => v.id === vendorId);
              if (vendorInfo && vendorInfo.userId) {
                effectiveUserId = vendorInfo.userId;
                console.log("Found userId from vendor info:", effectiveUserId);
              }
            }
          } else {
            // If API call fails, log the error
            const errorText = await userResponse.text();
            console.error("Auth API error:", errorText);
          }
        } catch (err) {
          console.error("Failed to fetch current user:", err);
        }
        
        // If we still don't have a userId, try to get it from the vendor-specific endpoint
        if (!effectiveUserId) {
          try {
            const vendorUserResponse = await fetch(`/api/vendors/${vendorId}/user`);
            if (vendorUserResponse.ok) {
              const vendorUserData = await vendorUserResponse.json();
              if (vendorUserData.userId) {
                effectiveUserId = vendorUserData.userId;
                console.log("Retrieved userId from vendor endpoint:", effectiveUserId);
              }
            } else {
              console.error("Vendor user endpoint error:", await vendorUserResponse.text());
            }
          } catch (err) {
            console.error("Failed to fetch vendor user data:", err);
          }
          
          // Last resort fallback
          if (!effectiveUserId) {
            console.warn("No userId available, using a hardcoded fallback");
            effectiveUserId = vendorId;
          }
        }
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
        userId: effectiveUserId, // Use the effectiveUserId (either from props or fetched from API)
        status: publish ? "published" : formData.status
      };
      
      // Debug productData with userId
      console.log("Product data being sent:", { ...productData, effectiveUserId });

      const response = await fetch("/api/vendor/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || "Failed to create product";
        const errorDetails = errorData?.details || "";
        
        console.error("API error:", errorData);
        throw new Error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ""}`);
      }

      const result = await response.json();
      
      toast.success(publish ? "Product published successfully!" : "Product saved as draft!");
      router.push("/vendor/dashboard/products");
      
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create product. Please try again.");
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
              <JoditEditorWrapper
                value={formData.description}
                onChange={(newContent) => handleInputChange("description", newContent)}
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
          <FileUploadWrapper 
            onChange={handleImageUpload}
            onRemove={removeImage}
            value={images}
            disabled={isLoading}
          />
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
            onClick={() => {
              const fakeEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
              handleSubmit(fakeEvent, true);
            }}
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
