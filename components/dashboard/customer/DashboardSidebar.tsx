"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ShoppingBag, Heart, MapPin, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: Home },
	{ name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
	{ name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
	{ name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
	{ name: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardSidebar() {
	const pathname = usePathname();

	return (
		<div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
			<div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-gray-200 dark:border-gray-700">
				<Link href="/" className="flex items-center">
					<Image
						src="/grospace-log.png"
						alt="GroSpace Logo"
						width={100}
						height={32}
						className="h-8 w-auto object-contain"
					/>
				</Link>
			</div>

			<nav className="flex-1 space-y-1 px-2 py-4">
				{navigation.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								isActive
									? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-white"
									: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50",
								"group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200"
							)}
						>
							<item.icon
								className={cn(
									isActive
										? "text-primary dark:text-white"
										: "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300",
									"mr-3 flex-shrink-0 h-5 w-5"
								)}
								aria-hidden="true"
							/>
							{item.name}
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-gray-200 dark:border-gray-700">
				<LogoutLink className="w-full">
					<Button className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
						<LogOut className="mr-3 h-5 w-5" />
						Sign out
					</Button>
				</LogoutLink>
			</div>
		</div>
	);
}
