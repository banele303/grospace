import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireVendor } from "@/app/lib/auth";

// For now, we'll use a simple categories table approach
// Later you can decide if you want to make categories vendor-specific or global

// Simple in-memory storage for categories (in production, use a database)
let categories: Array<{ id: string; name: string; image: string; createdAt: Date }> = [];

// GET - Fetch all categories
export async function GET() {
  try {
    // Return only user-created categories (no mock data)
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    await requireVendor();
    
    const { name, image } = await request.json();
    
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: "Category image is required" },
        { status: 400 }
      );
    }

    // Check for duplicates
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase().trim())) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const newCategory = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      image: image,
      createdAt: new Date()
    };

    categories.push(newCategory);
    
    return NextResponse.json({ 
      success: true, 
      message: "Category created successfully",
      category: newCategory
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// PUT - Update a category
export async function PUT(request: NextRequest) {
  try {
    await requireVendor();
    
    const { id, name, image } = await request.json();
    
    if (!id || !name) {
      return NextResponse.json(
        { error: "Category ID and name are required" },
        { status: 400 }
      );
    }

    // Find category to update
    const categoryIndex = categories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check for duplicate names (excluding current category)
    if (categories.some(cat => cat.id !== id && cat.name.toLowerCase() === name.toLowerCase().trim())) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    // Update category
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name: name.trim(),
      ...(image && { image })
    };
    
    return NextResponse.json({ 
      success: true, 
      message: "Category updated successfully",
      category: categories[categoryIndex]
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    await requireVendor();
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Find and remove category
    const initialLength = categories.length;
    categories = categories.filter(cat => cat.id !== id);
    
    if (categories.length === initialLength) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Category deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
