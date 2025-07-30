import { requireVendor } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import InventoryClient from "./InventoryClient";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  let user;
  let vendor;

  try {
    const result = await requireVendor();
    user = result.user;
    vendor = result.vendor;
  } catch (error) {
    return redirect("/vendors/register");
  }

  return (
    <InventoryClient 
      vendorName={vendor.name} 
      userEmail={user.email}
    />
  );
}
