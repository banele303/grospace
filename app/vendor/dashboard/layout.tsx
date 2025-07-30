import { ReactNode } from "react";

export default function VendorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      {children}
    </div>
  );
}
