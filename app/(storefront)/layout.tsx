import { type ReactNode } from "react";
import { ClientNavbar } from "../components/storefront/ClientNavbar";
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
      <div className="flex flex-col min-h-screen bg-white">
        <ClientNavbar />
        <main className="flex-1 w-full mx-auto bg-white">{children}</main>
        <Toaster />
        <Footer />
      </div>
    </CartProvider>
  );
}
