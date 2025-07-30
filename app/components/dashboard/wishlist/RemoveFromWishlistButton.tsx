"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { removeFromWishlist } from "@/app/lib/actions";

interface RemoveFromWishlistButtonProps {
  productId: string;
  userId: string;
}

export function RemoveFromWishlistButton({ productId, userId }: RemoveFromWishlistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (isRemoving || isPending) return;

    setIsRemoving(true);
    
    startTransition(async () => {
      try {
        const result = await removeFromWishlist(productId);
        
        if (result.success) {
          toast.success(result.message || "Removed from wishlist");
        } else {
          toast.error(result.error || "Failed to remove from wishlist");
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove from wishlist");
      } finally {
        setIsRemoving(false);
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRemove}
      disabled={isRemoving || isPending}
      className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
    >
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  );
}
