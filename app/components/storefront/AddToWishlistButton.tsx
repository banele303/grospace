"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { addToWishlist } from "@/app/lib/actions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface AddToWishlistButtonProps {
  productId: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function AddToWishlistButton({ 
  productId, 
  className, 
  variant = "outline", 
  size = "icon" 
}: AddToWishlistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useKindeBrowserClient();

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to add items to wishlist");
      return;
    }

    if (isAdding || isPending) return;

    setIsAdding(true);
    
    startTransition(async () => {
      try {
        const result = await addToWishlist(productId);
        
        if (result.success) {
          toast.success(result.message || "Added to wishlist");
        } else {
          toast.error(result.error || "Failed to add to wishlist");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add to wishlist");
      } finally {
        setIsAdding(false);
      }
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToWishlist}
      disabled={isAdding || isPending}
      className={className}
    >
      <Heart className={`${size === "icon" ? "h-4 w-4" : "h-4 w-4 mr-2"}`} />
      {size !== "icon" && "Add to Wishlist"}
    </Button>
  );
}
