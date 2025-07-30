"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Users, 
  Target, 
  TrendingUp,
  Droplets,
  Leaf,
  Building,
  CheckCircle,
  Award,
  BarChart3,
  Sprout,
  Settings
} from "lucide-react";
import { Navbar } from "@/app/components/storefront/Navbar";
import { Footer } from "@/app/components/storefront/Footer";

export default function TrainingPage() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

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
                Professional Agricultural Training
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-6">
                Farm Training
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The GroSpace Way
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                Empowering farmers with the skills, knowledge, and strategies they need to maximize yields, 
                reduce costs, and grow their businesses sustainably. Our comprehensive training programs 
                focus on sustainable agriculture, efficient resource management, and innovative farming techniques.
              </p>
            </div>
            <div className="relative">
              {/* Hero Training Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/future-faming.png"
                  alt="Future of Farming Training"
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Training Matters Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Training Matters for Farmers</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Farming is an ever-evolving industry, and modern farmers must stay ahead of the curve to remain competitive. 
                Traditional farming methods, while effective in the past, often fail to address the complexities of today's 
                agricultural challenges—climate change, soil degradation, water scarcity, and the increasing demand for 
                sustainable food production.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                GroSpace understands these challenges and works directly with farmers to provide tailored training programs. 
                We ensure that farmers have access to the latest farming techniques, technologies, and best practices that 
                not only increase productivity but also promote environmental stewardship.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Maximizing Yields Through Knowledge</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We train farmers in methods that optimize crop growth and improve soil fertility, ensuring that 
                      every square meter of land is used efficiently. This is especially important in regions where 
                      land and resources are limited, and high productivity is essential.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Leaf className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability as a Core Principle</h3>
                    <p className="text-gray-600 leading-relaxed">
                      GroSpace emphasizes sustainable farming practices that protect the environment and reduce waste. 
                      Our training programs teach farmers how to manage resources like water, fertilizer, and land more 
                      effectively. This not only benefits the environment but also helps farmers reduce costs and improve profitability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {/* Why Training Matters Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/ecosystem.png"
                  alt="Sustainable Farming Ecosystem"
                  width={500}
                  height={320}
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Components Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Key Components of GroSpace Farm Training</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At the core of GroSpace's training program are key components that make our approach unique, 
              including farm audits, SOP development, consulting, and innovative tools like GroTowers.
            </p>
          </div>

          {/* Training Components Image Placeholder */}
          <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-emerald-200 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-gray-600 font-medium">Training Components Overview</p>
              <p className="text-sm text-gray-500">Farm Audit & SOP Development Process</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Farm Audits</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Before beginning any training program, GroSpace conducts a detailed farm audit to assess current operations. 
                This audit helps identify areas for improvement, such as inefficient use of water or labor, suboptimal crop 
                rotation practices, or challenges with pest management.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The farm audit includes evaluation of infrastructure, equipment, and overall management to ensure all 
                aspects align with sustainable practices.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Standard Operating Procedures (SOPs)</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Once the farm audit is complete, GroSpace helps farmers develop and implement Standard Operating Procedures 
                for their farming operations. These SOPs provide clear, step-by-step guides for day-to-day farming activities.
              </p>
              <p className="text-gray-600 leading-relaxed">
                SOPs cover everything from planting and irrigation to fertilization and pest control, ensuring consistency 
                and efficiency across all operations.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Building className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">GroTowers and Vertical Farming</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                One of the cornerstones of GroSpace training is the use of GroTowers—an innovative vertical farming system 
                that maximizes space and reduces resource usage. GroTowers allow farmers to grow crops vertically, 
                especially beneficial for urban farms or those with limited land.
              </p>
              <p className="text-gray-600 leading-relaxed">
                GroTowers use up to 80x less water than traditional farming methods, thanks to their drip irrigation system.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Droplets className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Drip Irrigation & Water Management</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Water is one of the most important and often most limited resources on a farm. GroSpace trains farmers 
                on drip irrigation, an efficient watering method that reduces water usage while maintaining optimal soil moisture.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Drip irrigation delivers water directly to plant roots, ensuring no water is wasted and making a huge 
                difference in farm productivity and success.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Planning & Strategy</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                GroSpace provides farmers with tools and strategies to run their farms as successful businesses. 
                This includes training in business planning, financial management, and marketing.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Farmers learn cash flow management, investment strategies, and market dynamics to secure reliable 
                buyers for their produce at predetermined prices.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Consulting for Continuous Improvement</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                GroSpace provides ongoing consulting to ensure farmers continue improving their operations even after 
                initial training. Our consultants work closely with farmers to refine SOPs and adopt new technologies.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This continuous support helps farmers stay competitive and successful in the ever-changing agricultural landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Empowering Farmers Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Empowering Farmers for Long-Term Success</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Beyond technical knowledge, GroSpace is committed to empowering farmers for long-term success through 
              business planning, market development, and access to funding opportunities.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Business Planning and Strategy</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  In addition to farming techniques, GroSpace provides farmers with tools and strategies to run their 
                  farms as successful businesses. This includes training in business planning, financial management, 
                  and marketing to ensure long-term profitability.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Access to Funding and Investment</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  One of the most significant challenges for farmers is access to capital. GroSpace works closely with 
                  farmers to provide seed capital and investment opportunities, helping them access funding through 
                  grants, loans, or equity partnerships.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Empowerment Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/business-support.png"
                  alt="Business Support and Empowerment"
                  width={500}
                  height={320}
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Success Stories: Farmers Thriving the GroSpace Way</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Across the globe, farmers who have undergone GroSpace training are seeing tremendous results. 
              From small-scale farmers who have doubled their yields to commercial operations that have reduced water usage by 80%.
            </p>
          </div>

          {/* Success Stories Images */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/spinash4.png"
                alt="Fresh Produce Success Story"
                width={400}
                height={250}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-medium">Fresh Produce Excellence</p>
                <p className="text-sm opacity-90">Quality Farming Results</p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/franchise-locations.png"
                alt="Franchise Network Success"
                width={400}
                height={250}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-medium">Franchise Network Growth</p>
                <p className="text-sm opacity-90">Expanding Across Regions</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Building className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Urban Farmer in Johannesburg</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                After implementing GroTowers and drip irrigation, this urban farmer was able to grow 80 plants per 
                3-meter GroTower while reducing water usage by 80%. Their operation expanded quickly, and they now 
                supply fresh produce to local markets year-round.
              </p>
              <div className="flex items-center text-emerald-600 font-semibold">
                <TrendingUp className="w-5 h-5 mr-2" />
                80% water reduction, year-round supply
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Sprout className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rural Farmer in Kenya</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                After undergoing a GroSpace farm audit, this rural farmer optimized their water usage and introduced 
                GroTowers to their farm. Within the first season, they saw a 100% increase in yields and reduced 
                their labor requirements by half.
              </p>
              <div className="flex items-center text-green-600 font-semibold">
                <TrendingUp className="w-5 h-5 mr-2" />
                100% yield increase, 50% labor reduction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Farming the GroSpace Way</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              At GroSpace, we believe that with the right knowledge, resources, and support, every farmer can achieve success. 
              Farm Training – the GroSpace way is more than just teaching farmers how to plant crops—it's about empowering 
              them to build sustainable, profitable farming businesses.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">What You'll Learn:</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                  <span className="text-lg text-gray-700">Personalized farm audits and SOPs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                  <span className="text-lg text-gray-700">Innovative technologies like GroTowers</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                  <span className="text-lg text-gray-700">Efficient drip irrigation systems</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                  <span className="text-lg text-gray-700">Business planning and financial management</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                  <span className="text-lg text-gray-700">Sustainable farming practices</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                  <span className="text-lg text-gray-700">Access to funding and investment opportunities</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Training CTA Image Placeholder */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/vertical-farming-tech.png"
                  alt="Training Program Overview - Advanced Farming Techniques"
                  width={600}
                  height={320}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Training Program Overview</h3>
                  <p className="opacity-90">Comprehensive Learning Journey</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Whether you're a small-scale farmer or managing a large commercial operation, GroSpace's training programs 
              can equip you with the tools and strategies needed to thrive. Join us, and start farming the GroSpace way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Enroll in Training Program
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all duration-200">
                <Link href="/about">Learn More About GroSpace</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Booking Form Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Book Your Training Session</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Ready to transform your farming practices? Fill out the form below to book a training 
              session with our agricultural experts. We'll contact you to discuss your specific needs and schedule.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Training Booking Form</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-gray-700">First Name</Label>
                    <Input 
                      id="first-name" 
                      placeholder="Enter your first name" 
                      required 
                      className="rounded-xl border-gray-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-gray-700">Last Name</Label>
                    <Input 
                      id="last-name" 
                      placeholder="Enter your last name" 
                      required 
                      className="rounded-xl border-gray-200 focus:border-blue-400"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    required 
                    className="rounded-xl border-gray-200 focus:border-blue-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="Your phone number" 
                    className="rounded-xl border-gray-200 focus:border-blue-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="farm-type" className="text-gray-700">Farm Type</Label>
                  <Select>
                    <SelectTrigger id="farm-type" className="rounded-xl border-gray-200 focus:border-blue-400">
                      <SelectValue placeholder="Select your farm type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small-scale">Small-Scale Farm</SelectItem>
                      <SelectItem value="medium-scale">Medium-Scale Farm</SelectItem>
                      <SelectItem value="large-scale">Large-Scale Commercial Farm</SelectItem>
                      <SelectItem value="urban">Urban Farm</SelectItem>
                      <SelectItem value="indoor">Indoor/Vertical Farm</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="training-interest" className="text-gray-700">Training Interests</Label>
                  <Select>
                    <SelectTrigger id="training-interest" className="rounded-xl border-gray-200 focus:border-blue-400">
                      <SelectValue placeholder="Select your main interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farm-audit">Farm Audit</SelectItem>
                      <SelectItem value="sop-development">SOP Development</SelectItem>
                      <SelectItem value="grotowers">GroTowers & Vertical Farming</SelectItem>
                      <SelectItem value="irrigation">Irrigation Systems</SelectItem>
                      <SelectItem value="business-planning">Business Planning</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Training Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700">Additional Information</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your farming operation and specific training needs" 
                    className="rounded-xl border-gray-200 focus:border-blue-400 min-h-[120px]"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Book Your Training Session
                </Button>
              </form>
            </div>
            
            <div className="space-y-8">
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/farming image (1).png"
                  alt="Training Session in Action"
                  width={600}
                  height={400}
                  className="w-full h-[380px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Hands-on Training</h3>
                  <p className="opacity-90">Expert-Led Learning Experience</p>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-100 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-6 h-6 text-blue-600 mr-3" />
                  Why Book with Us?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                    <p className="text-gray-700">Personalized training tailored to your specific needs</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                    <p className="text-gray-700">Expert trainers with practical farming experience</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                    <p className="text-gray-700">Hands-on practical sessions, not just theory</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                    <p className="text-gray-700">Ongoing support after training completion</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                    <p className="text-gray-700">Access to our network of agricultural experts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
