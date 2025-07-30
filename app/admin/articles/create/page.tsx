import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArticleForm } from "@/app/components/admin/ArticleForm";

export default async function CreateArticlePage() {
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Article
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Write and publish a new article for your blog
        </p>
      </div>

      <ArticleForm />
    </div>
  );
}
