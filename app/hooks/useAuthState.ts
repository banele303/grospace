'use client'

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

export function useAuthState() {
  const { user, isLoading: kindeLoading } = useKindeBrowserClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return loading state until we're on the client side
  if (!isClient) {
    return { user: null, isLoading: true };
  }

  return { user, isLoading: kindeLoading };
}
