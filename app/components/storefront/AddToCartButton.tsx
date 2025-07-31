"use client";

import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { useSafeAuth } from "@/app/hooks/useSafeAuth";
import { addItem } from "@/app/actions";
import { useCart } from "@/app/context/CartContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { user, isMounted } = useSafeAuth();
  const { refreshCart } = useCart();

  const handleAddToCart = async () => {
    if (!isMounted) return;
    
    try {
      const result = await addItem(product.id);
      if (result?.success) {
        toast.success("Added to order");
        await refreshCart();
      } else {
        toast.error(result?.error || "Failed to add to order");
      }
    } catch (error) {
      console.error("Error adding to order:", error);
      toast.error("Failed to add to order");
    }
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className="hover:bg-primary hover:text-white group relative"
      onClick={handleAddToCart}
    >
      <Package className="h-5 w-5" />
      {!user && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Sign in to place order
        </span>
      )}
    </Button>
  );
}