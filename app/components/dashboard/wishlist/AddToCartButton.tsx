"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addItem } from "@/app/actions";
import { useCart } from "@/app/context/CartContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    quantity: number;
  };
  userId: string;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({ product, userId, disabled, className }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { refreshCart } = useCart();

  const handleAddToCart = async () => {
    if (isAdding || disabled) return;

    setIsAdding(true);
    
    try {
      const result = await addItem(product.id);
      if (result?.success) {
        toast.success("Added to cart");
        await refreshCart();
      } else {
        toast.error(result?.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding || disabled}
      className={className}
      size="sm"
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {disabled ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
}
