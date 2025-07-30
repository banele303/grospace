"use client";

import { Navbar } from "../components/storefront/Navbar";

interface VendorsLayoutProps {
  children: React.ReactNode;
}

export function VendorsLayout({ children }: VendorsLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
