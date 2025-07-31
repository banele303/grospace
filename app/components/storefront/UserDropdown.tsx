"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { 
  User, 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Shield, 
  LogOut,
  Crown,
  Sparkles,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAdminStatus } from "@/app/hooks/useAdminStatus";

interface iAppProps {
  email: string;
  name: string;
  userImage: string;
}

type UserRole = 'BUYER' | 'VENDOR' | 'ADMIN';

interface UserData {
  role: UserRole;
  isActive: boolean;
}

export function UserDropdown({ email, name, userImage }: iAppProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin: isAdminUser } = useAdminStatus();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user profile data...');
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          console.log('User profile data received:', data);
          setUserData(data);
          
          // Log the role specifically
          if (data) {
            console.log('User role from API:', data.role);
            console.log('Vendor data:', data.vendor);
          }
        } else {
          console.error('Failed to fetch user data. Status:', response.status);
          const errorData = await response.text();
          console.error('Error response:', errorData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Administrator',
          icon: Crown,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          dashboardLink: '/admin'
        };
      case 'VENDOR':
        return {
          label: 'Vendor',
          icon: Store,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          dashboardLink: '/vendor/dashboard'
        };
      default:
        return {
          label: 'Customer',
          icon: User,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          dashboardLink: '/dashboard'
        };
    }
  };

  // Determine the actual role - if isAdminUser is true, override the database role
  const actualRole = isAdminUser ? 'ADMIN' : (userData?.role || 'BUYER');
  const roleInfo = getRoleInfo(actualRole as UserRole);
  const RoleIcon = roleInfo?.icon || User;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-full ring-2 ring-transparent hover:ring-green-200 transition-all duration-300 group">
          <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300">
            <AvatarImage src={userImage} alt="User Image" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold text-lg">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Online Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-0 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                <AvatarImage src={userImage} alt="User Image" className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold text-xl">
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-lg truncate">{name}</h3>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 truncate mb-2">{email}</p>
              
              {/* Role Badge */}
              {roleInfo && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${roleInfo.bgColor} ${roleInfo.color} ${roleInfo.borderColor} border`}>
                  <RoleIcon className="w-3 h-3" />
                  <span>Logged in as {roleInfo.label}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-2">
          {/* Admin Dashboard Link - Show if user is admin */}
          {isAdminUser && (
            <DropdownMenuItem asChild className="p-0 mb-1">
              <Link 
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg bg-purple-50 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Admin Dashboard</p>
                  <p className="text-xs text-gray-500">Manage the platform</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </DropdownMenuItem>
          )}
          
          {/* Dashboard Link */}
          {roleInfo && (
            <DropdownMenuItem asChild className="p-0 mb-1">
              <Link 
                href={roleInfo.dashboardLink}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 group"
              >
                <div className={`p-2 rounded-lg ${roleInfo.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <LayoutDashboard className={`w-4 h-4 ${roleInfo.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Dashboard</p>
                  <p className="text-xs text-gray-500">Manage your account</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </DropdownMenuItem>
          )}

          {/* Orders/My Orders */}
          <DropdownMenuItem asChild className="p-0 mb-1">
            <Link 
              href="/dashboard/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
            >
              <div className="p-2 rounded-lg bg-blue-50 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">My Orders</p>
                <p className="text-xs text-gray-500">Track your purchases</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Logout */}
        <div className="p-2">
          <DropdownMenuItem asChild className="p-0">
            <LogoutLink className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group w-full">
              <div className="p-2 rounded-lg bg-red-50 group-hover:scale-110 transition-transform duration-300">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Sign Out</p>
                <p className="text-xs text-gray-500">Come back soon!</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" />
            </LogoutLink>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
