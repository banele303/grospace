'use client';

import { useEffect, useState } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

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
    async function checkAdminStatus() {
      // Wait for auth to complete
      if (authLoading) return;
      
      // If not authenticated, definitely not admin
      if (!isAuthenticated || !user?.id) {
        setState({
          isAdmin: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const response = await fetch('/api/debug/admin');
        
        if (response.ok) {
          const data = await response.json();
          setState({
            isAdmin: data.adminStatus || false,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            isAdmin: false,
            isLoading: false,
            error: `API call failed: ${response.status}`,
          });
        }
      } catch (error) {
        setState({
          isAdmin: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    checkAdminStatus();
  }, [isAuthenticated, authLoading, user?.id]);

  return state;
}
