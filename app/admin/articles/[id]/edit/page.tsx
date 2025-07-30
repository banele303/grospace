import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArticleForm } from "@/app/components/admin/ArticleForm";

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

async function getArticle(id: string) {
  return await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      featuredImage: true,
      published: true,
      tags: true
    }
  });
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/");
  }

  const article = await getArticle(params.id);

  if (!article) {
    notFound();
  }

  // Convert null values to undefined to match ArticleForm props type
  const formattedArticle = {
    ...article,
    excerpt: article.excerpt || undefined,
    featuredImage: article.featuredImage || undefined
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Article
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update your article content and settings
        </p>
      </div>

      <ArticleForm article={formattedArticle} />
    </div>
  );
}
