"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/app/components/storefront/Navbar";
import { Footer } from "@/app/components/storefront/Footer";
import { 
  Truck, 
  MapPin, 
  Route, 
  Package, 
  Clock, 
  Leaf,
  Smartphone,
  TrendingDown,
  CheckCircle,
  Users,
  ArrowRight,
  Recycle,
  Globe
} from "lucide-react";

export default function GroDriverPage() {
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
                Efficient Agricultural Logistics
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-6">
                GroDriver
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-8">
                An Efficient Delivery Network for Agricultural Products. The logistical backbone of the GroSpace ecosystem, providing optimized transportation for farmers, producers, and distributors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white rounded-xl shadow-lg">
                  Join GroDriver Network
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-emerald-200 hover:border-emerald-500 rounded-xl">
                  Schedule Delivery
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* Hero Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/franchise-locations.png"
                  alt="GroDriver Delivery Network and Logistics"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Does GroDriver Do?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              GroDriver ensures agricultural products reach their destinations on time while reducing transportation costs and minimizing waste through optimized logistics.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Agricultural Goods Transportation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Specialized transport of fresh produce, poultry, animal feed, and compost using our web app for scheduling and route optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                  <Route className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Route Optimization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced route optimization technology plans efficient paths to reduce travel time, lower fuel costs, and ensure timely deliveries.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <ArrowRight className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Collection & Distribution</h3>
                <p className="text-gray-600 leading-relaxed">
                  Coordinated collection of eggs, produce, and waste from farms while delivering essential supplies, reducing multiple trips.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Feed Delivery Services</h3>
                <p className="text-gray-600 leading-relaxed">
                  Partnership with GroFeeds to deliver bulk and bagged animal feed directly to poultry and livestock farmers on schedule.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fertilizer & Compost Delivery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Timely delivery of pelletised compost and liquid fertilizers from GroFertiliser and GroFast to support healthy soil and crop yields.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Small-Scale Farmer Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Reliable logistics network for small quantities of produce, feed, or compost, especially beneficial for urban farmers.
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose GroDriver</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Partnering with GroDriver offers numerous benefits that streamline logistics, reduce costs, and improve operational efficiency.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <TrendingDown className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Reduced Transportation Costs</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Optimized delivery routes and coordinated collections help farmers reduce transportation costs, especially beneficial for small-scale operations.
              </p>
              {/* Cost Reduction Image Placeholder */}
              <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-emerald-200">
                <div className="text-center">
                  <TrendingDown className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Cost Optimization</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Guaranteed Timely Deliveries</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ensure agricultural products arrive on time, reducing spoilage risk for perishables and maintaining strong buyer relationships.
              </p>
              {/* Timely Delivery Image Placeholder */}
              <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-sky-200">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">On-Time Delivery</p>
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
                Route optimization technology reduces fuel consumption and emissions, providing environmentally friendly transportation solutions.
              </p>
              {/* Sustainability Image Placeholder */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-green-200">
                <div className="text-center">
                  <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Eco-Friendly Logistics</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Technology-Driven Solutions</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                GroDriver web app simplifies scheduling and delivery management with real-time updates and optimized routes for cutting-edge logistics.
              </p>
              {/* Technology Image Placeholder */}
              <div className="bg-gradient-to-br from-purple-50 to-sky-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-purple-200">
                <div className="text-center">
                  <Smartphone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Smart Logistics Platform</p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">GroDriver in the GroSpace Ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A key player connecting farmers, producers, and markets through an efficient and reliable logistics network across the GroSpace value chain.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">GroFeeds & GroFertiliser</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Delivering bulk feed and compost to farms ensuring smooth operations and timely input supply.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-10 h-10 text-sky-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">GroWaste Collection</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Collecting food, animal, and poly waste for repurposing into valuable products like compost and biogas.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Fresh Produce Distribution</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Delivering fresh produce to packhouses and markets in optimal condition through efficient handling.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Urban Farmer Support</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Providing vital logistics support for small-scale and urban farmers accessing markets and distribution.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            {/* Ecosystem Integration Image Placeholder */}
            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-emerald-200">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Truck className="w-12 h-12 text-emerald-600" />
                </div>
                <p className="text-gray-600 font-medium">GroDriver Logistics Network</p>
                <p className="text-sm text-gray-500">Delivery & Collection Routes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Features Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">GroDriver Web App Features</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Advanced technology platform that simplifies logistics management and delivery coordination for all users.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Route className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Route Planning</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI-powered route optimization reduces travel time, fuel costs, and environmental impact while ensuring timely deliveries.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track deliveries in real-time with updates on location, estimated arrival times, and delivery confirmations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Easy Scheduling</h3>
                <p className="text-gray-600 leading-relaxed">
                  Simple scheduling interface for deliveries and collections with flexible timing options and automated confirmations.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12">
            {/* App Interface Image Placeholder */}
            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-48 flex items-center justify-center border-2 border-dashed border-emerald-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Smartphone className="w-10 h-10 text-emerald-600" />
                </div>
                <p className="text-gray-600 font-medium">GroDriver Web App Interface</p>
                <p className="text-sm text-gray-500">Dashboard & Features</p>
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
              How to Get Started with GroDriver
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Farmers and businesses interested in using GroDriver can apply through the GroSpace Marketplace to access reliable, cost-effective transportation solutions.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Apply & Register</h4>
                <p className="text-gray-600">Apply through GroSpace Marketplace for logistics services</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-sky-600">2</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Web App</h4>
                <p className="text-gray-600">Get onboarded to the GroDriver web application platform</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Schedule & Track</h4>
                <p className="text-gray-600">Start scheduling deliveries and tracking shipments efficiently</p>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Join GroDriver Network
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Revolutionize Your Agricultural Logistics
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            GroDriver is revolutionizing agricultural transportation by providing reliable, technology-driven solutions for delivering and collecting goods. Join GroDriver today and start benefiting from efficient, cost-effective, and environmentally friendly delivery services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Join GroDriver Today
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all duration-200">
              Request Delivery Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
