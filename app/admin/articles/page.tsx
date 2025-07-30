import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ArticlesTable } from "@/app/components/admin/ArticlesTable";

async function getArticles() {
  return await prisma.article.findMany({
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export default async function ArticlesPage() {
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

  const articles = await getArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Articles Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage blog articles for your site
          </p>
        </div>
        <Link href="/admin/articles/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Article
          </Button>
        </Link>
      </div>

      <ArticlesTable articles={articles} />
    </div>
  );
}
