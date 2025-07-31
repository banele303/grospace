'use client'

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

interface KindeUser {
  id: string;
  email: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
}

interface AuthState {
  user: KindeUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuthState() {
  const [mounted, setMounted] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  const kinde = useKindeBrowserClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && kinde) {
      setAuthState({
        user: kinde.user as KindeUser | null,
        isLoading: kinde.isLoading ?? false,
        isAuthenticated: kinde.isAuthenticated ?? false
      });
    }
  }, [mounted, kinde?.user, kinde?.isLoading, kinde?.isAuthenticated]);

  // If server says authenticated but client doesn't, check once
  useEffect(() => {
    if (mounted && !kinde?.isLoading && !kinde?.isAuthenticated) {
      // Check server auth state once
      fetch('/api/auth/debug')
        .then(res => res.json())
        .then(data => {
          if (data.authenticated && !kinde?.isAuthenticated) {
            console.log("Auth state mismatch detected - server authenticated, client not");
            // Set a flag to show user as authenticated based on server state
            setAuthState(prev => ({
              ...prev,
              user: data.user,
              isAuthenticated: true,
              isLoading: false
            }));
          }
        })
        .catch(err => console.error("Auth state check failed:", err));
    }
  }, [mounted, kinde?.isLoading, kinde?.isAuthenticated]);

  if (!mounted) {
    return { user: null, isLoading: true, isAuthenticated: false };
  }

  return authState;
}
