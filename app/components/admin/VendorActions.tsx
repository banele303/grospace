"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Play, 
  Trash2,
  Eye
} from "lucide-react";
import { 
  approveVendor, 
  rejectVendor, 
  toggleVendorStatus, 
  deleteVendor 
} from "@/app/lib/admin-actions";
import { toast } from "sonner";

interface VendorActionsProps {
  vendor: {
    id: string;
    approved: boolean;
    name: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export function VendorActions({ vendor }: VendorActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleApprove() {
    setIsLoading(true);
    try {
      const result = await approveVendor(vendor.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReject() {
    setIsLoading(true);
    try {
      const result = await rejectVendor(vendor.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleStatus() {
    setIsLoading(true);
    try {
      const isActive = vendor.approved;
      const result = await toggleVendorStatus(vendor.id, !isActive);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = confirm(`Are you sure you want to delete ${vendor.name}? This action cannot be undone.`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const result = await deleteVendor(vendor.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(vendor.id)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Copy vendor ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          {!vendor.approved && (
            <>
              <DropdownMenuItem onClick={handleApprove}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Approve vendor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                Reject vendor
              </DropdownMenuItem>
            </>
          )}

          {vendor.approved && (
            <DropdownMenuItem onClick={handleToggleStatus}>
              <Ban className="mr-2 h-4 w-4 text-orange-600" />
              Block vendor
            </DropdownMenuItem>
          )}

          {!vendor.approved && (
            <DropdownMenuItem onClick={handleToggleStatus}>
              <Play className="mr-2 h-4 w-4 text-green-600" />
              Activate vendor
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDelete}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete vendor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
