import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2, Home, Building2 } from "lucide-react";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/db";
import { AddAddressForm } from "../../components/dashboard/addresses/AddAddressForm";
import { AddressActions } from "../../components/dashboard/addresses/AddressActions";

async function getUserAddresses(userId: string) {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' }
    ]
  });
}

function AddressCard({ address }: { address: any }) {
  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'HOME':
        return <Home className="h-5 w-5" />;
      case 'WORK':
        return <Building2 className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  return (
    <Card className="relative group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getAddressIcon(address.type)}
            <CardTitle className="text-lg">{address.label}</CardTitle>
            {address.isDefault && (
              <Badge variant="secondary" className="text-xs">
                Default
              </Badge>
            )}
          </div>
          <AddressActions addressId={address.id} isDefault={address.isDefault} address={address} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="text-sm">
          <p className="font-medium">
            {address.firstName} {address.lastName}
          </p>
          {address.company && (
            <p className="text-muted-foreground">{address.company}</p>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
          {address.phone && <p>{address.phone}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AddressesPage() {
  noStore();
  const user = await getCurrentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const addresses = await getUserAddresses(user.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Addresses</h1>
          <p className="text-muted-foreground">
            Manage your delivery and billing addresses
          </p>
        </div>
        <AddAddressForm />
      </div>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No addresses found</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Add your first address to make checkout faster and easier. You can add multiple addresses for different purposes.
            </p>
            <AddAddressForm />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        </>
      )}

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <h4 className="font-medium">Delivery Address</h4>
              <p className="text-sm text-muted-foreground">
                Make sure your delivery address is accurate and includes any special delivery instructions.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Billing Address</h4>
              <p className="text-sm text-muted-foreground">
                Your billing address should match the address on your payment method for security.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Default Address</h4>
              <p className="text-sm text-muted-foreground">
                Set a default address to speed up the checkout process for future orders.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Multiple Addresses</h4>
              <p className="text-sm text-muted-foreground">
                Add work, home, or gift delivery addresses to send orders wherever you need them.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
