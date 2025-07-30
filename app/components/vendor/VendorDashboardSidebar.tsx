"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  DollarSign,
  Settings,
  Bell,
  Users,
  Star,
  TrendingUp,
  Calendar,
  MessageSquare,
  Truck,
  Leaf,
  Plus,
  Eye,
  Edit,
  Archive,
  AlertCircle,
  CreditCard,
  FileText,
  Target,
  Award,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/vendor/dashboard/products",
    icon: Package,
    subItems: [
      {
        name: "All Products",
        href: "/vendor/dashboard/products",
        icon: Eye,
      },
      {
        name: "Add Product",
        href: "/vendor/dashboard/products/create",
        icon: Plus,
      },
      {
        name: "Categories",
        href: "/vendor/dashboard/products/categories",
        icon: Archive,
      },
      {
        name: "Inventory",
        href: "/vendor/dashboard/products/inventory",
        icon: Package,
      },
    ],
  },
  {
    name: "Orders",
    href: "/vendor/dashboard/orders",
    icon: ShoppingCart,
    subItems: [
      {
        name: "All Orders",
        href: "/vendor/dashboard/orders",
        icon: ShoppingCart,
      },
      {
        name: "Pending",
        href: "/vendor/dashboard/orders/pending",
        icon: AlertCircle,
      },
      {
        name: "Shipped",
        href: "/vendor/dashboard/orders/shipped",
        icon: Truck,
      },
      {
        name: "Delivered",
        href: "/vendor/dashboard/orders/delivered",
        icon: Award,
      },
    ],
  },
  {
    name: "Analytics",
    href: "/vendor/dashboard/analytics",
    icon: BarChart3,
    subItems: [
      {
        name: "Sales Report",
        href: "/vendor/dashboard/analytics/sales",
        icon: TrendingUp,
      },
      {
        name: "Product Performance",
        href: "/vendor/dashboard/analytics/products",
        icon: Target,
      },
      {
        name: "Customer Insights",
        href: "/vendor/dashboard/analytics/customers",
        icon: Users,
      },
    ],
  },
  {
    name: "Earnings",
    href: "/vendor/dashboard/earnings",
    icon: DollarSign,
    subItems: [
      {
        name: "Overview",
        href: "/vendor/dashboard/earnings",
        icon: DollarSign,
      },
      {
        name: "Payouts",
        href: "/vendor/dashboard/earnings/payouts",
        icon: CreditCard,
      },
      {
        name: "Statements",
        href: "/vendor/dashboard/earnings/statements",
        icon: FileText,
      },
    ],
  },
  {
    name: "Reviews",
    href: "/vendor/dashboard/reviews",
    icon: Star,
  },
  {
    name: "Customers",
    href: "/vendor/dashboard/customers",
    icon: Users,
  },
  {
    name: "Messages",
    href: "/vendor/dashboard/messages",
    icon: MessageSquare,
  },
  {
    name: "Promotions",
    href: "/vendor/dashboard/promotions",
    icon: Target,
    subItems: [
      {
        name: "Active Promotions",
        href: "/vendor/dashboard/promotions",
        icon: Target,
      },
      {
        name: "Create Promotion",
        href: "/vendor/dashboard/promotions/create",
        icon: Plus,
      },
    ],
  },
  {
    name: "Profile",
    href: "/vendor/dashboard/profile",
    icon: Settings,
  },
  {
    name: "Notifications",
    href: "/vendor/dashboard/notifications",
    icon: Bell,
  },
];

export function VendorDashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background overflow-y-auto">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/vendor/dashboard" className="flex items-center">
          <Image
            src="/grospace-log.png"
            alt="GroSpace Logo"
            width={150}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const hasSubItems = link.subItems && link.subItems.length > 0;
          const isParentActive = hasSubItems && link.subItems.some(sub => pathname === sub.href);

          return (
            <div key={link.name} className="space-y-1">
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  (isActive || isParentActive)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <link.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{link.name}</span>
              </Link>

              {/* Sub-items */}
              {hasSubItems && (isActive || isParentActive) && (
                <div className="ml-6 space-y-1">
                  {link.subItems.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                          isSubActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <subItem.icon className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{subItem.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">
              Agricultural Marketplace
            </p>
            <p className="text-xs text-muted-foreground">
              Vendor Dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
