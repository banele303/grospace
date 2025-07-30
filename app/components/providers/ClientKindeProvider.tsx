"use client";

import React from "react";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

interface ClientKindeProviderProps {
  children: React.ReactNode;
}

export function ClientKindeProvider({ children }: ClientKindeProviderProps) {
  // Add error boundary to catch potential issues
  try {
    return (
      <KindeProvider>
        {children}
      </KindeProvider>
    );
  } catch (error) {
    console.error("KindeProvider Error:", error);
    // Fallback to render children without Kinde provider
    return <>{children}</>;
  }
}
