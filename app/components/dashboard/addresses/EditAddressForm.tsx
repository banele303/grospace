"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { updateAddress } from "@/app/lib/address-actions";
import { toast } from "sonner";

interface EditAddressFormProps {
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

export function EditAddressForm({ address }: EditAddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await updateAddress(address.id, formData);
      
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
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
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>
            Update your delivery or billing address information.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Address Type</Label>
              <Select name="type" defaultValue={address.type}>
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
                defaultValue={address.label}
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
                defaultValue={address.firstName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                defaultValue={address.lastName}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              placeholder="Company (optional)"
              defaultValue={address.company || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1 *</Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              placeholder="Street address"
              defaultValue={address.addressLine1}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              placeholder="Apartment, suite, etc. (optional)"
              defaultValue={address.addressLine2 || ""}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                placeholder="City"
                defaultValue={address.city}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                name="state"
                placeholder="State"
                defaultValue={address.state}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="Postal code"
                defaultValue={address.postalCode}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select name="country" defaultValue={address.country}>
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+27 12 345 6789"
              defaultValue={address.phone || ""}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isDefault" 
              name="isDefault"
              defaultChecked={address.isDefault}
            />
            <Label htmlFor="isDefault" className="text-sm">
              Set as default address
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
