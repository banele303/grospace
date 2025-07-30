"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingBasket,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Pause,
  Play
} from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Custom CSS class for hiding scrollbar across browsers
const scrollbarHideClass = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const categories = [
  {
    id: "seeds",
    name: "Seeds & Seedlings",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&crop=center",
    icon: "🌱"
  },
  {
    id: "produce",
    name: "Fresh Produce",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center",
    icon: "🥦"
  },
  {
    id: "equipment",
    name: "Farm Equipment",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center",
    icon: "🚜"
  },
  {
    id: "livestock",
    name: "Livestock & Feed",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=400&fit=crop&crop=center",
    icon: "🐄"
  },
  {
    id: "organic",
    name: "Organic Products",
    image: "https://images.unsplash.com/photo-1498579485796-98be3abc076e?w=400&h=400&fit=crop&crop=center",
    icon: "🌿"
  },
  {
    id: "services",
    name: "Farm Services",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=400&fit=crop&crop=center",
    icon: "🔧"
  },
  {
    id: "fertilizers",
    name: "Fertilizers",
    image: "https://images.unsplash.com/photo-1603059905664-b96e62263c4e?w=400&h=400&fit=crop&crop=center",
    icon: "💧"
  },
  {
    id: "gardening",
    name: "Gardening",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop&crop=center",
    icon: "🌺"
  }
];

export function HomeCategories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Add the CSS for scrollbar hiding
  useEffect(() => {
    // Add style once when component mounts
    const styleElement = document.createElement('style');
    styleElement.innerHTML = scrollbarHideClass;
    document.head.appendChild(styleElement);
    
    // Cleanup when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Function to scroll the container horizontally
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Pause auto-scrolling temporarily when manually navigating
      setIsAutoScrollPaused(true);
      
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      // Resume auto-scrolling after a short delay
      setTimeout(() => setIsAutoScrollPaused(false), 5000);
    }
  };
  
  // Check scroll position to show/hide arrows
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // Small buffer
    }
  };
  
  // Auto-scroll functionality
  const startAutoScroll = () => {
    if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    
    autoScrollIntervalRef.current = setInterval(() => {
      if (isAutoScrollPaused) return;
      
      const container = scrollContainerRef.current;
      if (container) {
        // If we've reached the end, go back to the start
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Otherwise, keep scrolling right
          container.scrollBy({
            left: 80,
            behavior: 'smooth'
          });
        }
        
        // Update the arrow visibility after scrolling
        handleScroll();
      }
    }, 3000); // Auto-scroll every 3 seconds
  };
  
  // Pause auto-scrolling when hovering over container
  const pauseAutoScroll = () => setIsAutoScrollPaused(true);
  const resumeAutoScroll = () => setIsAutoScrollPaused(false);

  // Set up auto-scroll and scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      scrollContainer.addEventListener('mouseenter', pauseAutoScroll);
      scrollContainer.addEventListener('mouseleave', resumeAutoScroll);
      scrollContainer.addEventListener('touchstart', pauseAutoScroll);
      scrollContainer.addEventListener('touchend', resumeAutoScroll);
      
      // Initial check and start auto-scrolling
      handleScroll();
      startAutoScroll();
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.removeEventListener('mouseenter', pauseAutoScroll);
        scrollContainer.removeEventListener('mouseleave', resumeAutoScroll);
        scrollContainer.removeEventListener('touchstart', pauseAutoScroll);
        scrollContainer.removeEventListener('touchend', resumeAutoScroll);
        
        if (autoScrollIntervalRef.current) {
          clearInterval(autoScrollIntervalRef.current);
        }
      };
    }
  }, [isAutoScrollPaused, startAutoScroll, handleScroll, pauseAutoScroll, resumeAutoScroll]);

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Modern Header */}
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              Categories
            </div>
            <h2 className="text-xl font-bold text-gray-900 ml-2">
              Explore by <span className="text-green-600">Category</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center space-x-2"
          >
            <button 
              onClick={() => setIsAutoScrollPaused(prev => !prev)}
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-200 hover:bg-gray-50"
              aria-label={isAutoScrollPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            >
              {isAutoScrollPaused ? 
                <Play className="w-4 h-4 text-green-600" /> : 
                <Pause className="w-4 h-4 text-gray-700" />
              }
            </button>
            <button 
              onClick={() => scroll('left')} 
              className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-opacity duration-200 ${showLeftArrow ? 'opacity-100' : 'opacity-30 cursor-not-allowed'}`}
              disabled={!showLeftArrow}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-opacity duration-200 ${showRightArrow ? 'opacity-100' : 'opacity-30 cursor-not-allowed'}`}
              disabled={!showRightArrow}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </motion.div>
        </div>

        {/* Horizontal Scrolling Categories */}
        <div 
          className="relative"
        >
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 pt-1 snap-x scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="snap-start flex-shrink-0 w-[180px]"
              >
                <Link href={`/products?category=${category.id}`} className="block">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
                    <div className="relative w-full h-[140px] overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center text-lg shadow-sm">
                        <span role="img" aria-label={category.name}>{category.icon}</span>
                      </div>
                    </div>
                    
                    <div className="py-3 px-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors duration-200">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Left fade effect */}
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          )}
          
          {/* Right fade effect */}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-4"
        >
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-200"
          >
            <span>View all categories</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}