"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Users, 
  Package, 
  TrendingUp, 
  ArrowRight,
  Sprout,
  Sun,
  Droplets,
  Play
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useVendorStatus } from "@/app/hooks/useVendorStatus";
import { useSafeAuth } from "@/app/hooks/useSafeAuth";
import { useAdminStatus } from "@/app/hooks/useAdminStatus";

interface MarketplaceStats {
  vendorCount: number;
  productCount: number;
  categoryStats: Array<{
    category: string;
    _count: { category: number };
  }>;
}

interface AgricultureHeroProps {
  stats: MarketplaceStats;
}

export function AgricultureHero({ stats }: AgricultureHeroProps) {
  const { user, isAuthenticated } = useSafeAuth();
  const { isAdmin, isLoading: adminLoading } = useAdminStatus();
  
  // Debug logging for admin status
  console.log('AgricultureHero - Admin status:', { isAdmin, adminLoading, isAuthenticated, user: user?.email });
  
  return (
    <>
      <div className="relative overflow-hidden min-h-[85vh] sm:min-h-[80vh] md:h-[70vh] flex items-center w-full bg-white">
        {/* Hero Background Image */}
        <div className="absolute inset-0 w-full mx-auto px-2 sm:px-4 md:px-6 bg-white lg:px-8">
          <div className="relative w-full h-full rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[40px] overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ 
                scale: 1,
                transition: { duration: 10, ease: "easeOut" }
              }}
              className="w-full h-full"
            >
              <Image 
                src="/farming-hero.jpg" 
                alt="Agricultural farming landscape"
                fill
                priority
                quality={100}
                sizes="100vw"
                className="object-cover w-full"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQIGAwAAAAAAAAAAAAABAgMEEQAFEiExEyJRYf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Amzs5lMdPI88R05YwCwDAkKCdiQDxq40raf8AUf/Z"
              />
            </motion.div>
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[40px]"></div>
            
            {/* Modern light effect overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent_70%)] rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[40px]"></div>
            
            {/* Subtle border glow effect */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[40px] ring-1 ring-white/20 ring-offset-0"></div>
          </div>
          
          {/* Enhanced decorative elements - hidden on mobile for better performance */}
          <motion.div 
            initial={{ opacity: 0.2, x: -10 }}
            animate={{ 
              opacity: [0.2, 0.3, 0.2],
              x: [-10, 10, -10],
              transition: { duration: 12, repeat: Infinity, ease: "easeInOut" } 
            }}
            className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-overlay filter blur-xl opacity-20"
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0.2, x: 10 }}
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              x: [10, -10, 10],
              transition: { duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 } 
            }}
            className="hidden lg:block absolute top-40 right-10 w-72 h-72 bg-gray-300 rounded-full mix-blend-overlay filter blur-xl opacity-20"
          ></motion.div>
        </div>

        <div className="relative w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Hero Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:space-y-8 px-2 sm:px-4 lg:px-6"
            >
              <div className="space-y-4 lg:space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3"
                >
                  <Badge className="bg-gradient-to-r from-gray-600 to-slate-700 text-white hover:from-gray-700 hover:to-slate-800 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium rounded-full shadow-lg">
                    🌱 Fresh & Local
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 backdrop-blur-sm border-white/60 text-white px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium rounded-full shadow-lg">
                    Farm to Table
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
                >
                  Fresh from
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent block">Local Farms</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-base sm:text-lg lg:text-xl text-gray-100 max-w-lg leading-relaxed"
                >
                  Connect directly with local farmers and producers. Get the freshest 
                  agricultural products delivered straight from the source to your table.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-4 sm:px-8 sm:py-6 rounded-xl"
                >
                  <Link href="/products" className="flex items-center justify-center gap-3 text-base sm:text-lg font-medium">
                    Shop Now
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                {/* Only show "Become a Vendor" button if user is not an admin and not loading */}
                {!isAdmin && !adminLoading && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 px-6 py-4 sm:px-8 sm:py-6 transition-all duration-300 rounded-xl"
                  >
                    <Link href="/vendors/register" className="flex items-center justify-center gap-2 text-base sm:text-lg font-medium">
                      <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Become a</span> Vendor
                    </Link>
                  </Button>
                )}
              </motion.div>

              {/* Quick Stats - Simplified for mobile */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 pt-6 sm:pt-8 lg:pt-12"
              >
                <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-400/80 to-indigo-500/80 rounded-lg sm:rounded-xl lg:rounded-2xl mb-2 sm:mb-4 mx-auto shadow-lg">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">
                    {stats.vendorCount}+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-100 font-medium">
                    Vendors
                  </div>
                </div>
                
                <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-indigo-400/80 to-purple-500/80 rounded-lg sm:rounded-xl lg:rounded-2xl mb-2 sm:mb-4 mx-auto shadow-lg">
                    <Package className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">
                    {stats.productCount}+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-100 font-medium">
                    Products
                  </div>
                </div>
                
                <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-400/80 to-blue-500/80 rounded-lg sm:rounded-xl lg:rounded-2xl mb-2 sm:mb-4 mx-auto shadow-lg">
                    <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">
                    98%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-100 font-medium">
                    Satisfaction
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual - Simplified for mobile */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-6">
                {/* Feature Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="bg-white/90 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl">
                          <Leaf className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">
                          Organic
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Certified organic products from trusted local farms
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mt-8"
                >
                  <Card className="bg-white/90 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl">
                          <Sprout className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">
                          Fresh
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Harvested daily and delivered within 24 hours
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="-mt-4"
                >
                  <Card className="bg-white/90 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl">
                          <Sun className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">
                          Seasonal
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Best seasonal produce at peak freshness
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mt-4"
                >
                  <Card className="bg-white/90 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl">
                          <Droplets className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">
                          Sustainable
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Environmentally conscious farming practices
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile Feature Cards - Simplified horizontal scroll */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:hidden mt-8"
            >
              <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                <Card className="min-w-[200px] bg-white/90 backdrop-blur-md border border-white/30 shadow-lg rounded-xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg">
                        <Leaf className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">Organic</h3>
                    </div>
                    <p className="text-xs text-gray-600">Certified organic products</p>
                  </CardContent>
                </Card>

                <Card className="min-w-[200px] bg-white/90 backdrop-blur-md border border-white/30 shadow-lg rounded-xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg">
                        <Sprout className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">Fresh</h3>
                    </div>
                    <p className="text-xs text-gray-600">Delivered within 24 hours</p>
                  </CardContent>
                </Card>

                <Card className="min-w-[200px] bg-white/90 backdrop-blur-md border border-white/30 shadow-lg rounded-xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg">
                        <Sun className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">Seasonal</h3>
                    </div>
                    <p className="text-xs text-gray-600">Peak freshness guaranteed</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
