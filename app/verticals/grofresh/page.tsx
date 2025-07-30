"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/app/components/storefront/Navbar";
import { Footer } from "@/app/components/storefront/Footer";
import { 
  Apple, 
  Package, 
  Globe, 
  Award, 
  CheckCircle, 
  Recycle,
  TrendingUp,
  Users,
  ArrowRight,
  Target,
  ShoppingCart,
  Truck,
  Leaf
} from "lucide-react";

export default function GroFreshPage() {
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
                Fresh Produce Aggregation & Processing
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-6">
                GroFresh
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-8">
                Aggregating and Processing Fresh Produce for Global Markets. At the heart of the fresh produce value chain, connecting farmers to local and international markets with quality processing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white rounded-xl shadow-lg">
                  Partner with GroFresh
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
                  src="/growfresh.png"
                  alt="GroFresh Fresh Produce Aggregation"
                  width={600}
                  height={384}
                  className="w-full h-96 object-cover"
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Does GroFresh Do?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              GroFresh streamlines the entire process from farm to market, collecting, processing, and distributing crops while ensuring the highest quality standards.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <Apple className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fresh Produce Aggregation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Collecting wide range of fresh crops from fruits and vegetables to grains and herbs, pooling harvests to create attractive volumes for large buyers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Processing & Packing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Stringent quality control standards ensure fresh, clean produce ready for sale in bulk packaging for wholesale or retail-ready formats.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Global Market Access</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connecting farmers to local grocery stores and international exporters, ensuring produce reaches consumers quickly in optimal condition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Control</h3>
                <p className="text-gray-600 leading-relaxed">
                  Robust quality control process ensuring all produce meets standards for appearance, freshness, and safety, building long-term buyer relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Recycle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Waste Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Minimizing waste during processing with off-spec produce sent to GroWaste for composting or GroFeeds for animal feed production.
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Farmers Should Partner with GroFresh</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Numerous advantages for farmers, particularly small-scale farmers who struggle to access large markets independently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Access to Larger Markets</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pooling produce with other farmers enables small-scale farmers to reach larger buyers, securing better prices and ensuring larger volume sales.
              </p>
              {/* Market Access Image Placeholder */}
              <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-emerald-200">
                <div className="text-center">
                  <Globe className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Global Market Network</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Efficient Processing & Packing</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                GroFresh handles cleaning, sorting, and packing, saving farmers time and resources to focus on growing crops and improving yields.
              </p>
              {/* Processing Image Placeholder */}
              <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-sky-200">
                <div className="text-center">
                  <Package className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Processing & Packaging</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Guaranteed Sales</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Contract farming model with pre-agreed pricing and market access reduces uncertainty from local market price fluctuations and inconsistent demand.
              </p>
              {/* Guaranteed Sales Image Placeholder */}
              <div className="bg-gradient-to-br from-purple-50 to-sky-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-purple-200">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Contract Farming Model</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Recycle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Reduced Waste</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Off-spec produce remains valuable through GroWaste and GroFeeds repurposing, ensuring farmers don&apos;t lose revenue from non-retail suitable produce.
              </p>
              {/* Waste Reduction Image Placeholder */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-green-200">
                <div className="text-center">
                  <Recycle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Zero Waste Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">GroFresh Product Categories</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Wide range of fresh produce categories processed and distributed through our quality-controlled systems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🍎</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fresh Fruits</h3>
                <p className="text-gray-600 leading-relaxed">
                  Apples, oranges, bananas, berries and seasonal fruits processed for retail and export markets.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🥬</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fresh Vegetables</h3>
                <p className="text-gray-600 leading-relaxed">
                  Leafy greens, root vegetables, and seasonal produce prepared for domestic and international distribution.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🌾</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Grains & Cereals</h3>
                <p className="text-gray-600 leading-relaxed">
                  Wheat, maize, rice and specialty grains processed and packaged for various market segments.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Herbs & Spices</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fresh herbs, aromatic spices and specialty crops for culinary and medicinal markets.
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">GroFresh in the GroSpace Ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Integral to the GroSpace value chain, providing the crucial link between farmers and buyers through efficient aggregation, processing, and distribution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">GroConsulting Support</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Farm audits and support ensure farmers meet production and sustainability standards for GroFresh partnerships.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-sky-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">GroDriver Logistics</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Efficient delivery to packhouses, retailers, and export facilities ensuring timely distribution with minimal waste.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Waste Repurposing</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Off-spec produce sent to GroWaste for composting or GroFeeds for feed, creating circular economy with full resource utilization.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Sustainability Focus</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Support for sustainable practices through GroFertiliser compost and GroFast fertilizers improving soil fertility and yields.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            {/* Ecosystem Integration Image Placeholder */}
            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-emerald-200">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Apple className="w-12 h-12 text-emerald-600" />
                </div>
                <p className="text-gray-600 font-medium">GroFresh Value Chain Integration</p>
                <p className="text-sm text-gray-500">Farm to Market Processing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Standards Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Quality Standards & Certifications</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Rigorous quality control processes ensure all produce meets the highest standards for domestic and international markets.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">International Standards</h3>
              <p className="text-gray-600 leading-relaxed">
                Compliance with international food safety and quality standards for global market access and consumer confidence.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Freshness Guarantee</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced processing and packaging techniques ensure maximum freshness retention from farm to consumer delivery.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Traceability System</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete farm-to-market traceability ensuring transparency and accountability throughout the supply chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How to Get Involved with GroFresh
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Farmers interested in partnering with GroFresh can apply through the GroSpace Marketplace. Once approved, receive support from GroConsulting to align farming practices with GroSpace standards.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Apply & Register</h4>
                <p className="text-gray-600">Submit application through GroSpace Marketplace platform</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-sky-600">2</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Approved</h4>
                <p className="text-gray-600">Receive GroConsulting support to meet quality standards</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Supplying</h4>
                <p className="text-gray-600">Begin supplying produce for processing and market access</p>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Partner with GroFresh
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Transform Your Fresh Produce Business
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            GroFresh is transforming fresh produce collection, processing, and sales, creating a more efficient and profitable model for farmers. Join GroFresh today and take advantage of opportunities to scale your farming business, access new markets, and ensure your produce reaches consumers in optimal condition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Join GroFresh Today
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all duration-200">
              Request Processing Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
