"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Store, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Shield,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: LayoutDashboard,
    description: 'Overview & stats',
    gradient: 'from-blue-500 to-blue-600'
  },
  { 
    name: 'Vendors', 
    href: '/admin/vendors', 
    icon: Store,
    description: 'Manage vendors',
    gradient: 'from-purple-500 to-purple-600'
  },
  { 
    name: 'Orders', 
    href: '/admin/orders', 
    icon: ShoppingCart,
    description: 'Track orders',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  { 
    name: 'Users', 
    href: '/admin/users', 
    icon: Users,
    description: 'User management',
    gradient: 'from-amber-500 to-amber-600'
  },
  { 
    name: 'Analytics', 
    href: '/admin/analytics', 
    icon: BarChart3,
    description: 'Performance data',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  { 
    name: 'Articles', 
    href: '/admin/articles', 
    icon: FileText,
    description: 'Blog management',
    gradient: 'from-teal-500 to-teal-600'
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Settings,
    description: 'System config',
    gradient: 'from-slate-500 to-slate-600'
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex h-20 flex-shrink-0 items-center justify-center px-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <Link href="/admin" className="flex items-center gap-3 group">
          <Image
            src="/grospace-log.png"
            alt="GroSpace Logo"
            width={110}
            height={30}
            className="object-contain"
          />
          <div className="hidden lg:block">
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin Panel</p>
          </div>
        </Link>
        
        {/* Mobile menu close button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden ml-auto"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Admin Badge */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300 hidden lg:inline">Administrator</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-2 px-4 pb-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="block group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl transition-all duration-300",
                  isActive
                    ? 'bg-gradient-to-r shadow-lg shadow-blue-500/25 scale-[1.02]'
                    : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:scale-[1.01]',
                  isActive && `bg-gradient-to-r ${item.gradient}`
                )}
              >
                {/* Gradient overlay for active state */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                )}
                
                <div className="relative flex items-center p-4">
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isActive 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                  )}>
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors duration-300",
                        isActive
                          ? 'text-white'
                          : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                      )}
                    />
                  </div>
                  
                  <div className="ml-3 flex-1 hidden lg:block">
                    <p className={cn(
                      "text-sm font-semibold transition-colors duration-300",
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    )}>
                      {item.name}
                    </p>
                    <p className={cn(
                      "text-xs transition-colors duration-300",
                      isActive 
                        ? 'text-white/80' 
                        : 'text-slate-500 dark:text-slate-400'
                    )}>
                      {item.description}
                    </p>
                  </div>
                  
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-all duration-300 hidden lg:block",
                    isActive 
                      ? 'text-white/80 translate-x-1' 
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 group-hover:translate-x-1'
                  )} />
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
      
      {/* Back to main site */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <Link href="/dashboard">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Back to Dashboard</span>
          </Button>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 h-full overflow-hidden">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex flex-col w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 h-full shadow-2xl overflow-hidden">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
