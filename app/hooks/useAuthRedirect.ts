'use client'

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseAuthRedirectOptions {
  redirectTo?: string;
  requiredAuth?: boolean;
  delay?: number;
}

export function useAuthRedirect({
  redirectTo = '/api/auth/login',
  requiredAuth = true,
  delay = 1000 // Increased delay to prevent loops
}: UseAuthRedirectOptions = {}) {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Give more time for auth to settle
    const checkTimer = setTimeout(() => {
      if (!isLoading) {
        setAuthChecked(true);
        
        // Check server auth state before redirecting
        fetch('/api/auth/setup')
          .then(res => res.json())
          .then(data => {
            if (requiredAuth && !isAuthenticated && !user && !data.authenticated) {
              setShouldRedirect(true);
              const timer = setTimeout(() => {
                router.push(redirectTo);
              }, delay);
              return () => clearTimeout(timer);
            }
          })
          .catch(() => {
            // If server check fails, use client state
            if (requiredAuth && !isAuthenticated && !user) {
              setShouldRedirect(true);
              const timer = setTimeout(() => {
                router.push(redirectTo);
              }, delay);
              return () => clearTimeout(timer);
            }
          });
      }
    }, 500); // Wait 500ms before checking

    return () => clearTimeout(checkTimer);
  }, [isAuthenticated, isLoading, user, requiredAuth, redirectTo, delay, router]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !authChecked,
    authChecked,
    shouldRedirect
  };
}
