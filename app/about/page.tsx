"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Shield, CreditCard, Users, Smartphone, Camera } from "lucide-react";
import { Navbar } from "@/app/components/storefront/Navbar";
import { Footer } from "@/app/components/storefront/Footer";

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
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
                Cultivating Growth & Sustainability
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-6">
                About GroSpace
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                Your trusted partner in sustainable agriculture, gardening, and local farming. 
                We are more than just a supplier of agricultural products—we are a community-driven platform 
                dedicated to empowering small-scale farmers, gardeners, and entrepreneurs to thrive in an 
                increasingly competitive and environmentally conscious world.
              </p>
            </div>
            <div className="relative">
              {/* Hero Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/farmer-support.png"
                  alt="GroSpace Farmer Support and Agricultural Excellence"
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

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At GroSpace, our mission is to support the growth of small to medium-scale farmers and gardeners 
                by providing them with high-quality products, innovative solutions, and the tools they need to succeed. 
                We believe in fostering sustainable agricultural practices that not only benefit the environment but 
                also create strong, self-sufficient communities.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We aim to bridge the gap between traditional farming and modern business practices, ensuring that 
                our partners can grow both their crops and their enterprises. Through our comprehensive platform, 
                we connect farmers with the resources, knowledge, and market opportunities they need to thrive.
              </p>
            </div>
            <div className="space-y-6">
              {/* Mission Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/farmer-support.png"
                  alt="Supporting Farmers"
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="bg-gradient-to-br from-emerald-400 to-sky-500 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Key Values</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Sustainability & Environmental Responsibility
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Community Empowerment & Support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Quality & Excellence in Products
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Innovation & Modern Farming Practices
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              GroSpace operates through a decentralized network of small-scale franchises, strategically located to serve local communities across South Africa.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🥚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Products</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our product range includes chicken feed, table eggs, chickens that lay eggs, natural compost, and natural liquid fertilisers. 
                We ensure that all our products meet the highest standards of quality, sustainability, and effectiveness.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Weekly Egg and Feed Cycle</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We&apos;ve established a continuous cycle that supports local backyard chicken farmers. Each week, farmers purchase chickens and feed from their nearest GroSpace franchisee. 
                In return, they deliver the eggs produced by their hens and collect a new supply of feed.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainable Gardening Solutions</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We provide natural compost and liquid fertilisers that promote soil health, plant growth, and environmental sustainability. 
                Our products are ideal for traditional gardening, hydroponics, and lawn care.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Marketing and Sales Support</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                GroSpace partners with farmers who grow and produce grain, seeds, fruit, and vegetables. We take the responsibility of marketing and selling these products, 
                allowing our farmer partners to focus on what they do best—farming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              {/* Founder Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg mb-6">
                <Image
                  src="/owner.png"
                  alt="Roland Claven - Founder"
                  width={400}
                  height={320}
                  className="w-full h-80 object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Roland Claven</h3>
              <p className="text-center text-emerald-600 font-semibold mb-4">Founder, Managing Director, and Consultant</p>
              <p className="text-gray-600 text-center leading-relaxed">
                &quot;I believe in business for profit. Profit is both monetary and sustainable to the environment.&quot;
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Founder</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Roland has learned web development from scratch using the process of first principles to meticulously build this platform from the ground up. 
                He studied 2 years of Aeronautical Engineering at the University of Witwatersrand, during which he built Brainwave Tutoring.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                He completed an undergraduate Bachelors degree in Financial Sciences in record time and grew ThinkBrainwave into the leading tutoring company in South Africa. 
                The Department of Trade and Industry funded ThinkBrainwave to expose the business at the world&apos;s largest education expo in London, UK.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Roland spent 5 years developing sustainable farming techniques and developed the GroTower - an incredibly valuable farming tool that is affordable, efficient, and has longevity.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Roland is an avid naturalist who enjoys calculating breakeven calculations for small scale to large scale businesses. He believes challenges make life interesting and that farmers are like engineers who solve problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wildlife Management Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Should Farmers Do with Local Wildlife?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Farmers should help maintain local wildlife populations by creating food forests and supporting their nourishment. 
              This balanced approach reduces conflicts between wildlife and farming, promoting a sustainable ecosystem.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Maintain Balance</h4>
              <p className="text-gray-600">Farmers should work with nature to create a balanced ecosystem. This means integrating practices that help local wildlife thrive alongside their farming activities.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Support Local Wildlife</h4>
              <p className="text-gray-600">GroSpace encourages farmers to help maintain local wildlife populations. This can be achieved by creating food forests or other natural habitats that provide nourishment for local fauna.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Reduce Conflict</h4>
              <p className="text-gray-600">By supporting and nourishing local wildlife, farmers can reduce the likelihood of wildlife attacking their livestock and crops. A well-fed and supported wildlife population is less likely to interfere with farming operations.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">4</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Promote Sustainability</h4>
              <p className="text-gray-600">Ensuring that the ecosystem is balanced and that wildlife needs are met helps to create a sustainable farming environment. This approach aligns with GroSpace&apos;s belief in the importance of harmony between farming and nature.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainable Harmony</h3>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              Through our wildlife management initiatives, we&apos;ve created a model that proves farming and conservation 
              can work together, benefiting both agricultural productivity and biodiversity preservation.
            </p>
            {/* Wildlife Management Image Placeholder */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl h-48 flex items-center justify-center border-2 border-dashed border-green-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🦌</span>
                </div>
                <p className="text-gray-600 font-medium">Wildlife & Farming Image</p>
                <p className="text-sm text-gray-500">Harmony in Nature</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "What is GroSpace?",
                answer: "GroSpace is an online farmers market that connects small to medium-scale farmers with consumers. We provide a platform where farmers can sell their products while GroSpace handles marketing and sales."
              },
              {
                question: "How does GroSpace support farmers?",
                answer: "We offer investment opportunities, funding, incubation, and marketing support to farmers who follow our controlled and audited procedures. We may take around 20% equity in supported businesses."
              },
              {
                question: "What products can I buy from GroSpace?",
                answer: "We offer table eggs, chicken feed, point-of-lay chickens, natural compost fertilizer, grain, seeds, fruit, and vegetables. All products meet our high quality standards."
              },
              {
                question: "Do you sell chickens?",
                answer: "Yes! We sell Point-of-Lay Hens (ready to start laying eggs), Hardbody Chickens (older hens for stewing), and Broiler Chickens (raised for meat production) through our franchise network."
              },
              {
                question: "What's the difference between fertile and table eggs?",
                answer: "Fertile eggs are intended for hatching and contain embryos that can develop into chicks. Table eggs are for eating and are not fertilized. Fertile eggs are used by breeders, while table eggs are sold to consumers for cooking and consumption."
              },
              {
                question: "How much is a tray of large eggs?",
                answer: "Prices are dynamically changing based on supply and demand. Please visit our products page for current pricing that fluctuates with market conditions to give you the best value."
              },
              {
                question: "Where is GroSpace based?",
                answer: "Our headquarters is at Number 3, 4th Avenue Edendale, Edenvale, Johannesburg, South Africa. We have physical franchises in Edenvale and Beaulieu, Midrand, with a strong online presence."
              },
              {
                question: "How do I become a farmer partner?",
                answer: "You need to be in business for at least 12 months with trading registered through GroSpace. All farmers undergo audits to ensure quality control before joining our platform."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset"
                  onClick={() => toggleFaq(index)}
                >
                  <h4 className="text-lg font-semibold text-gray-900">{faq.question}</h4>
                  <div className="flex-shrink-0 ml-4">
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-emerald-600 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                    )}
                  </div>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment and Safety Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">How Do I Make Payment on GroSpace?</h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-400 pl-6">
                  <h4 className="text-xl font-semibold text-emerald-600 mb-2">1. Online Payment</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Make payments directly through our website using credit/debit cards, EFT, or mobile payment options. 
                    You&apos;ll be directed to a secure payment gateway to complete transactions.
                  </p>
                </div>
                <div className="border-l-4 border-emerald-400 pl-6">
                  <h4 className="text-xl font-semibold text-emerald-600 mb-2">2. Payment Upon Delivery</h4>
                  <p className="text-gray-600 leading-relaxed">
                    We offer payment on delivery with cash or card payment methods for your convenience.
                  </p>
                </div>
                <div className="border-l-4 border-emerald-400 pl-6">
                  <h4 className="text-xl font-semibold text-emerald-600 mb-2">3. Bank Transfer</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Make payments via bank transfer. After placing your order, you&apos;ll receive bank details. 
                    Send proof of payment to <strong className="text-emerald-600">payments@grospace.co.za</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Are My Funds Safe on GroSpace?</h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-sky-400 pl-6">
                  <h4 className="text-xl font-semibold text-sky-600 mb-2">✓ Escrow Service</h4>
                  <p className="text-gray-600 leading-relaxed">
                    GroSpace runs an escrow service that protects both buyer and seller funds. Payments are securely 
                    held until transactions are completed to everyone&apos;s satisfaction.
                  </p>
                </div>
                <div className="border-l-4 border-sky-400 pl-6">
                  <h4 className="text-xl font-semibold text-sky-600 mb-2">✓ Secure Payment Gateway</h4>
                  <p className="text-gray-600 leading-relaxed">
                    All online transactions are processed through secure payment gateways with encrypted payment details, 
                    safeguarding them from unauthorized access.
                  </p>
                </div>
                <div className="border-l-4 border-sky-400 pl-6">
                  <h4 className="text-xl font-semibold text-sky-600 mb-2">✓ Data Privacy</h4>
                  <p className="text-gray-600 leading-relaxed">
                    We are committed to maintaining the privacy and security of your personal and financial information, 
                    following strict data privacy regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App and Collaboration Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Experience the World of Farming</h2>
          
          {/* App Screenshot Placeholder */}
          <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-emerald-200 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-gray-600 font-medium">Mobile App Screenshots</p>
              <p className="text-sm text-gray-500">App Interface & Features</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Collaborate with Fellow Farmers</h3>
              <p className="text-gray-600 leading-relaxed">Connect with other farmers, share experiences, and learn from each other in our supportive community.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Showcase Your Farm</h3>
              <p className="text-gray-600 leading-relaxed">Display your products and farming methods to potential customers and partners through our platform.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile App Coming Soon</h3>
              <p className="text-gray-600 leading-relaxed">Let us know if you would like an app to be built for easier access to our platform and services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 px-4 bg-gray-50/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Our Locations</h3>
              </div>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-gray-700 mb-4">
                  <strong className="text-emerald-600">Headquarters:</strong> Number 3, 4th Avenue Edendale, Edenvale, Johannesburg, South Africa
                </p>
                <p className="text-gray-600 mb-6">
                  <strong className="text-sky-600">Franchises:</strong> Edenvale, Johannesburg | Beaulieu, Midrand
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  GroSpace currently has franchises strategically located to serve local communities across South Africa, 
                  with plans for expansion to reach more farmers and gardeners.
                </p>
                
                {/* Location/Map Image Placeholder */}
                <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl h-48 flex items-center justify-center border-2 border-dashed border-emerald-200 mb-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="text-gray-600 font-medium">Location Map Image</p>
                    <p className="text-sm text-gray-500">Franchise Locations</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    Book a Consultation
                  </Button>
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
            Join Us on the Journey to Growth
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            GroSpace is more than just a platform—it&apos;s a movement towards a more sustainable, prosperous future 
            for farmers, gardeners, and communities. Whether you&apos;re a seasoned farmer, an aspiring gardener, 
            or someone looking to make a positive impact on the environment, GroSpace is here to support you 
            every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="/vendors/register">Become a Partner</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all duration-200">
              <Link href="/products">Explore Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
