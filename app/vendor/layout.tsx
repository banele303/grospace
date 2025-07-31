import { ReactNode } from "react";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { VendorLayoutClient } from "./VendorLayoutClient";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export default async function VendorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser(true);
  
  if (!user) {
    return redirect("/auth-error");
  }

  // Check if user has vendor role and vendor profile
  if (user.role !== UserRole.VENDOR || !user.vendors || user.vendors.length === 0) {
    return redirect("/vendors/register");
  }

  const vendor = user.vendors[0];
  
  // Allow access to vendor dashboard regardless of approval status
  // The dashboard itself will handle the pending state
  
  // Pass only the necessary data from server to client components
  return (
    <VendorLayoutClient 
      vendorName={vendor.name} 
      userEmail={user.email || ''}
    >
      {children}
    </VendorLayoutClient>
  );
}
