"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronDown, User } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { SearchBar } from "./SearchBar";
import { CartIcon } from "./CartIcon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/app/context/CartContext";
import { useAuthState } from "@/app/hooks/useAuthState";
import { useVendorStatus } from "@/app/hooks/useVendorStatus";
import { useAdminStatus } from "@/app/hooks/useAdminStatus";

// User interface for type safety
interface AuthUser {
  email: string | null;
  given_name: string | null;
  picture: string | null;
}

function AuthButtons() {
  return (
    <div className="flex items-center gap-4">
      <Button
        asChild
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <LoginLink>Sign in</LoginLink>
      </Button>
      <Button variant="outline" asChild>
        <RegisterLink>Sign up</RegisterLink>
      </Button>
    </div>
  );
}

function AuthDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full bg-green-500 border-green-600 hover:bg-green-600">
          <User className="h-4 w-4 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-green-50 border-green-200 p-2">
        <div className="flex flex-col gap-2">
          <Button
            asChild
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <LoginLink>Sign in</LoginLink>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <RegisterLink>Sign up</RegisterLink>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const authState = useAuthState();
  const { user: rawUser, isLoading } = authState;
  const user = rawUser as AuthUser | null;
  const { itemCount } = useCart();
  const { isVendor, loading: vendorLoading } = useVendorStatus();
  const { isAdmin, isLoading: adminLoading } = useAdminStatus();

  // Debug logging
  console.log('Navbar - User state:', { user, isLoading, isAuthenticated: !!user });
  console.log('Navbar - Admin/Vendor status:', { isAdmin, adminLoading, isVendor, vendorLoading });

  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      <nav className="container mx-auto flex items-center justify-between p-2">
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center mr-8">
            <Image
              src="/grospace-log.png"
              alt="GroSpace Logo"
              width={150}
              height={150}
              className="object-contain"
              priority
              quality={90}
              sizes="(max-width: 768px) 120px, 150px"
            />
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            <Link 
              href="/about" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
            >
              About Us
            </Link>
            <Link 
              href="/training" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
            >
              Training
            </Link>
            <Link 
              href="/articles" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
            >
              Articles
            </Link>
            <Link 
              href="/vendors" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
            >
              Vendors
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200">
                Verticals
                <ChevronDown className="w-4 h-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-xl p-2 min-w-[200px]">
                <DropdownMenuItem asChild>
                  <Link 
                    href="/verticals/grobiogas" 
                    className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                  >
                    <span className="text-emerald-500 mr-2">🌿</span>
                    GroBiogas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/verticals/grochick" 
                    className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                  >
                    <span className="text-emerald-500 mr-2">🐣</span>
                    GroChick
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/verticals/grocommodities" 
                    className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                  >
                    <span className="text-emerald-500 mr-2">📦</span>
                    GroCommodities
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/verticals/groconsulting" 
                    className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                  >
                    <span className="text-emerald-500 mr-2">💡</span>
                    GroConsulting
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/verticals/grodriver" 
                    className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                  >
                    <span className="text-emerald-500 mr-2">🚚</span>
                    GroDriver
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/verticals/grofeeds" 
                    className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                  >
                    <span className="text-emerald-500 mr-2">🌾</span>
                    GroFeeds
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/verticals/grofresh" 
                    className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                  >
                    <span className="text-emerald-500 mr-2">🥬</span>
                    GroFresh
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link 
              href="/products" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
            >
              Marketplace
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <div className="w-64">
            <SearchBar />
          </div>
          {!isVendor && !vendorLoading && !isAdmin && !adminLoading && (
            <Link 
              href="/vendors/register" 
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-xl group overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-200"></span>
              <span className="relative flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Become a Vendor
              </span>
            </Link>
          )}
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <UserDropdown
              email={user?.email ?? ""}
              name={user?.given_name ?? ""}
              userImage={
                user?.picture ?? `https://avatar.vercel.sh/${user?.given_name ?? "user"}`
              }
            />
          ) : (
            <AuthDropdown />
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="mx-2">
            <CartIcon />
          </div>

          {/* User dropdown for mobile - show next to hamburger menu */}
          <div className="lg:hidden">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="scale-90">
                <UserDropdown
                  email={user?.email ?? ""}
                  name={user?.given_name ?? ""}
                  userImage={
                    user?.picture ?? `https://avatar.vercel.sh/${user?.given_name ?? "user"}`
                  }
                />
              </div>
            ) : (
              <div className="scale-90">
                <AuthDropdown />
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <div className="space-y-4 mb-6">
                    <Link 
                      href="/about" 
                      className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                    >
                      About Us
                    </Link>
                    <Link 
                      href="/training" 
                      className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                    >
                      Training
                    </Link>
                    <Link 
                      href="/articles" 
                      className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                    >
                      Articles
                    </Link>
                    <Link 
                      href="/vendors" 
                      className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                    >
                      Vendors
                    </Link>
                    
                    {/* Verticals as dropdown in mobile */}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center justify-between w-full text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-2 border-none bg-transparent">
                        Verticals
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="bg-white border border-gray-200 shadow-lg rounded-xl p-2 min-w-[280px] max-h-[400px] overflow-y-auto mx-4" 
                        align="center"
                        side="bottom"
                        sideOffset={8}
                        alignOffset={0}
                      >
                        <DropdownMenuItem asChild>
                          <Link 
                            href="/verticals/grobiogas" 
                            className="w-full px-4 py-3 text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                          >
                            <span className="text-emerald-500 mr-3 text-lg">🌿</span>
                            GroBiogas
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link 
                            href="/verticals/grochick" 
                            className="w-full px-4 py-3 text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                          >
                            <span className="text-emerald-500 mr-3 text-lg">🐣</span>
                            GroChick
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link 
                            href="/verticals/grocommodities" 
                            className="w-full px-4 py-3 text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                          >
                            <span className="text-emerald-500 mr-3 text-lg">📦</span>
                            GroCommodities
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link 
                            href="/verticals/groconsulting" 
                            className="w-full px-4 py-3 text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                          >
                            <span className="text-emerald-500 mr-3 text-lg">💡</span>
                            GroConsulting
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link 
                            href="/verticals/grodriver" 
                            className="w-full px-4 py-3 text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                          >
                            <span className="text-emerald-500 mr-3 text-lg">🚚</span>
                            GroDriver
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link 
                            href="/verticals/grofeeds" 
                            className="w-full px-4 py-3 text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                          >
                            <span className="text-emerald-500 mr-3 text-lg">🌾</span>
                            GroFeeds
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link 
                            href="/verticals/grofresh" 
                            className="w-full px-4 py-3 text-base text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
                          >
                            <span className="text-emerald-500 mr-3 text-lg">🥬</span>
                            GroFresh
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Link 
                      href="/products" 
                      className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                    >
                      Marketplace
                    </Link>
                  </div>
                  {!isVendor && !vendorLoading && !isAdmin && !adminLoading && (
                    <Link 
                      href="/vendors/register" 
                      className="relative inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-xl group overflow-hidden mb-6"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-200"></span>
                      <span className="relative flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Become a Vendor
                      </span>
                    </Link>
                  )}
                </div>
                <div className="mt-4 lg:hidden">
                  <SearchBar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
