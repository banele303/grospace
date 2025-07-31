"use client";

import React, { useState, useEffect } from "react";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

interface ClientKindeProviderProps {
  children: React.ReactNode;
}

export function ClientKindeProvider({ children }: ClientKindeProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted (client-side only)
  if (!isMounted) {
    return <>{children}</>;
  }

  // If there was an error with Kinde, render without it
  if (hasError) {
    console.warn("Kinde provider failed to initialize, running without authentication");
    return <>{children}</>;
  }

  try {
    return (
      <KindeProvider>
        {children}
      </KindeProvider>
    );
  } catch (error) {
    console.error("KindeProvider Error:", error);
    setHasError(true);
    return <>{children}</>;
  }
}
