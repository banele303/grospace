'use client'

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

interface AuthState {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMounted: boolean;
}

export function useForceAuthState(): AuthState {
  const [isMounted, setIsMounted] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Force a recheck of auth state every 2 seconds for the first 10 seconds
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 2000);
    
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const kindeState = useKindeBrowserClient();

  // Force Kinde to check auth state if server says we're authenticated but client doesn't
  useEffect(() => {
    if (isMounted && !kindeState.isLoading && !kindeState.isAuthenticated) {
      // Check if server thinks we're authenticated
      fetch('/api/auth/debug')
        .then(res => res.json())
        .then(data => {
          if (data.authenticated && !kindeState.isAuthenticated) {
            console.log("Server authenticated but client not - forcing page refresh");
            // Force a page refresh to sync state
            window.location.reload();
          }
        })
        .catch(err => console.error("Auth check failed:", err));
    }
  }, [isMounted, kindeState.isLoading, kindeState.isAuthenticated, forceUpdate]);

  if (!isMounted) {
    return { 
      user: null, 
      isLoading: true, 
      isAuthenticated: false, 
      isMounted: false 
    };
  }

  return {
    user: kindeState.user || null,
    isLoading: kindeState.isLoading || false,
    isAuthenticated: kindeState.isAuthenticated || false,
    isMounted: true
  };
}
