import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Navbar } from "@/app/components/storefront/Navbar";
import { Footer } from "@/app/components/storefront/Footer";

// Define interfaces
interface Author {
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  tags: string[];
  author: Author;
  published: boolean;
}

async function getPublishedArticles() {
  return await prisma.article.findMany({
    where: { published: true },
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
      publishedAt: 'desc'
    }
  });
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Articles
          </h1>
          <p className="text-gray-600 mt-2">
            Discover insights, tips, and stories from our blog
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              No articles published yet. Check back soon for new content!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  {article.featuredImage && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">
                      {article.title}
                    </CardTitle>
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={article.author.profileImage || "/default-avatar.png"}
                          alt={`${article.author.firstName} ${article.author.lastName}`}
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full"
                        />
                        <span>
                          {article.author.firstName} {article.author.lastName}
                        </span>
                      </div>
                      <span>
                        {article.publishedAt && format(article.publishedAt, "MMM dd, yyyy")}
                      </span>
                    </div>
                    
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{article.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
