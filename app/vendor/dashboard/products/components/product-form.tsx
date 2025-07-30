"use client";

import { useState, useRef } from "react";
import { FileUpload } from "@/app/components/FileUpload";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import JoditEditor from "jodit-react";
import { toast } from "sonner";
import { Product, ProductCategory } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const productCategories = [
  "seeds",
  "produce", 
  "livestock",
  "equipment",
  "fertilizer",
  "organic",
  "services",
  "grains",
  "fruits",
  "vegetables",
  "herbs",
  "dairy",
  "meat",
  "poultry",
  "fish"
];

const productStatusOptions = ["draft", "published", "archived"];

// Create an explicit type that matches both Zod schema and form requirements
type ProductFormData = {
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  quantity: number;
  category: string; // String type to avoid enum type conflicts
  seasonality: string;
  unit: string;
  minOrderQuantity: number;
  maxOrderQuantity: number | null;
  organic: boolean;
  origin: string;
  images: string[];
  status: string; // String type to avoid enum type conflicts
  isSale: boolean;
  sku: string;
  saleEndDate: Date | null;
};

interface ProductFormProps {
  initialValues?: Product;
  vendorId: string;
  isEditing?: boolean;
}

export default function ProductForm({ initialValues, vendorId, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const editor = useRef(null);

  // Set up default values for the form
  const defaultValues = initialValues
    ? {
        name: initialValues.name,
        description: initialValues.description,
        price: initialValues.price ?? 0,
        discountPrice: initialValues.discountPrice ?? null,
        quantity: initialValues.quantity ?? 0,
        // Ensure category is a string literal matching the Zod schema
        category: String(initialValues.category).toLowerCase() as any,
        seasonality: initialValues.seasonality ?? "",
        unit: initialValues.unit ?? "units",
        minOrderQuantity: initialValues.minOrderQuantity ?? 1,
        maxOrderQuantity: initialValues.maxOrderQuantity ?? null,
        organic: Boolean(initialValues.organic),
        origin: initialValues.origin ?? "",
        images: initialValues.images.length > 0 ? initialValues.images : ["https://placehold.co/600x400?text=Product+Image"],
        // Ensure status is a string literal matching the Zod schema
        status: String(initialValues.status) as "draft" | "published" | "archived",
        isSale: initialValues.isSale ?? false,
        sku: initialValues.sku || "",
        saleEndDate: initialValues.saleEndDate ? new Date(initialValues.saleEndDate) : null,
      }
    : {
        name: "",
        description: "",
        price: 0,
        discountPrice: null,
        quantity: 0,
        category: "produce" as const,
        seasonality: "",
        unit: "units",
        minOrderQuantity: 1,
        maxOrderQuantity: null,
        organic: false,
        origin: "",
        images: ["https://placehold.co/600x400?text=Product+Image"],
        status: "draft" as const,
        isSale: false,
        sku: "",
        saleEndDate: null,
      };

  // Use basic React Hook Form without Zod resolver to avoid type conflicts
  const form = useForm<ProductFormData>({
    defaultValues,
  });

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = form;

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      const productData = { ...data, vendorId };
      const url = isEditing ? `/api/vendor/products/${initialValues?.id}` : "/api/vendor/products";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save product");
      }

      const result = await response.json();
      toast.success(isEditing ? "Product updated successfully" : "Product created successfully");

      if (isEditing) {
        router.push(`/vendor/dashboard/products/${result.id}`);
      } else {
        router.push("/vendor/dashboard/products");
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while saving the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding an image URL
  const handleAddImage = () => {
    if (!newImageUrl) return;
    
    const currentImages = watch("images") || [];
    setValue("images", [...currentImages, newImageUrl]);
    setNewImageUrl("");
  };
  
  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    const currentImages = watch("images") || [];
    if (currentImages.length <= 1) {
      toast.error("You must have at least one image");
      return;
    }
    
    setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter product name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <div className={`jodit-container ${errors.description ? "border-red-500" : ""}`}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <JoditEditor
                        ref={editor}
                        value={field.value || ''}
                        onChange={field.onChange}
                        config={{
                          readonly: false,
                          placeholder: "Describe your product, growing conditions, harvest time, etc.",
                          height: 300,
                          theme: "auto",
                          uploader: {
                            insertImageAsBase64URI: true
                          },
                          buttons: [
                            'source', '|', 'bold', 'italic', '|', 'ul', 'ol', '|', 'font', 'fontsize', 'brush', 'paragraph', '|',
                            'image', 'table', 'link', '|', 'left', 'center', 'right', 'justify', '|', 'undo', 'redo', '|',
                            'hr', 'eraser', 'fullsize'
                          ],
                        }}
                      />
                    )}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {productStatusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU <span className="text-red-500">*</span></Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="e.g. SKU-12345"
                  className={errors.sku ? "border-red-500" : ""}
                />
                {errors.sku && (
                  <p className="text-red-500 text-sm">{errors.sku.message}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Controller
                  name="organic"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="organic"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="organic">Organic Product</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pricing & Inventory */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Pricing & Inventory</h3>
              
              <div className="flex items-center space-x-2">
                <Controller
                  name="isSale"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isSale"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="isSale">Product is on Sale</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price")}
                    placeholder="0.00"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Discount Price ($)</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    step="0.01"
                    {...register("discountPrice")}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="saleEndDate">Sale End Date</Label>
                <Controller
                  name="saleEndDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="saleEndDate"
                      type="date"
                      className={errors.saleEndDate ? "border-red-500" : ""}
                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(e.target.valueAsDate)}
                    />
                  )}
                />
                {errors.saleEndDate && (
                  <p className="text-red-500 text-sm">{errors.saleEndDate.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
                  <Input
                    id="quantity"
                    type="number"
                    {...register("quantity")}
                    placeholder="0"
                    className={errors.quantity ? "border-red-500" : ""}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm">{errors.quantity.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    {...register("unit")}
                    placeholder="units, kg, lb, etc."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderQuantity">Min Order Quantity</Label>
                  <Input
                    id="minOrderQuantity"
                    type="number"
                    {...register("minOrderQuantity")}
                    placeholder="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxOrderQuantity">Max Order Quantity</Label>
                  <Input
                    id="maxOrderQuantity"
                    type="number"
                    {...register("maxOrderQuantity")}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional Details */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Additional Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="seasonality">Seasonality</Label>
                <Input
                  id="seasonality"
                  {...register("seasonality")}
                  placeholder="e.g. Spring, Summer, Year-round"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  {...register("origin")}
                  placeholder="Where was this product grown/made?"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Images */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Product Images</h3>
              
              <FileUpload
                value={watch("images") || []}
                disabled={isSubmitting}
                onChange={(url) => {
                  const currentImages = watch("images") || [];
                  setValue("images", [...currentImages, url]);
                }}
                onRemove={(url) => {
                  const currentImages = watch("images") || [];
                  setValue(
                    "images",
                    currentImages.filter((current) => current !== url)
                  );
                }}
              />
              
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Or paste image URL here"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button 
                  type="button" 
                  onClick={handleAddImage}
                  variant="outline"
                >
                  Add URL
                </Button>
              </div>
              {errors.images && (
                <p className="text-red-500 text-sm">{errors.images.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Add image URLs for your product. The first image will be used as the main image.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <CardFooter className="flex justify-end gap-4 mt-6 px-0">
        <Button 
          type="button"
          variant="outline"
          onClick={() => router.push("/vendor/dashboard/products")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-agricultural-500 hover:bg-agricultural-600">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </> 
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </CardFooter>
    </form>
  );
}
