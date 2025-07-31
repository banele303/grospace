"use client";

import { User, LogOut, Settings, Mail, Crown, Shield } from "lucide-react";
import { AdminThemeToggle } from "./AdminThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ADMIN_EMAIL } from "@/app/lib/admin-config";
import Image from "next/image";
import Link from "next/link";

export function AdminHeader() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { user, isLoading } = useKindeBrowserClient();

  useEffect(() => {
    setMounted(true);
    
    // Fetch additional user profile data
    const fetchUserProfile = async () => {
      if (user?.email) {
        try {
          console.log('Fetching admin profile data for:', user.email);
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            console.log('Admin profile data fetched successfully:', data);
          } else {
            console.error('Failed to fetch profile. Status:', response.status);
            const errorText = await response.text();
            console.error('Error response:', errorText);
          }
        } catch (error) {
          console.error('Error fetching admin profile:', error);
        }
      }
    };
    
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  if (!mounted || isLoading) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 h-16 flex items-center justify-end px-6 gap-4">
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name || name.trim() === '') return 'AD';
    
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get actual user info and use meaningful fallbacks only if needed
  const firstName = user?.given_name || userData?.firstName || '';
  const lastName = user?.family_name || userData?.lastName || '';
  const userName = `${firstName} ${lastName}`.trim() || 'Administrator';
  const userEmail = user?.email || '';
  const userAvatar = user?.picture || '';
  const isAdmin = userEmail === ADMIN_EMAIL;
  
  // Log for debugging
  console.log("AdminHeader: User info", { 
    userName, 
    userEmail, 
    adminEmail: ADMIN_EMAIL,
    isAdmin,
    user,
    userData 
  });

  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 h-16 flex items-center justify-between px-6 gap-4 sticky top-0 z-40">
      {/* Logo */}
      <Link href="/admin" className="flex items-center">
        <div className="relative w-[120px] h-[40px]">
          <Image
            src="/gigalogo.jpeg"
            alt="Giga Logo"
            fill
            className="object-contain block dark:hidden"
            priority
            quality={90}
            sizes="120px"
          />
          <Image
            src="/gigadarklogo.jpeg"
            alt="Giga Logo"
            fill
            className="object-contain hidden dark:block"
            priority
            quality={90}
            sizes="120px"
          />
        </div>
        <span className="ml-2 font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 text-transparent bg-clip-text hidden md:inline">
          Admin Portal
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <AdminThemeToggle />
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-10 gap-3 px-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105"
            >
              <Avatar className="h-8 w-8 ring-2 ring-white/20 shadow-lg">
                <AvatarImage 
                  src={userAvatar} 
                  alt={userName || 'Admin'} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-sm font-semibold">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {userName}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {userEmail}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl"
        >
          <DropdownMenuLabel className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-purple-200 dark:ring-purple-900">
                  <AvatarImage 
                    src={userAvatar} 
                    alt={userName} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1 shadow-lg">
                  <Crown className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {userName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[160px]">
                    {userEmail}
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  className="mt-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none text-xs flex items-center gap-1"
                >
                  <Crown className="h-3 w-3" />
                  System Administrator
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
          
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 m-1 rounded-lg">
            <User className="h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 m-1 rounded-lg">
            <Settings className="h-4 w-4" />
            <span>Admin Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
          
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 m-1 rounded-lg"
            asChild
          >
            <LogoutLink>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </LogoutLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </header>
  );
}
