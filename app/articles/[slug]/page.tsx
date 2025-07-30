import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string) {
  return await prisma.article.findUnique({
    where: { 
      slug,
      published: true 
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true
        }
      }
    }
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {article.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b">
            <div className="flex items-center space-x-4">
              <Image
                src={article.author.profileImage || "/default-avatar.png"}
                alt={`${article.author.firstName} ${article.author.lastName}`}
                className="h-12 w-12 rounded-full"
                width={48}
                height={48}
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {article.author.firstName} {article.author.lastName}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Published on {article.publishedAt && format(new Date(article.publishedAt), "MMMM dd, yyyy")}
                </div>
              </div>
            </div>
            
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8">
            <Image
              src={article.featuredImage}
              alt={article.title}
              className="w-full aspect-video object-cover rounded-lg"
              width={1200}
              height={675}
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">
            {article.content}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {format(new Date(article.updatedAt), "MMMM dd, yyyy")}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
