"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Eye, Trash2, MoreHorizontal, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ProductActionsProps {
  productId: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      setIsDeleteDialogOpen(false); // Automatically close the modal on success
      router.refresh(); // Refresh the page to update the product list
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting the product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/vendor/dashboard/products/${productId}`} className="flex items-center cursor-pointer">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/vendor/dashboard/products/${productId}/edit`} className="flex items-center cursor-pointer">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={openDeleteDialog}
            className="text-red-600 cursor-pointer flex items-center"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Product
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-3 p-4 border border-red-100 bg-red-50 rounded-md">
            <p className="text-sm text-red-800">
              Deleting this product will remove it from your inventory and it will no longer be available for purchase.
              All associated data like reviews and images may also be removed.
            </p>
          </div>

          <DialogFooter className="sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-1"
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

