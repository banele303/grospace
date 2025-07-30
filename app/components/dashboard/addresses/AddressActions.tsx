"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteAddress, setDefaultAddress } from "@/app/lib/address-actions";
import { toast } from "sonner";
import { EditAddressForm } from "./EditAddressForm";

interface AddressActionsProps {
  addressId: string;
  isDefault: boolean;
  address: {
    id: string;
    type: string;
    label: string;
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
  };
}

export function AddressActions({ addressId, isDefault, address }: AddressActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteAddress(addressId);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSetDefault() {
    setIsLoading(true);
    try {
      const result = await setDefaultAddress(addressId);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <EditAddressForm address={address} />
      {!isDefault && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSetDefault}
          disabled={isLoading}
        >
          Set Default
        </Button>
      )}
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-red-600 hover:text-red-700"
        onClick={handleDelete}
        disabled={isLoading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
