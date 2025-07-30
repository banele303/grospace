import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/grospace-log.png"
                alt="GroSpace Logo"
                width={80}
                height={80}
                className="object-contain mr-3"
                priority
                quality={85}
                sizes="(max-width: 768px) 60px, 80px"
              />
              <span className="text-2xl font-bold text-white">GroSpace</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner in sustainable agriculture, empowering farmers and gardeners 
              to thrive through innovative solutions and community-driven support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Training
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Products
                </Link>
              </li>
              <li>
                <Link href="/vendors/register" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Verticals */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Verticals</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/verticals/grofresh" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  GroFresh
                </Link>
              </li>
              <li>
                <Link href="/verticals/grofeeds" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  GroFeeds
                </Link>
              </li>
              <li>
                <Link href="/verticals/grocommodities" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  GroCommodities
                </Link>
              </li>
              <li>
                <Link href="/verticals/groconsulting" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  GroConsulting
                </Link>
              </li>
              <li>
                <Link href="/verticals/grodriver" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  GroDriver
                </Link>
              </li>
              <li>
                <Link href="/verticals/grochick" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  GroChick
                </Link>
              </li>
              <li>
                <Link href="/verticals/grobiogas" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                  GroBiogas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p className="font-medium">Headquarters:</p>
                  <p className="text-sm">Number 3, 4th Avenue Edendale</p>
                  <p className="text-sm">Edenvale, Johannesburg, South Africa</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-emerald-400 mr-3" />
                <span className="text-gray-300">+27 (0) 11 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-emerald-400 mr-3" />
                <span className="text-gray-300">info@grospace.co.za</span>
              </div>
            </div>
          </div>
        </div>

        {/* Franchise Locations */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center">Franchise Locations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-emerald-400 mb-2">Edenvale Franchise</h4>
              <p className="text-gray-300 text-sm">Johannesburg, Gauteng</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-emerald-400 mb-2">Beaulieu Franchise</h4>
              <p className="text-gray-300 text-sm">Midrand, Gauteng</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 GroSpace. All rights reserved. | Cultivating Growth & Sustainability
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/support" className="hover:text-emerald-400 transition-colors duration-200">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
