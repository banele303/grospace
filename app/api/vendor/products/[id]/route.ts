import { NextRequest, NextResponse } from "next/server";
import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { ProductCategory, ProductStatus } from "@prisma/client";

// Product update schema
const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  description: z.string().min(1, "Product description is required").optional(),
  price: z.number().positive("Price must be positive").optional(),
  discountPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, "Stock must be non-negative").optional(),
  category: z.enum([
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
  ]).optional(),
  seasonality: z.string().optional(),
  unit: z.string().optional(),
  minOrderQuantity: z.number().int().positive().optional(),
  maxOrderQuantity: z.number().int().positive().optional().nullable(),
  organic: z.boolean().optional(),
  origin: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required").optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

// Get a single product by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { vendor } = await requireVendor();
    const { id } = params;

    // Get the product
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    // Check if product exists
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Ensure the vendor can only access their own products
    if (product.vendorId !== vendor.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a product by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { vendor } = await requireVendor();
    const { id } = params;

    // Get the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    // Check if product exists
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Ensure the vendor can only update their own products
    if (existingProduct.vendorId !== vendor.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const validatedData = updateProductSchema.parse(body);

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a product by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { vendor } = await requireVendor();
    const { id } = params;

    // Get the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    // Check if product exists
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Ensure the vendor can only delete their own products
    if (existingProduct.vendorId !== vendor.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
