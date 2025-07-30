"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/app/components/storefront/Navbar";
import { Footer } from "@/app/components/storefront/Footer";
import { 
  Beef, 
  Wheat, 
  Recycle, 
  DollarSign, 
  TrendingDown, 
  Leaf,
  CheckCircle,
  Users,
  ArrowRight,
  Target,
  Award,
  ShoppingCart,
  Truck
} from "lucide-react";

export default function GroFeedsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-sky-500/5"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                Sustainable Animal Feed Production
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-6">
                GroFeeds
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-8">
                Feed Production for Poultry and Livestock Farmers. A key player in the GroSpace ecosystem providing high-quality, sustainable feed using grains and repurposed food waste.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white rounded-xl shadow-lg">
                  Order Feed Now
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-emerald-200 hover:border-emerald-500 rounded-xl">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* Hero Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/grofeeds.png"
                  alt="GroFeeds Sustainable Animal Feed Production"
                  width={600}
                  height={384}
                  className="w-full h-96 object-cover"
                  priority={true}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Does GroFeeds Do?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              GroFeeds produces nutritious, cost-effective, and environmentally responsible animal feed using grains and food waste sourced from GroWaste.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="w-full h-48 relative">
                <Image 
                  src="/best-selling-feed-1.jpg" 
                  alt="Animal Feed Manufacturing" 
                  width={400}
                  height={192}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  quality={85}
                />
              </div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 relative -mt-16 border-4 border-white shadow-md">
                  <Beef className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Animal Feed Manufacturing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Specialized production of animal feed from grains and repurposed food waste, designed to meet nutritional needs of poultry and livestock.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="w-full h-48 relative">
                <Image 
                  src="/best-selling-feed-2.jpg" 
                  alt="Sustainable Sourcing" 
                  width={400}
                  height={192}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  quality={85}
                />
              </div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 relative -mt-16 border-4 border-white shadow-md">
                  <Recycle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainable Sourcing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Innovative use of food waste collected by GroWaste, processing vegetable and fruit scraps into high-nutrient feed reducing conventional feed reliance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="w-full h-48 relative">
                <Image 
                  src="/best-selling-feed-3.jpg" 
                  alt="Nutrient-Dense Formulations" 
                  width={400}
                  height={192}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  quality={85}
                />
              </div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6 relative -mt-16 border-4 border-white shadow-md">
                  <Target className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nutrient-Dense Formulations</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nutritionally optimized feed batches tailored for broiler chickens, laying hens, and livestock to promote optimal health, growth, and production.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="w-full h-48 relative">
                <Image 
                  src="/best-selling-feed-4.jpg" 
                  alt="Affordable Feed Solutions" 
                  width={400}
                  height={192}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  quality={85}
                />
              </div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 relative -mt-16 border-4 border-white shadow-md">
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Affordable Feed Solutions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cost-effective alternative to traditional commercial feeds by incorporating food waste, helping farmers lower production costs without sacrificing quality.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="w-full h-48 relative">
                <Image 
                  src="/best-selling-feed-5.jpg" 
                  alt="GroDriver Distribution" 
                  width={400}
                  height={192}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  quality={85}
                />
              </div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 relative -mt-16 border-4 border-white shadow-md">
                  <Truck className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">GroDriver Distribution</h3>
                <p className="text-gray-600 leading-relaxed">
                  Efficient feed distribution through GroDriver logistics network with timely delivery and egg collection during feed deliveries.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Farmers Should Choose GroFeeds</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Partnering with GroFeeds provides benefits that go beyond affordable feed, ensuring optimal animal health and sustainable farming practices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <TrendingDown className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Significant Cost Savings</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Lower prices than traditional commercial feeds by sourcing raw materials from food waste, enabling high-quality animal nutrition without breaking the bank.
              </p>
              {/* Cost Savings Image */}
              <div className="rounded-2xl h-32 relative overflow-hidden">
                <Image 
                  src="/grofeeds-cost-savings.jpg" 
                  alt="Cost Reduction Benefits" 
                  width={600}
                  height={200}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/40 to-transparent flex items-center">
                  <div className="ml-4 bg-white/80 p-2 rounded-lg shadow-sm">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                    <p className="text-xs font-medium text-emerald-800">Cost Reduction</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Superior Nutritional Quality</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Feed designed to promote optimal growth, productivity, and health leading to higher egg production from laying hens and faster growth in broiler chickens.
              </p>
              {/* Quality Image */}
              <div className="rounded-2xl h-32 relative overflow-hidden">
                <Image 
                  src="/grofeeds-quality.jpg" 
                  alt="Nutritional Excellence" 
                  width={600}
                  height={200}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600/40 to-transparent flex items-center">
                  <div className="ml-4 bg-white/80 p-2 rounded-lg shadow-sm">
                    <Award className="w-6 h-6 text-sky-600" />
                    <p className="text-xs font-medium text-sky-800">Premium Quality</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Environmental Sustainability</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Promotes sustainability by using repurposed food waste, reducing environmental impact and helping farmers lower their carbon footprint.
              </p>
              {/* Sustainability Image */}
              <div className="rounded-2xl h-32 relative overflow-hidden">
                <Image 
                  src="/grofeeds-sustainability.jpg" 
                  alt="Environmental Sustainability" 
                  width={600}
                  height={200}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/40 to-transparent flex items-center">
                  <div className="ml-4 bg-white/80 p-2 rounded-lg shadow-sm">
                    <Leaf className="w-6 h-6 text-green-600" />
                    <p className="text-xs font-medium text-green-800">Eco-Friendly</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Reliable Supply & Support</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Partnership with GroDriver ensures timely deliveries and GroConsulting provides guidance on optimizing feed usage and farming practices.
              </p>
              {/* Reliability Image */}
              <div className="rounded-2xl h-32 relative overflow-hidden">
                <Image 
                  src="/grofeeds-reliability.jpg" 
                  alt="Reliable Supply Network" 
                  width={600}
                  height={200}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-transparent flex items-center">
                  <div className="ml-4 bg-white/80 p-2 rounded-lg shadow-sm">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                    <p className="text-xs font-medium text-purple-800">Reliable Supply</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Types Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">GroFeeds Product Range</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Specialized feed formulations tailored for different animal types and production goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="w-full h-48 relative">
                <Image 
                  src="/grofeeds-broiler.jpg" 
                  alt="Broiler Chicken Feed" 
                  width={400}
                  height={192}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  quality={85}
                  priority
                />
              </div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 relative -mt-16 border-4 border-white shadow-md">
                  <span className="text-2xl">🐔</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Broiler Chicken Feed</h3>
                <p className="text-gray-600 leading-relaxed">
                  High-protein formulations designed for rapid growth and optimal meat production in broiler chickens.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="w-full h-48 relative">
                <Image 
                  src="/grofeeds-layer.jpg" 
                  alt="Layer Hen Feed" 
                  width={400}
                  height={192}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  quality={85}
                />
              </div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 relative -mt-16 border-4 border-white shadow-md">
                  <span className="text-2xl">🥚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Layer Hen Feed</h3>
                <p className="text-gray-600 leading-relaxed">
                  Calcium-enriched feed formulated to maximize egg production and maintain optimal laying hen health.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="w-full h-48 relative">
                <Image 
                  src="/grofeeds-livestock.jpg" 
                  alt="Livestock Feed" 
                  width={400}
                  height={192}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  quality={85}
                />
              </div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-6 relative -mt-16 border-4 border-white shadow-md">
                  <Beef className="w-8 h-8 text-brown-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Livestock Feed</h3>
                <p className="text-gray-600 leading-relaxed">
                  Balanced nutrition for cattle, goats, and sheep supporting healthy growth and productive livestock operations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ecosystem Integration Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">GroFeeds in the GroSpace Ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A crucial role in supporting sustainable and efficient farming practices through the circular economy approach.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Food Waste Repurposing</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Collaborates with GroWaste to source safe food waste, converting it into nutritious feed with full resource utilization.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-sky-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Efficient Distribution</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                GroDriver ensures efficient feed delivery while collecting farm products, creating streamlined logistics.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Circular Economy</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Vital part of sustainability commitment, reducing environmental impact while supporting circular resource optimization.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Farmer Support</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Provides affordable solutions for small and large-scale farmers, reducing operating costs and improving profitability.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            {/* Ecosystem Integration Image */}
            <div className="rounded-3xl overflow-hidden h-64 relative">
              <Image 
                src="/grofeeds-ecosystem.jpg" 
                alt="GroFeeds Ecosystem Integration" 
                width={1200}
                height={300}
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent flex items-end justify-center pb-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Beef className="w-12 h-12 text-emerald-600" />
                  </div>
                  <p className="text-white font-medium text-xl">GroFeeds Ecosystem Integration</p>
                  <p className="text-white/80 text-sm">Sustainable Feed Production Chain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How to Get Started with GroFeeds
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Farmers interested in using GroFeeds for poultry and livestock can apply through the GroSpace Marketplace for regular feed deliveries through GroDriver.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Apply Online</h4>
                <p className="text-gray-600">Register through GroSpace Marketplace for feed services</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-sky-600">2</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Onboarded</h4>
                <p className="text-gray-600">Receive support from GroConsulting for feed optimization</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Regular Delivery</h4>
                <p className="text-gray-600">Start receiving quality feed through GroDriver network</p>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Start with GroFeeds
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Leading Sustainable Feed Production
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            GroFeeds is leading the way in sustainable feed production by offering high-quality, nutrient-dense feed made from repurposed food waste. Join GroFeeds today and start feeding your animals with affordable, sustainable feed that improves health and productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Join GroFeeds Today
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all duration-200">
              Request Feed Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
