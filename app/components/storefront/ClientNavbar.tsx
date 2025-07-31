"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";

export function ClientNavbar() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a loading navbar or skeleton
    return (
      <header className="sticky top-0 z-40 w-full bg-white">
        <nav className="container mx-auto flex items-center justify-between p-2">
          <div className="h-16 w-full animate-pulse bg-gray-200 rounded"></div>
        </nav>
      </header>
    );
  }

  return <Navbar />;
}
