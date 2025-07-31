"use client";

import { ReactNode } from "react";
import { VendorDashboardSidebar } from "@/app/components/vendor/VendorDashboardSidebar";
import { VendorHeaderClient } from "@/app/components/vendor/VendorHeaderClient";
import { ThemeProvider } from "@/app/components/theme/theme-provider";
import UploadthingProvider from "@/app/lib/providers/UploadthingProvider";

// This is a client component wrapper to avoid server components being bundled with client code
export function VendorLayoutClient({ 
  children,
  vendorName = 'Vendor',
  userEmail = ''
}: { 
  children: ReactNode;
  vendorName?: string;
  userEmail?: string;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <UploadthingProvider>
        <div className="min-h-screen">
          <div className="flex min-h-screen">
            {/* Sticky Sidebar for desktop */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-20">
              <VendorDashboardSidebar />
            </div>

            {/* Main content with padding for sidebar */}
            <div className="flex-1 flex flex-col lg:pl-64">
              {/* Sticky header */}
              <div className="sticky top-0 z-10">
                <VendorHeaderClient vendorName={vendorName} userEmail={userEmail} />
              </div>
              <main className="flex-1 py-8 px-8">
                {children}
              </main>
            </div>
          </div>
        </div>
      </UploadthingProvider>
    </ThemeProvider>
  );
}
