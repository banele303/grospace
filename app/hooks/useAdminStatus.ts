'use client';

import { useEffect, useState } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { ADMIN_EMAIL } from '@/app/lib/admin-config';

interface AdminStatusState {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAdminStatus(): AdminStatusState {
  const [state, setState] = useState<AdminStatusState>({
    isAdmin: false,
    isLoading: true,
    error: null,
  });
  
  const { isAuthenticated, isLoading: authLoading, user } = useKindeBrowserClient();

  useEffect(() => {
    // Log current state for debugging
    console.log('useAdminStatus: Current state:', { 
      authLoading, 
      isAuthenticated, 
      user: user ? { id: user.id, email: user.email } : null
    });
    
    // Don't check if auth is still loading
    if (authLoading) {
      console.log('useAdminStatus: Auth still loading');
      return; // Keep loading state
    }
    
    // If not authenticated, definitely not admin
    if (!isAuthenticated || !user) {
      console.log('useAdminStatus: Not authenticated or no user');
      setState({
        isAdmin: false,
        isLoading: false,
        error: null,
      });
      return;
    }

    // Check if admin by email
    const isAdminUser = user.email === ADMIN_EMAIL;
    
    console.log('useAdminStatus: Admin check result:', { 
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
