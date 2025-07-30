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
  delay = 100
}: UseAuthRedirectOptions = {}) {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true);
      
      if (requiredAuth && !isAuthenticated && !user) {
        setShouldRedirect(true);
        const timer = setTimeout(() => {
          router.push(redirectTo);
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, isLoading, user, requiredAuth, redirectTo, delay, router]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !authChecked,
    authChecked,
    shouldRedirect
  };
}
