import { ReactNode } from "react";

export default function VendorPendingLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Simple layout for pending vendor page - no approval check needed
  return <>{children}</>;
}
