import { NextRequest, NextResponse } from "next/server";
import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { ProductCategory, ProductStatus } from "@prisma/client";

// Create a zod enum that matches the Prisma ProductCategory enum
const productCategoryEnum = z.enum([
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
]);

const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().positive("Price must be positive"),
  discountPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  category: productCategoryEnum,
  seasonality: z.string().optional(),
  unit: z.string().default("kg"),
  minOrderQuantity: z.number().int().positive().default(1),
  maxOrderQuantity: z.number().int().positive().optional().nullable(),
  organic: z.boolean().default(false),
  origin: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  vendorId: z.string(),
  userId: z.string(), // User ID is required
  sku: z.string().optional(), // Optional in schema, will generate if not provided
});

export async function POST(req: NextRequest) {
  try {
    const { vendor, user } = await requireVendor();
    
    const body = await req.json();
    // Add user.id to body if userId is not present
    if (!body.userId && user && user.id) {
      body.userId = user.id;
      console.log("Added userId from authenticated user:", user.id);
    }
    
    const validatedData = createProductSchema.parse(body);

    // Ensure the vendor can only create products for themselves
    if (validatedData.vendorId !== vendor.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Generate a unique SKU if not provided
    const generateSKU = async (): Promise<string> => {
      // Create SKU based on product name and random string
      const prefix = validatedData.name
        .substring(0, 3)
        .toUpperCase()
        .replace(/\s/g, '');
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
      const candidateSku = `${prefix}${timestamp}${random}`;
      
      // Check if SKU already exists
      const existingProduct = await prisma.product.findUnique({
        where: { sku: candidateSku }
      });
      
      // If SKU exists, generate another one recursively
      if (existingProduct) {
        return generateSKU();
      }
      
      return candidateSku;
    };

    const sku = validatedData.sku || await generateSKU();

    // Create a typed data object that exactly matches Prisma's expected schema
    const productData: {
      name: string;
      description: string;
      price: number;
      quantity: number;
      category: ProductCategory;
      sku: string;
      vendorId: string;
      userId: string;
      status: ProductStatus;
      isFeatured: boolean;
      sizes: string[];
      colors: string[];
      images: string[];
      organic: boolean;
      discountPrice: number | null;
      seasonality?: string;
      unit?: string;
      origin?: string;
      minOrderQuantity?: number;
      maxOrderQuantity?: number;
    } = {
      name: validatedData.name,
      description: validatedData.description,
      price: validatedData.price,
      quantity: validatedData.stock, // Using stock value for quantity field
      category: validatedData.category,
      isFeatured: false, // Default value
      sizes: [], // Default empty array
      colors: [], // Default empty array
      sku: sku,
      vendorId: validatedData.vendorId,
      userId: vendor.userId, // Add the userId from the vendor object
      status: validatedData.status,
      images: validatedData.images,
      // Optional fields
      organic: validatedData.organic || false,
      discountPrice: null // Initialize with null so TypeScript knows this property exists
    };
    
    // Add optional fields only if they exist
    if (validatedData.discountPrice !== undefined && validatedData.discountPrice !== null) {
      productData.discountPrice = validatedData.discountPrice;
    }
    if (validatedData.seasonality) productData.seasonality = validatedData.seasonality;
    if (validatedData.unit) productData.unit = validatedData.unit;
    if (validatedData.origin) productData.origin = validatedData.origin;
    if (validatedData.minOrderQuantity) productData.minOrderQuantity = validatedData.minOrderQuantity;
    if (validatedData.maxOrderQuantity) productData.maxOrderQuantity = validatedData.maxOrderQuantity;

    // Check if userId is present
    if (!productData.userId) {
      // If userId is missing, use the one from the vendor object from requireVendor
      console.log("UserId missing in request, using vendor.userId instead:", vendor.userId);
      productData.userId = vendor.userId;
      
      // If still no userId, return an error
      if (!productData.userId) {
        return NextResponse.json(
          { error: "User ID is required to create a product" },
          { status: 400 }
        );
      }
    }
    
    // Filter out any invalid image URLs (blob URLs or placeholders)
    const invalidImages = productData.images.filter(url => 
      url.startsWith('blob:') || 
      url === 'https://placehold.co/600x400?text=Product+Image'
    );
    
    if (invalidImages.length > 0) {
      console.warn("Invalid images detected and filtered out:", invalidImages);
    }
    
    productData.images = productData.images.filter(url => 
      !url.startsWith('blob:') && 
      url !== 'https://placehold.co/600x400?text=Product+Image'
    );
    
    // Check if we have valid images after filtering
    if (productData.images.length === 0) {
      return NextResponse.json(
        { 
          error: "No valid images provided. Please upload product images using the FileUpload component.",
          details: "The temporary blob URLs cannot be stored in the database. Please use the provided image upload functionality."
        },
        { status: 400 }
      );
    }

    // Remove userId and vendorId from productData
    const { userId, vendorId, ...productDataWithoutIds } = productData;
    
    const product = await prisma.product.create({
      data: {
        ...productDataWithoutIds,
        user: {
          connect: { id: userId }
        },
        vendor: {
          connect: { id: vendorId }
        }
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    // Better error handling for Prisma errors
    if (error instanceof Error) {
      // Check if it's a Prisma error
      if (error.name === "PrismaClientKnownRequestError" || 
          error.name === "PrismaClientValidationError") {
        return NextResponse.json(
          { 
            error: "Database error", 
            message: error.message,
            details: "There might be an issue with the data format or required relationships. Please check all required fields."
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { vendor } = await requireVendor();
    
    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
