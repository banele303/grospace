import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";

// GET /api/articles/[id] - Get single article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findFirst({
      where: { 
        OR: [
          { id: params.id },
          { slug: params.id }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // If article is not published, only admin can view
    if (!article.published) {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true }
      });

      if (!dbUser || dbUser.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[id] - Update article (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, excerpt, featuredImage, published, tags } = body;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    let slug = existingArticle.slug;
    
    // If title changed, generate new slug
    if (title && title !== existingArticle.title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      // Check if new slug is unique
      const slugExists = await prisma.article.findUnique({
        where: { 
          slug: newSlug,
          NOT: { id: params.id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Article with this title already exists" },
          { status: 400 }
        );
      }

      slug = newSlug;
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(title && { slug }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(published !== undefined && { 
          published,
          publishedAt: published && !existingArticle.published ? new Date() : existingArticle.publishedAt
        }),
        ...(tags && { tags })
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] - Delete article (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    await prisma.article.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
