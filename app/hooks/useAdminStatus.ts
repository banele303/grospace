'use client';

import { useEffect, useState } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

interface AdminStatusState {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

// Simple admin check - directly compare email
const ADMIN_EMAIL = "alexsouthflow3@gmail.com";

export function useAdminStatus(): AdminStatusState {
  const [state, setState] = useState<AdminStatusState>({
    isAdmin: false,
    isLoading: true,
    error: null,
  });
  
  const { isAuthenticated, isLoading: authLoading, user } = useKindeBrowserClient();

  useEffect(() => {
    // Don't check if auth is still loading
    if (authLoading) {
      return; // Keep loading state
    }
    
    // If not authenticated, definitely not admin
    if (!isAuthenticated || !user) {
      setState({
        isAdmin: false,
        isLoading: false,
        error: null,
      });
      return;
    }

    // Check if admin by email
    const isAdminUser = user.email === ADMIN_EMAIL;
    
    console.log('Admin status check result:', { 
      email: user.email, 
      adminEmail: ADMIN_EMAIL,
      isAdmin: isAdminUser
    });
    
    setState({
      isAdmin: isAdminUser,
      isLoading: false,
      error: null,
    });
  }, [isAuthenticated, authLoading, user]);

  return state;
}
