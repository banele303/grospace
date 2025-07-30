"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createAddress } from "@/app/lib/address-actions";
import { toast } from "sonner";

export function AddAddressForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await createAddress(formData);
      
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        // Reset form
        const form = document.getElementById('add-address-form') as HTMLFormElement;
        form?.reset();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Add a new delivery or billing address to your account.
          </DialogDescription>
        </DialogHeader>
        
        <form id="add-address-form" action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Address Type</Label>
              <Select name="type" defaultValue="HOME">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOME">Home</SelectItem>
                  <SelectItem value="WORK">Work</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Address Label *</Label>
              <Input
                id="label"
                name="label"
                placeholder="e.g., Home, Office, etc."
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              name="company"
              placeholder="Company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1">Street Address *</Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              placeholder="Street address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Apartment, suite, etc. (Optional)</Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              placeholder="Apt, suite, floor, etc."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                placeholder="City"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                name="state"
                placeholder="State"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="Postal code"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select name="country" defaultValue="South Africa">
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                  <SelectItem value="Botswana">Botswana</SelectItem>
                  <SelectItem value="Lesotho">Lesotho</SelectItem>
                  <SelectItem value="Eswatini">Eswatini (Swaziland)</SelectItem>
                  <SelectItem value="Namibia">Namibia</SelectItem>
                  <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                  <SelectItem value="Zambia">Zambia</SelectItem>
                  <SelectItem value="Malawi">Malawi</SelectItem>
                  <SelectItem value="Mozambique">Mozambique</SelectItem>
                  <SelectItem value="Angola">Angola</SelectItem>
                  <SelectItem value="Madagascar">Madagascar</SelectItem>
                  <SelectItem value="Mauritius">Mauritius</SelectItem>
                  <SelectItem value="Seychelles">Seychelles</SelectItem>
                  <SelectItem value="Comoros">Comoros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+27 12 345 6789"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isDefault" name="isDefault" />
            <Label
              htmlFor="isDefault"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default address
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
