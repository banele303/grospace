'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ShoppingBag, Heart, MapPin } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

type UserMenuProps = {
  user: {
    given_name?: string | null;
    family_name?: string | null;
    email?: string | null;
    picture?: string | null;
  };
};

export function UserMenu({ user }: UserMenuProps) {
  const initials = `${user?.given_name?.[0] || ''}${user?.family_name?.[0] || ''}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {user?.picture ? (
              <AvatarImage src={user.picture} alt={user?.given_name || 'User'} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials || <User className="h-4 w-4" />}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.given_name} {user?.family_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <a href="/dashboard/profile" className="w-full cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/dashboard/orders" className="w-full cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/dashboard/wishlist" className="w-full cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              <span>Wishlist</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/dashboard/addresses" className="w-full cursor-pointer">
              <MapPin className="mr-2 h-4 w-4" />
              <span>Addresses</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink className="w-full cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
