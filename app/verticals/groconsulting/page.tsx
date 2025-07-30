"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/app/components/storefront/Navbar";
import { Footer } from "@/app/components/storefront/Footer";
import { 
  Clipboard, 
  Users, 
  TrendingUp, 
  Shield, 
  Leaf, 
  HandHeart,
  CheckCircle,
  Building,
  FileCheck,
  ArrowRight,
  Target,
  Award
} from "lucide-react";

export default function GroConsultingPage() {
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
                Expert Guidance & Supply Agreements
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-6">
                GroConsulting
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-8">
                Supporting Farmers with Supply Agreements and Audits. A vital part of the GroSpace ecosystem providing expert guidance, farm audits, and access to valuable supply agreements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white rounded-xl shadow-lg">
                  Start Consulting
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-emerald-200 hover:border-emerald-500 rounded-xl">
                  Book Audit
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* Hero Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/groconsulting.png"
                  alt="GroConsulting Farm Audits and Supply Agreements"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Does GroConsulting Do?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              GroConsulting ensures farmers adhere to best practices in sustainability, efficiency, and quality control through expert guidance and comprehensive auditing services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <FileCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Farm Audits & Certification</h3>
                <p className="text-gray-600 leading-relaxed">
                  Detailed evaluation of farm operations to ensure they meet GroSpace standards for sustainability, quality, and efficiency. Become a certified GroSpace contract farmer.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                  <HandHeart className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Supply Agreements</h3>
                <p className="text-gray-600 leading-relaxed">
                  Secure supply agreements with buyers ensuring reliable and consistent markets with pre-determined pricing and guaranteed outlets for crops or livestock.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Clipboard className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Standard Operating Procedures</h3>
                <p className="text-gray-600 leading-relaxed">
                  Develop and implement SOPs covering planting, harvesting, livestock management, and processing to streamline operations and improve efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainability Consulting</h3>
                <p className="text-gray-600 leading-relaxed">
                  Promote environmentally friendly practices including organic fertilizers, water-saving technologies, and waste reduction partnerships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contract Farming Opportunities</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access contract farming opportunities through the GroSpace network with pre-agreed terms providing stable income and reduced financial risk.
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Farmers Should Use GroConsulting</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              GroConsulting offers numerous benefits that help farmers improve operations, secure market access, and optimize farming practices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <HandHeart className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Guaranteed Supply Agreements</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Secure supply agreements provide guaranteed buyers for produce, allowing farmers to focus on growing high-quality crops with reliable market access.
              </p>
              {/* Supply Agreement Image Placeholder */}
              <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-emerald-200">
                <div className="text-center">
                  <HandHeart className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Supply Agreement Process</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Improved Efficiency</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Implementation of SOPs improves operational efficiency, optimizes schedules, reduces waste, and streamlines management processes across all farm operations.
              </p>
              {/* Efficiency Image Placeholder */}
              <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-sky-200">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Efficiency Optimization</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Sustainability Benefits</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sustainable farming practices benefit both environment and profitability through natural fertilizers, efficient water use, and reduced input costs.
              </p>
              {/* Sustainability Image Placeholder */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-green-200">
                <div className="text-center">
                  <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Sustainable Practices</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Contract Farming Security</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Contract farming opportunities provide stable, predictable income while reducing exposure to market fluctuations and building long-term financial security.
              </p>
              {/* Contract Farming Image Placeholder */}
              <div className="bg-gradient-to-br from-purple-50 to-sky-50 rounded-2xl h-32 flex items-center justify-center border-2 border-dashed border-purple-200">
                <div className="text-center">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Contract Farming Model</p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">GroConsulting in the GroSpace Ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              An essential part of the GroSpace value chain, helping farmers adhere to best practices and secure market access through certification and supply agreements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Certification Process</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Conduct audits ensuring farms meet high GroSpace standards for sustainability, quality, and efficiency.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-sky-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Supply Chain Support</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Secure supply agreements with buyers ensuring pre-determined pricing and financial stability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Ecosystem Collaboration</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Work with GroWaste and GroFertiliser to implement sustainable practices and organic solutions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Innovation Guidance</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Optimize GroTower systems and GroFeeds for maximum productivity and cost savings.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            {/* Ecosystem Integration Image Placeholder */}
            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-emerald-200">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clipboard className="w-12 h-12 text-emerald-600" />
                </div>
                <p className="text-gray-600 font-medium">GroSpace Consulting Network</p>
                <p className="text-sm text-gray-500">Farm Support & Certification</p>
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
              How to Get Started with GroConsulting
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Farmers interested in improving operations, securing supply agreements, or accessing contract farming opportunities can apply through the GroSpace Marketplace.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Apply & Onboard</h4>
                <p className="text-gray-600">Apply through GroSpace Marketplace for consulting services</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-sky-600">2</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Farm Audit</h4>
                <p className="text-gray-600">Receive comprehensive farm audit and personalized recommendations</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Ongoing Support</h4>
                <p className="text-gray-600">Get continuous guidance for growth and market access</p>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Start with GroConsulting
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Optimize Your Farm with Expert Guidance
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            GroConsulting is a trusted partner for farmers looking to optimize operations, secure supply agreements, and access lucrative contract farming opportunities. Join us today and start optimizing your farm for sustainability, efficiency, and profitability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Join GroConsulting Today
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all duration-200">
              Schedule Farm Audit
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
