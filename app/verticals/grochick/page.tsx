"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  ShoppingCart, 
  Award, 
  TrendingUp,
  Building2,
  Package,
  CheckCircle,
  Users,
  Target,
  Leaf,
  ArrowRight,
  Egg,
  ChefHat
} from "lucide-react";
import { Navbar } from "@/app/components/storefront/Navbar";
import { Footer } from "@/app/components/storefront/Footer";

export default function GroChickPage() {
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
                Poultry Market Solutions
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-6">
                GroChick
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Poultry Aggregator Providing Markets for Chicken and Eggs
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                GroChick plays a pivotal role in the GroSpace ecosystem by acting as an aggregator of poultry products, 
                including fresh chicken, table eggs, and fertile eggs. For poultry farmers, GroChick offers a reliable 
                and sustainable way to get their products to market.
              </p>
            </div>
            <div className="relative">
              {/* Hero GroChick Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/spinash4.png"
                  alt="GroChick Poultry Operations and Processing"
                  width={600}
                  height={384}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Connecting Farmers with Markets</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              By connecting farmers with distributors and retailers, GroChick ensures that poultry products are processed 
              and sold to meet the growing demand for high-quality, farm-raised chickens and eggs.
            </p>
          </div>

          {/* Overview Image Placeholder */}
          <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-emerald-200 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-gray-600 font-medium">Supply Chain Network</p>
              <p className="text-sm text-gray-500">Farm to Market Connection</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Standards</h3>
              <p className="text-gray-600 leading-relaxed">
                Through its network, GroChick helps poultry farmers gain access to larger markets, improve their product quality, 
                and reduce waste, all while maintaining the highest standards for animal welfare and food safety.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Market Access</h3>
              <p className="text-gray-600 leading-relaxed">
                GroChick provides farmers with reliable market access, ensuring consistent demand for their poultry products 
                while connecting them with distributors and retailers across various markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What GroChick Does Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Does GroChick Do?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              GroChick aggregates, processes, and distributes poultry products while ensuring quality and market access for farmers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Package className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aggregation of Poultry Products</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                GroChick aggregates poultry products from farmers, including broiler chickens, table eggs, and fertile eggs. 
                By collecting and processing these products in bulk, GroChick helps small and large poultry farmers access larger markets.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This ensures consistent, high-quality poultry products that meet market demand.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Processing and Packaging</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                After aggregating poultry products, GroChick processes them under strict quality and safety standards. 
                Chickens are processed into fresh cuts, while table eggs are sorted, cleaned, and packaged for retail sale.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Fertile eggs are handled with care to maintain their viability for hatching, ensuring premium quality for breeders.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Guaranteed Market Access</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                One of the key benefits GroChick provides to poultry farmers is guaranteed market access. Through the GroSpace Marketplace, 
                GroChick connects farmers with a range of buyers, from local grocery stores to international distributors.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This ensures farmers have a reliable and consistent market for their products, reducing financial risks.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Control</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                GroChick implements rigorous quality control processes to ensure that all poultry products meet market standards 
                for freshness, safety, and quality. Whether processing chickens or eggs, GroChick adheres to strict protocols.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This ensures food safety and consumer satisfaction across all products.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300 md:col-span-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainable Practices</h3>
              <p className="text-gray-600 leading-relaxed">
                GroChick promotes sustainable poultry farming practices by working with GroFeeds to provide farmers with high-quality feed 
                made from grains and food waste. This reduces reliance on conventional feed sources and contributes to the overall 
                sustainability of the poultry farming process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The Benefits of Partnering with GroChick</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              For poultry farmers, partnering with GroChick offers numerous advantages that help improve operations, 
              increase profitability, and access larger markets.
            </p>
          </div>

          {/* Benefits Image Placeholder */}
          <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-emerald-200 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-gray-600 font-medium">Partnership Benefits</p>
              <p className="text-sm text-gray-500">Farmer Success Stories</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Reliable Market for Your Poultry</h4>
              <p className="text-gray-600">GroChick provides farmers with a consistent and reliable market, offering the stability needed to expand operations.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Egg className="w-8 h-8 text-sky-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">High-Quality Feed</h4>
              <p className="text-gray-600">Through partnership with GroFeeds, access to sustainably produced poultry feed ensures healthy chickens and optimal growth.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Contract Farming Model</h4>
              <p className="text-gray-600">Pre-determined pricing protects farmers from market fluctuations and ensures stable income throughout the year.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Improved Product Quality</h4>
              <p className="text-gray-600">Strict quality control processes ensure products meet highest standards and build solid market reputation.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Support for Growth</h4>
              <p className="text-gray-600">Ongoing support including training and resources through GroConsulting helps improve farming practices and profitability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Role Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">GroChick's Role in the GroSpace Ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              As part of the broader GroSpace ecosystem, GroChick works seamlessly with other "Gro" businesses to ensure 
              that poultry farmers can access everything they need for success.
            </p>
          </div>

          {/* Ecosystem Image Placeholder */}
          <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-emerald-200 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-gray-600 font-medium">Ecosystem Integration</p>
              <p className="text-sm text-gray-500">Connected Value Chain</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Feed Supply</h3>
                  <p className="text-gray-600 leading-relaxed">
                    GroChick partners with GroFeeds to supply farmers with high-quality, sustainable feed made from grains and food waste. 
                    This ensures that chickens are raised on a balanced diet that promotes health and productivity.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Egg className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 flex justify-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
                    <Truck className="w-8 h-8 text-sky-600" />
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Logistics and Distribution</h3>
                  <p className="text-gray-600 leading-relaxed">
                    After processing, poultry products are delivered to buyers through the GroDriver network. This ensures that 
                    fresh chicken and eggs reach their destinations quickly and efficiently, reducing waste and ensuring highest product quality.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Market Access</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Through the GroSpace Marketplace, GroChick connects farmers with buyers, ensuring a stable market for poultry products. 
                    Farmers can focus on raising high-quality chickens and eggs, knowing that GroChick will handle marketing and sales.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How to Become a GroChick Farmer
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Poultry farmers interested in joining the GroChick network can apply through the GroSpace Marketplace. 
            Once accepted, farmers will receive support from GroConsulting and access to pre-determined pricing, 
            market demand, and high-quality feed.
          </p>
          
          {/* CTA Image Placeholder */}
          <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-48 flex items-center justify-center border-2 border-dashed border-emerald-200 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-gray-600 font-medium">Join Our Network</p>
              <p className="text-sm text-gray-500">Application & Onboarding Process</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Become a GroChick Farmer
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all duration-200">
              <Link href="/about">Learn More About GroSpace</Link>
            </Button>
          </div>
          
          <div className="mt-12 bg-emerald-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Join GroChick Today</h3>
            <p className="text-gray-600 leading-relaxed">
              Take your poultry farm to the next level with guaranteed market access, high-quality feed, and ongoing support. 
              GroChick is revolutionizing the way poultry farmers bring their products to market with a focus on sustainability, 
              quality, and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
