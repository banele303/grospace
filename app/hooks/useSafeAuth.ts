'use client'

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

interface SafeAuthState {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMounted: boolean;
}

export function useSafeAuth(): SafeAuthState {
  const [isMounted, setIsMounted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Always call hooks, but handle errors gracefully
  const kindeState = useKindeBrowserClient();

  // Add effect to retry getting auth state if not loading but no user
  useEffect(() => {
    if (isMounted && !kindeState?.isLoading && !kindeState?.user && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log("Retrying auth state check...");
        setRetryCount(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isMounted, kindeState?.isLoading, kindeState?.user, retryCount]);

  // Log state for debugging (only log when there are meaningful changes)
  useEffect(() => {
    if (isMounted) {
      console.log("useSafeAuth state:", {
        isLoading: kindeState?.isLoading,
        isAuthenticated: kindeState?.isAuthenticated,
        user: kindeState?.user ? { id: kindeState.user.id, email: kindeState.user.email } : null,
        retryCount
      });
    }
  }, [isMounted, kindeState?.isLoading, kindeState?.isAuthenticated, kindeState?.user?.id, retryCount]);

  // Return safe state until we're on the client side
  if (!isMounted) {
    return { 
      user: null, 
      isLoading: true, 
      isAuthenticated: false, 
      isMounted: false 
    };
  }

  // Return actual state when mounted and kinde is available
  return {
    user: kindeState?.user || null,
    isLoading: kindeState?.isLoading || false,
    isAuthenticated: kindeState?.isAuthenticated || false,
    isMounted: true
  };
}
