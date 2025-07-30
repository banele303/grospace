"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/app/components/storefront/Navbar";
import { Footer } from "@/app/components/storefront/Footer";
import { 
  Wheat, 
  Building2, 
  TrendingUp, 
  Shield, 
  Recycle, 
  MapPin,
  CheckCircle,
  Users,
  Scale,
  Globe,
  ArrowRight
} from "lucide-react";

export default function GroCommoditiesPage() {
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
                Grain Aggregation & Market Access
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-6">
                GroCommodities
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-8">
                Aggregating Grains for Stable Markets. A cornerstone of the GroSpace ecosystem, focused on aggregating grains produced by GroSpace-accredited farmers and providing reliable market access with fair pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white rounded-xl shadow-lg">
                  Join GroCommodities
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
                  src="/grocommodities.png"
                  alt="GroCommodities Grain Aggregation and Market Access"
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

      {/* What We Do Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Does GroCommodities Do?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              GroCommodities collects, stores, and distributes grains such as wheat, maize, and soybeans, providing farmers with reliable market access and fair pricing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <Scale className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Grain Aggregation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Collecting grains from GroSpace-accredited farmers across the network, pooling crops into larger volumes attractive to major buyers, exporters, and processors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Storage Solutions</h3>
                <p className="text-gray-600 leading-relaxed">
                  State-of-the-art storage facilities ensure grains remain in optimal condition, preventing losses due to spoilage, pests, or weather.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Market Access</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connecting farmers to local, national, and international markets with pre-determined pricing, protecting from price volatility.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Control</h3>
                <p className="text-gray-600 leading-relaxed">
                  Rigorous quality standards ensure grains meet buyer specifications, including grading based on size, moisture content, and purity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Recycle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainability Initiatives</h3>
                <p className="text-gray-600 leading-relaxed">
                  Supporting sustainable farming practices through organic fertilizers and best practices for soil health and crop rotation.
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Farmers Should Work with GroCommodities</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              GroCommodities offers farmers stability, quality protection, and market reach that transforms their grain farming operations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Guaranteed Market Access</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pre-determined pricing for grain crops reduces uncertainty and financial risk from fluctuating market conditions. Focus on growing high-quality crops with confidence in guaranteed sales.
              </p>
              {/* Market Access Image Placeholder */}
              <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-emerald-200">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Market Access Visualization</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Quality & Storage Protection</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Professional storage facilities protect grain from spoilage, pests, and weather damage. Maintain optimal quality and maximize income through proper preservation.
              </p>
              {/* Storage Image Placeholder */}
              <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-sky-200">
                <div className="text-center">
                  <Building2 className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Storage Facility Visualization</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Increased Market Reach</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Access both domestic and international markets through grain aggregation. Reach larger buyers and export opportunities previously unavailable to individual farmers.
              </p>
              {/* Global Market Image Placeholder */}
              <div className="bg-gradient-to-br from-purple-50 to-sky-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-purple-200">
                <div className="text-center">
                  <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Global Market Network</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Recycle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Sustainability Support</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Benefit from commitment to sustainable farming practices. Use organic fertilizers, improve soil health, and enhance long-term farm profitability.
              </p>
              {/* Sustainability Image Placeholder */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-green-200">
                <div className="text-center">
                  <Recycle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Sustainable Practices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Integration Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">GroCommodities in the GroSpace Ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A key player in the GroSpace value chain, connecting farmers to markets through aggregation, quality control, and sustainable practices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Aggregation for Scale</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Pooling grains from multiple farms to reach bigger buyers and export markets with fair pricing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-sky-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Storage & Preservation</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Professional facilities protect grain quality and value, reducing waste and maximizing farmer returns.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">GroConsulting Collaboration</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Guidance on best practices for grain production, soil management, and organic fertilizer use.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">GroDriver Logistics</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Efficient delivery to buyers ensures fresh, high-quality grains and prompt farmer payments.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            {/* Ecosystem Integration Image Placeholder */}
            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-emerald-200">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Wheat className="w-12 h-12 text-emerald-600" />
                </div>
                <p className="text-gray-600 font-medium">GroSpace Ecosystem Integration</p>
                <p className="text-sm text-gray-500">Value Chain Visualization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How to Get Started with GroCommodities
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Farmers interested in working with GroCommodities can apply through the GroSpace Marketplace. Once approved, we&apos;ll handle aggregation, storage, and distribution of your grain crops.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Apply Online</h4>
                <p className="text-gray-600">Submit your application through the GroSpace Marketplace</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-sky-600">2</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Approved</h4>
                <p className="text-gray-600">Meet quality standards and become a certified partner</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Selling</h4>
                <p className="text-gray-600">Begin aggregating and selling your grains through our network</p>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Apply to GroCommodities
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Transform Your Grain Farming with GroCommodities
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            GroCommodities is transforming grain farming by providing reliable buyers, secure pricing, and professional storage solutions. Join us today and access the stable markets you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Join GroCommodities Today
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all duration-200">
              Learn More About Our Services
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
