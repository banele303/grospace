import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Search,
  Filter,
  TrendingUp,
  Users,
  Award,
  AlertCircle
} from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { unstable_noStore as noStore } from "next/cache";

async function getVendorReviews(vendorId: string) {
  // Get reviews for vendor's products
  const reviews = await prisma.review.findMany({
    where: {
      product: {
        vendorId: vendorId,
      },
    },
    include: {
      user: true,
      product: {
        select: {
          name: true,
          images: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate review statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return {
    reviews,
    totalReviews,
    averageRating,
    ratingDistribution,
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default async function VendorReviewsPage() {
  noStore();
  const { user, vendor } = await requireVendor();
  const reviewData = await getVendorReviews(vendor.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-agricultural-800">Reviews & Ratings</h1>
          <p className="text-agricultural-600 mt-1">
            Manage customer feedback and improve your products
          </p>
        </div>
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {reviewData.averageRating.toFixed(1)}
                </p>
                <p className="text-sm text-agricultural-600">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {reviewData.totalReviews}
                </p>
                <p className="text-sm text-agricultural-600">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <ThumbsUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {reviewData.ratingDistribution[5] + reviewData.ratingDistribution[4]}
                </p>
                <p className="text-sm text-agricultural-600">Positive Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-agricultural-800">
                  {reviewData.ratingDistribution[2] + reviewData.ratingDistribution[1]}
                </p>
                <p className="text-sm text-agricultural-600">Needs Attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>
            Breakdown of customer ratings across all your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${reviewData.totalReviews > 0 
                        ? (reviewData.ratingDistribution[rating as keyof typeof reviewData.ratingDistribution] / reviewData.totalReviews) * 100 
                        : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-agricultural-600 w-12">
                  {reviewData.ratingDistribution[rating as keyof typeof reviewData.ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                Recent feedback from your customers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reviewData.reviews.length > 0 ? (
            <div className="space-y-6">
              {reviewData.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-agricultural-100 text-agricultural-700">
                        {review.user.firstName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-agricultural-800">
                            {review.user.firstName} {review.user.lastName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} />
                            <span className="text-sm text-agricultural-600">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-agricultural-50">
                          {review.product.name}
                        </Badge>
                      </div>
                      <p className="text-agricultural-700 mb-3">{review.comment}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Helpful
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">
                When customers leave reviews for your products, they&apos;ll appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
