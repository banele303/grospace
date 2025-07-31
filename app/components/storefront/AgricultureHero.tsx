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
  return (
    <>
      <div className="relative overflow-hidden min-h-[100vh] md:h-[60vh] flex items-center w-full bg-white">
        {/* Hero Background Image */}
        <div className="absolute inset-0 w-full ] mx-auto px-4 sm:px-6 bg-white lg:px-8">
          <div className="relative w-full h-full rounded-2xl sm:rounded-3xl lg:rounded-[40px] overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent rounded-2xl sm:rounded-3xl lg:rounded-[40px]"></div>
            
            {/* Modern light effect overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent_70%)] rounded-2xl sm:rounded-3xl lg:rounded-[40px]"></div>
            
            {/* Subtle border glow effect */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl lg:rounded-[40px] ring-1 ring-white/20 ring-offset-0"></div>
          </div>
          
          {/* Enhanced decorative elements */}
          <motion.div 
            initial={{ opacity: 0.2, x: -10 }}
            animate={{ 
              opacity: [0.2, 0.3, 0.2],
              x: [-10, 10, -10],
              transition: { duration: 12, repeat: Infinity, ease: "easeInOut" } 
            }}
            className="absolute top-20 left-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-overlay filter blur-xl opacity-20"
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0.2, x: 10 }}
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              x: [10, -10, 10],
              transition: { duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 } 
            }}
            className="absolute top-40 right-10 w-72 h-72 bg-gray-300 rounded-full mix-blend-overlay filter blur-xl opacity-20"
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0.2, y: 10 }}
            animate={{ 
              opacity: [0.2, 0.3, 0.2],
              y: [10, -10, 10],
              transition: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 } 
            }}
            className="absolute bottom-20 left-[40%] w-96 h-96 bg-gray-200 rounded-full mix-blend-overlay filter blur-xl opacity-20"
          ></motion.div>
        </div>

        <div className="relative w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-6">
            {/* Hero Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <Badge className="bg-gradient-to-r from-gray-600 to-slate-700 text-white hover:from-gray-700 hover:to-slate-800 px-6 py-3 text-sm font-medium rounded-full shadow-lg">
                    🌱 Fresh & Local
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 backdrop-blur-sm border-white/60 text-white px-6 py-3 text-sm font-medium rounded-full shadow-lg">
                    Farm to Table
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl lg:text-7xl font-bold text-white leading-tight"
                >
                  Fresh from
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent block">Local Farms</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-xl text-gray-100 max-w-lg leading-relaxed"
                >
                  Connect directly with local farmers and producers. Get the freshest 
                  agricultural products delivered straight from the source to your table.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 rounded-xl"
                >
                  <Link href="/products" className="flex items-center gap-3 text-lg font-medium">
                    Shop Now
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 px-8 py-6 transition-all duration-300 rounded-xl"
                >
                  <Link href="/vendors/register" className="flex items-center gap-2 text-lg font-medium">
                    <Play className="h-5 w-5" />
                    Become a Vendor
                  </Link>
                </Button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="grid grid-cols-3 gap-8 pt-12"
              >
                <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400/80 to-indigo-500/80 rounded-2xl mb-4 mx-auto shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stats.vendorCount}+
                  </div>
                  <div className="text-sm text-gray-100 font-medium">
                    Local Vendors
                  </div>
                </div>
                
                <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-400/80 to-purple-500/80 rounded-2xl mb-4 mx-auto shadow-lg">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stats.productCount}+
                  </div>
                  <div className="text-sm text-gray-100 font-medium">
                    Fresh Products
                  </div>
                </div>
                
                <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400/80 to-blue-500/80 rounded-2xl mb-4 mx-auto shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    98%
                  </div>
                  <div className="text-sm text-gray-100 font-medium">
                    Satisfaction
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
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
          </div>
        </div>
      </div>
    </>
  );
}
