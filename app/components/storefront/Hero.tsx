import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Play, ShoppingCart, Heart, Share2 } from "lucide-react"
import Link from "next/link"

export interface BannerData {
  id: string
  title: string
  imageString: string
}

export function Hero({ data }: { data: BannerData[] }) {
  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {data.map((item: BannerData) => (
            <CarouselItem key={item.id}>
              <div className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden rounded-none sm:rounded-2xl group">
                {/* Background Image with Overlay */}
                <Image
                  alt="Banner Image"
                  src={item.imageString || "/placeholder.svg"}
                  fill
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />

                {/* Mobile-optimized Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />

                {/* Content Container - Mobile-first responsive */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 lg:p-12">
                  {/* Top Section - Badge */}
                  <div className="flex justify-between items-start">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 transition-colors text-xs sm:text-sm"
                    >
                      Featured
                    </Badge>
                  </div>

                  {/* Bottom Section - Main Content */}
                  <div className="space-y-4 sm:space-y-6 px-0 sm:pl-4 lg:pl-8">
                    <div className="space-y-3 sm:space-y-4">
                      <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                        {item.title}
                      </h1>
                      <p className="text-sm sm:text-base lg:text-xl text-white/90 max-w-2xl leading-relaxed">
                        Discover amazing experiences and unlock new possibilities with our premium collection.
                      </p>
                    </div>

                    {/* Action Buttons - Mobile-optimized */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-white/90 font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/25 w-full sm:w-auto"
                      >
                        <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <Link href="/products" className="block w-full text-center sm:inline">
                          Get Started
                        </Link>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <Link href="/products" className="block w-full text-center sm:inline">
                          Shop Now
                        </Link>
                      </Button>
                    </div>

                    {/* Stats - Mobile-optimized layout */}
                    <div className="flex justify-center sm:justify-start gap-4 sm:gap-8 pt-2 sm:pt-4">
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">10K+</div>
                        <div className="text-xs sm:text-sm text-white/70">Happy Customers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">4.9</div>
                        <div className="text-xs sm:text-sm text-white/70">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">24/7</div>
                        <div className="text-xs sm:text-sm text-white/70">Support</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 right-8 transform -translate-y-1/2 hidden lg:block">
                  <div className="w-1 h-32 bg-gradient-to-b from-transparent via-white/50 to-transparent rounded-full" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Enhanced Navigation - Mobile-friendly */}
        <CarouselPrevious className="left-2 sm:left-4 lg:left-16 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:text-white w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 hover:scale-110" />
        <CarouselNext className="right-2 sm:right-4 lg:right-16 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:text-white w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 hover:scale-110" />
      </Carousel>

      {/* Bottom Indicator Dots - Mobile-optimized */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {data.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
          />
        ))}
      </div>
    </div>
  )
}
