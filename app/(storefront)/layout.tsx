import { type ReactNode } from "react";
import { Navbar } from "../components/storefront/Navbar";
import { Footer } from "../components/storefront/Footer";
import { Toaster } from "sonner";
import "./config";
import { CartProvider } from "@/app/context/CartContext";

export default function StoreFrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full mx-auto">{children}</main>
        <Toaster />
        <Footer />
      </div>
    </CartProvider>
  );
}
