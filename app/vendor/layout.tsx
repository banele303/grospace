import { ReactNode } from "react";
import { requireVendor } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { VendorLayoutClient } from "./VendorLayoutClient";

export default async function VendorLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Properly destructure the result from requireVendor()
  let user;
  let vendor;
  try {
    const result = await requireVendor();
    user = result.user;
    vendor = result.vendor;
  } catch (error) {
    return redirect("/vendors/register");
  }

  // Pass only the necessary data from server to client components
  // This avoids sending server-side objects to client components
  return (
    <VendorLayoutClient 
      vendorName={vendor.name} 
      userEmail={user.email || ''}
    >
      {children}
    </VendorLayoutClient>
  );
}
