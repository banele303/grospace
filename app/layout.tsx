import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/jodit-editor.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import { ClientKindeProvider } from "@/app/components/providers/ClientKindeProvider";
import { PostHogProvider } from "@/app/components/providers/PostHogProvider";
import { CartProvider } from './context/CartContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GroSpace - Cultivating Growth and Sustainability",
  description: "Your one-stop shop for all your shoe needs",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden bg-white dark:bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextSSRPlugin
        routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <CartProvider>
        <ClientKindeProvider>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </ClientKindeProvider>
        <Toaster position="top-center" richColors closeButton />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
