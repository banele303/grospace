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
  sku: z.string().optional(), // Optional in schema, will generate if not provided
});

export async function POST(req: NextRequest) {
  try {
    const { vendor } = await requireVendor();
    
    const body = await req.json();
    const validatedData = createProductSchema.parse(body);

    // Ensure the vendor can only create products for themselves
    if (validatedData.vendorId !== vendor.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Generate a unique SKU if not provided
    const generateSKU = async () => {
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

    const product = await prisma.product.create({
      data: productData
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
